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
      const soldReported=reportIsNewer&&["sold_reported","sold_confirmed"].includes(listing.status);
      const listingStatus=soldReported?listing.status:ageHours>4?"stale":"analysis_snapshot";
      const displayPrice=String(p.price||"").match(/¥[0-9,]+(?:\.[0-9]+)?/)?.[0]||p.price;
      const currentPrice=parseYen(p.price);
      const previousPriceValue=parseYen(prev?.price);
      const priceChange=currentPrice!==null&&previousPriceValue!==null
        ? currentPrice-previousPriceValue
        : null;

      return {
        ...p,
        displayPrice,
        listingStatus,
        listingCheckedAt:soldReported?formatJst(listing.checked_at):formatJst(analyzedAt),
        displayJudge:soldReported?"売り切れ報告あり":ageHours>4?"出品状況の再確認が必要":p.judge,
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
