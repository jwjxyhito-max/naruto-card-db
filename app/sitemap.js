import {cards} from "../lib/cards";
export default function sitemap(){
 const base="https://naruto-card-db.vercel.app";
 const characters=[...new Set(cards.map(c=>c.character).filter(Boolean))];
 // Match app/year/[year]/page.js. Card text also mentions 2004, and that route returns 404.
 const years=["2002","2003","2005","2006"];
 const staticPages=["","/cards","/promo","/promo/tournament","/ranking","/analysis","/news","/psa","/psa-ranking","/psa-simulator","/storage-guide","/shippuden","/guide/card-storage","/recommended"];
 return [
  ...staticPages.map(path=>({url:base+path})),
  ...cards.map(c=>({url:base+"/card/"+encodeURIComponent(c.id)})),
  ...characters.map(name=>({url:base+"/character/"+encodeURIComponent(name)})),
  ...years.map(year=>({url:base+"/year/"+year}))
 ];
}
