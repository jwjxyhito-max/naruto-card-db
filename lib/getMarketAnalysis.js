import {marketAnalysis as fallbackMarketAnalysis} from "./marketAnalysis";

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
    return {...fallbackMarketAnalysis,dataSource:"fallback",isStale:true};
  }

  try{
    const endpoint=`${url}/rest/v1/naruto_market_analysis?select=payload,analyzed_at&order=analyzed_at.desc&limit=2`;
    const res=await fetch(endpoint,{
      headers:{apikey:key,Authorization:`Bearer ${key}`},
      cache:"no-store"
    });
    if(!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
    const rows=await res.json();
    if(!rows?.[0]?.payload) throw new Error("No Naruto market analysis rows");

    const analyzedAt=rows[0].analyzed_at;
    const ageMs=Date.now()-new Date(analyzedAt).getTime();
    const ageHours=Number.isFinite(ageMs)?ageMs/3600000:999;
    const latest=rows[0].payload;
    const previous=rows[1]?.payload||null;
    const previousById=new Map((previous?.picks||[]).map(p=>[p.id,p]));

    const latestPicks=latest.picks||fallbackMarketAnalysis.picks;\n    const latestIds=new Set(latestPicks.map(p=>p.id));\n    const picks=latestPicks.map(p=>{
      const prev=previousById.get(p.id);
      const parseYen=v=>Number(String(v||"").replace(/[^0-9]/g,""))||null;
      const currentPrice=parseYen(p.price);
      const previousPrice=parseYen(prev?.price);
      const priceChange=currentPrice&&previousPrice?currentPrice-previousPrice:null;
      return {
        ...p,
        previousRank:prev?.rank||null,
        previousPrice:prev?.price||null,
        priceChange,
        priceChangeText:priceChange===null?null:priceChange===0?"変化なし":priceChange<0?`${Math.abs(priceChange).toLocaleString("ja-JP")}円値下げ`:`${priceChange.toLocaleString("ja-JP")}円値上げ`,
        rankChange:prev?.rank&&p.rank?Number(prev.rank)-Number(p.rank):null
      };
    });

    return {
      ...fallbackMarketAnalysis,
      ...latest,
      picks,
      updatedAt:formatJst(analyzedAt),
      dataSource:"supabase",
      isStale:ageHours>5,
      ageHours
    };
  }catch(error){
    console.error("Naruto market analysis fallback:",error);
    return {...fallbackMarketAnalysis,dataSource:"fallback",isStale:true};
  }
}
