import {cards} from "../lib/cards";
export default function sitemap(){
 const base="https://naruto-card-db.vercel.app";
 const characters=[...new Set(cards.map(c=>c.character).filter(Boolean))];
 const years=[...new Set(cards.map(c=>String(c.release||"").match(/^(20\d{2})/)?.[1]).filter(Boolean))].sort();
 const staticPages=["","/cards","/promo","/ranking","/analysis","/psa","/psa-simulator","/search","/storage-guide"];
 return [
  ...staticPages.map(path=>({url:base+path,lastModified:new Date()})),
  ...cards.map(c=>({url:base+"/card/"+encodeURIComponent(c.id),lastModified:new Date()})),
  ...characters.map(name=>({url:base+"/character/"+encodeURIComponent(name),lastModified:new Date()})),
  ...years.map(year=>({url:base+"/year/"+year,lastModified:new Date()}))
 ];
}