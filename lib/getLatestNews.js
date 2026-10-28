import { normalizeNewsRows } from './newsFormatting.mjs';

export async function getLatestNews(limit=20){
 const url=process.env.SUPABASE_URL;
 const key=process.env.SUPABASE_ANON_KEY;
 if(!url||!key) return [];
 try{
  const fetchLimit=Math.max(limit*3,60);
  const endpoint=`${url}/rest/v1/naruto_latest_news?select=id,title,url,source,category,summary,importance,published_at,published_date,captured_at&order=published_date.desc.nullslast,published_at.desc.nullslast,captured_at.desc&limit=${fetchLimit}`;
  const res=await fetch(endpoint,{
   headers:{apikey:key,Authorization:`Bearer ${key}`},
   next:{revalidate:1800,tags:['naruto-news']}
  });
  if(!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
  const rows=await res.json();
  return normalizeNewsRows(rows,limit);
 }catch(error){
  console.error("Naruto latest news fallback:",error);
  return [];
 }
}
