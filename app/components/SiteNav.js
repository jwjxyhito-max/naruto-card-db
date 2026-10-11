"use client";

import {usePathname} from "next/navigation";

const links=[
 {href:"/",label:"トップ",icon:"home"},
 {href:"/cards",label:"カード",icon:"cards"},
 {href:"/news",label:"ニュース",icon:"news"},
 {href:"/analysis",label:"相場分析",icon:"chart"},
 {href:"/promo",label:"プロモ",icon:"star"}
];

function Icon({name}){
 const paths={
  home:<><path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9M9 21v-8h6v8"/></>,
  cards:<><rect x="7" y="3" width="14" height="18" rx="2"/><path d="M3 6v13a2 2 0 0 0 2 2M11 8h6M11 12h6M11 16h4"/></>,
  news:<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h4M7 16h4M15 12h2M15 16h2"/></>,
  chart:<><path d="M4 3v17h17M8 15l4-5 4 2 5-7"/></>,
  star:<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>
 };
 return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function SiteNav(){
 const pathname=usePathname();
 let cardId="";
 if(pathname.startsWith("/card/")){try{cardId=decodeURIComponent(pathname.slice(6));}catch{cardId=pathname.slice(6);}}
 const active=pathname==="/"?"/":pathname==="/news"?"/news":pathname==="/analysis"?"/analysis":
  pathname==="/promo"||/^(PR|OP忍-)/.test(cardId)?"/promo":
  pathname==="/cards"||pathname==="/search"||cardId||pathname.startsWith("/character/")||pathname.startsWith("/year/")||pathname==="/shippuden"?"/cards":"";
 return <nav className="siteNav" aria-label="主要メニュー">
  {links.map(link=><a href={link.href} key={link.href} aria-current={active===link.href?"page":undefined}>
   <Icon name={link.icon}/><span>{link.label}</span>
  </a>)}
 </nav>;
}
