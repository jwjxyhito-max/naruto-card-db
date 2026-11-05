export const MERCARI_AFFILIATE_ID="8894724555";

export function mercariSearchKeyword(card){
 const id=String(card?.id??"").trim();
 const name=String(card?.name??"").trim();
 return [id,name,"カードダス"].filter(Boolean).join(" ");
}

export function mercariSearchUrl(card){
 const url=new URL("https://jp.mercari.com/search");
 url.searchParams.set("afid",MERCARI_AFFILIATE_ID);
 url.searchParams.set("keyword",mercariSearchKeyword(card));
 return url.href;
}
