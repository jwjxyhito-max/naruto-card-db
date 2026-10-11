import {cards} from "../lib/cards";
export default function sitemap(){
 const base="https://naruto-card-db.vercel.app";
 const characters=[...new Set(cards.map(c=>c.character).filter(Boolean))];
 const years=[...new Set(cards.map(c=>String(c.release||"").match(/^(20\d{2})/)?.[1]).filter(Boolean))].sort();
 const staticPages=["","/cards","/promo","/ranking","/analysis","/news","/psa","/psa-ranking","/psa-simulator","/storage-guide","/shippuden","/guide/card-storage","/recommended"];
 return [
  ...staticPages.map(path=>({url:base+path})),
  ...cards.map(c=>({url:base+"/card/"+encodeURIComponent(c.id)})),
  ...characters.map(name=>({url:base+"/character/"+encodeURIComponent(name)})),
  ...years.map(year=>({url:base+"/year/"+year}))
 ];
}
