import {cards} from "../lib/cards";
import contentDates from '../data/content-dates.json';
import {getCardResearchIndex} from '../lib/getCardResearch';
import {getLatestNews} from '../lib/getLatestNews';

export const revalidate=3600;
const latestDate=(...values)=>values.filter(v=>v&&Number.isFinite(Date.parse(v))).sort((a,b)=>Date.parse(b)-Date.parse(a))[0];
export default async function sitemap(){
 const base="https://naruto-card-db.vercel.app";
 const characters=[...new Set(cards.map(c=>c.character).filter(Boolean))];
 // Match app/year/[year]/page.js. Card text also mentions 2004, and that route returns 404.
 const years=["2002","2003","2005","2006"];
 const staticPages=["","/naruto-card-game-2027","/cards","/promo","/promo/tournament","/ranking","/analysis","/news","/psa","/psa-ranking","/psa-simulator","/storage-guide","/shippuden","/guide/card-storage","/recommended"];
 const [research,news]=await Promise.all([getCardResearchIndex(),getLatestNews(1)]);
 const byId=new Map((research||[]).map(r=>[r.card_id,r.snapshot_date]));
 const cardDate=latestDate(contentDates['lib/cards.js'],contentDates['lib/dailyResearch.js'],contentDates['lib/deepAnalysisRecords.js']);
 const ids=[...new Set([...cards.map(c=>c.id),...byId.keys()])];
 return [
  ...staticPages.map(path=>({url:base+path,lastModified:latestDate(contentDates[`app${path}/page.js`],path==='/news'?news[0]?.published_date:null,path===''?cardDate:null)})),
  ...ids.map(id=>({url:base+"/card/"+encodeURIComponent(id),lastModified:latestDate(cardDate,byId.get(id))})),
  ...characters.map(name=>({url:base+"/character/"+encodeURIComponent(name),lastModified:cardDate})),
  ...years.map(year=>({url:base+"/year/"+year,lastModified:cardDate}))
 ];
}
