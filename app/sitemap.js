import {cards} from "../lib/cards";
export default function sitemap(){
 const base="https://naruto-card-db.vercel.app";
 const characters=[...new Set(cards.map(c=>c.character).filter(Boolean))];
 const staticPages=["","/cards","/ranking","/analysis"];
 return [
  ...staticPages.map(path=>({url:base+path,lastModified:new Date()})),
  ...cards.map(c=>({url:base+"/card/"+encodeURIComponent(c.id),lastModified:new Date()})),
  ...characters.map(name=>({url:base+"/character/"+encodeURIComponent(name),lastModified:new Date()}))
 ];
}