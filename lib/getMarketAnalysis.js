import {marketAnalysis as fallbackMarketAnalysis} from "./marketAnalysis.js";
import {isMarketAnalysis,parseYen} from "./marketAnalysisValidation.mjs";

let lastValid = {...fallbackMarketAnalysis,dataSource:"fallback",droppedPicks:[]};

function formatJst(value){
  const d=new Date(value);
  if(Number.isNaN(d.getTime())) return fallbackMarketAnalysis.updatedAt;
  const parts=new Intl.DateTimeFormat("en-CA",{
    timeZone:"Asia/Tokyo",
    year:"numeric",month:"2-digit",day:"2-digit",
    hour:"2-digit",minute:"2-digit",hour12:false
  }).formatToParts(d).reduce((o,p)=>(o[p.type]=p.value,o),{});
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute} JST`;
}

export async function getMarketAnalysis(){
  const url=process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_ANON_KEY;

  if(!url||!key){
    return {...lastValid,isStale:true};
  }

  try{
    const endpoint=`${url}/rest/v1/naruto_market_analysis?select=id,payload,analyzed_at&order=analyzed_at.desc,id.desc&limit=50`;
    const res=await fetch(endpoint,{
      headers:{apikey:key,Authorization:`Bearer ${key}`},
      cache:"no-store"
    });
    if(!res.ok) throw new Error(`Supabase HTTP ${res.status}`);

    const body=await res.json();
    if (!Array.isArray(body)) throw new Error("Invalid market response");
    const rows=body.filter(r=>isMarketAnalysis(r.payload)&&Number.isFinite(new Date(r.analyzed_at).getTime()));
    if(!rows?.[0]?.payload) throw new Error("No Naruto market analysis rows");

    const analyzedAt=rows[0].analyzed_at;
    // Newer partial research records can omit SOLD links and detailed fields.
    // Keep the last complete, validated analysis for pricing/rank calculations;
    // show newer partial records separately, never as fully verified market picks.
    const newestPartial=body.find(row=>
      row?.payload && !isMarketAnalysis(row.payload) &&
      typeof row.payload.headline==="string" && row.payload.headline.trim() &&
      typeof row.payload.lead==="string" && row.payload.lead.trim() &&
      Number.isFinite(new Date(row.analyzed_at).getTime()) &&
      new Date(row.analyzed_at).getTime()>new Date(analyzedAt).getTime()
    );
    const recentSnapshot=newestPartial?{
      headline:newestPartial.payload.headline.slice(0,240),
      lead:newestPartial.payload.lead.slice(0,1200),
      updatedAt:formatJst(newestPartial.analyzed_at)
    }:null;
    const ageMs=Date.now()-new Date(analyzedAt).getTime();
    const ageHours=Number.isFinite(ageMs)?ageMs/3600000:999;
    const latest=rows[0].payload;
    const previous=rows[1]?.payload||null;

    // Availability reports are separate from historical market snapshots.
    // Failure to read reports must never hide verified SOLD history.
    let listingStatuses=new Map();
    try {
      const statusRes=await fetch(`${url}/rest/v1/naruto_listing_status?select=item_id,status,checked_at`,{
        headers:{apikey:key,Authorization:`Bearer ${key}`},
        cache:"no-store"
      });
      if(statusRes.ok){
        const statusRows=await statusRes.json();
        if(Array.isArray(statusRows)){
          listingStatuses=new Map(statusRows.filter(r=>r?.item_id&&r?.status).map(r=>[r.item_id,r]));
        }
      }
    }catch(error){
      console.warn("Naruto listing status unavailable:",error);
    }

    const latestPicks=latest.picks||fallbackMarketAnalysis.picks;
    const previousPicks=previous?.picks||[];
    const previousById=new Map(previousPicks.map(p=>[p.id,p]));
    const latestIds=new Set(latestPicks.map(p=>p.id));

    const picks=latestPicks.map(p=>{
      const prev=previousById.get(p.id);
      const itemId=String(p.mercariUrl||"").match(/\/item\/(m\d+)/)?.[1];
      const listing=listingStatuses.get(itemId);
      const reportTime=listing?new Date(listing.checked_at).getTime():NaN;
      const reportIsNewer=Number.isFinite(reportTime)&&reportTime>=new Date(analyzedAt).getTime();
      // A verified SOLD for the same Mercari item ID stays sold until a newer, independently
      // verified status replaces it. A subsequent market snapshot must not resurrect it.
      const soldConfirmed=listing?.status==="sold_confirmed"&&Number.isFinite(reportTime);
      const soldReported=!soldConfirmed&&reportIsNewer&&listing?.status==="sold_reported";
      const freshAvailable=reportIsNewer&&listing?.status==="available"&&
        reportTime<=Date.now()&&Date.now()-reportTime<=4*3600000;
      const listingStatus=soldConfirmed?"sold_confirmed":soldReported?"sold_reported":
        freshAvailable?"available":ageHours>4?"stale":"analysis_snapshot";
      const soldOut=soldConfirmed||soldReported;
      const displayPrice=String(p.price||"").match(/¥[0-9,]+(?:\.[0-9]+)?/)?.[0]||p.price;
      const displaySummary=soldConfirmed
        ?"掲載商品はメルカリで売り切れ確認済み。以下の価格・分析は販売前の記録で、新たな購入候補ではありません。"
        :soldReported
          ?"売り切れ報告あり（外部独立確認前）。購入候補にはしません。価格・分析は過去記録です。"
          :freshAvailable
            ?"掲載商品がメルカリで販売中と確認されました（確認後の売り切れには注意）。"+String(p.summary||"")
            :"過去の分析時点："+String(p.summary||"")+"／現在の販売状況は未再確認。";
      const currentPrice=parseYen(p.price);
      const previousPriceValue=parseYen(prev?.price);
      const priceChange=currentPrice!==null&&previousPriceValue!==null
        ? currentPrice-previousPriceValue
        : null;

      return {
        ...p,
        displayPrice,
        listingStatus,
        soldOut,
        displaySummary,
        listingCheckedAt:(soldOut||freshAvailable)?formatJst(listing.checked_at):formatJst(analyzedAt),
        displayJudge:soldConfirmed?"売り切れ確認済み":soldReported?"売り切れ報告あり":
          freshAvailable?"販売中を確認":ageHours>4?"出品状況の再確認が必要":p.judge,
        previousRank:prev?.rank||null,
        previousPrice:prev?.price||null,
        priceChange,
        priceChangeText:
          priceChange===null?null:
          priceChange===0?"変化なし":
          priceChange<0?`${Math.abs(priceChange).toLocaleString("ja-JP")}円値下げ`:
          `${priceChange.toLocaleString("ja-JP")}円値上げ`,
        rankChange:prev?.rank&&p.rank?Number(prev.rank)-Number(p.rank):null,
        isNewEntry:!prev
      };
    });

    const droppedPicks=previousPicks.filter(p=>!latestIds.has(p.id));

    lastValid = {
      ...latest,
      picks,
      droppedPicks,
      analysisId:rows[0].id,
      recentSnapshot,
      cadence:"定期相場分析",
      updatedAt:formatJst(analyzedAt),
      dataSource:"supabase",
      isStale:ageHours>30,
      ageHours
    };
    return lastValid;
  }catch(error){
    console.error("Naruto market analysis fallback:",error);
    return {...lastValid,isStale:true};
  }
}
