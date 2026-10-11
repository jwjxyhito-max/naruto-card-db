function formatDate(value){
 const d=new Date(value);
 if(Number.isNaN(d.getTime())) return "";
 return new Intl.DateTimeFormat("ja-JP",{timeZone:"Asia/Tokyo",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
}

export async function getLatestNews(limit=20){
 const url=process.env.SUPABASE_URL;
 const key=process.env.SUPABASE_ANON_KEY;
 if(!url||!key) return [];
 try{
  const fetchLimit=Math.max(limit*3,60);
  const endpoint=`${url}/rest/v1/naruto_latest_news?select=id,title,url,source,category,summary,importance,published_at,captured_at&order=captured_at.desc&limit=${fetchLimit}`;
  const res=await fetch(endpoint,{
   headers:{apikey:key,Authorization:`Bearer ${key}`},
   cache:"no-store"
  });
  if(!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
  const rows=await res.json();
  return rows
   .sort((a,b)=>new Date(b.published_at||b.captured_at)-new Date(a.published_at||a.captured_at))
   .slice(0,limit)
   .map(row=>({...row,publishedLabel:formatDate(row.published_at||row.captured_at)}));
 }catch(error){
  console.error("Naruto latest news fallback:",error);
  return [];
 }
}