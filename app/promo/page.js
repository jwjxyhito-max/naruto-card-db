import {cards} from "../../lib/cards";
export const metadata={title:"NARUTOプロモカード一覧 | NARUTO旧カードDB",description:"NARUTO旧カードのPR忍・PR作・PR忍伝・PR術・PR騎・PR依・OP忍を系統別に整理したプロモーションカード一覧。"};
const groups=[
 ["PR忍","PR忍"],
 ["PR作","PR作"],
 ["PR忍伝","PR忍伝"],
 ["PR術","PR術"],
 ["PR騎","PR騎"],
 ["PR依","PR依"],
 ["OP忍","OP忍"]
];
const num=id=>Number(String(id).split("-")[1])||999999;
export default function Page(){
 const all=cards.filter(c=>/^PR|^OP忍-/.test(String(c.id)));
 return <main><a className="back" href="/">← TOP</a><section className="detail">
  <span className="eyebrow">PROMO CARDS / {all.length} RECORDS</span>
  <h1>プロモカード一覧</h1>
  <p>プロモを系統別に分けて番号順で確認できます。配布経路や一次資料が未確認の項目は詳細ページに明記します。</p>
  <div className="miniLinks"><a href="/cards">忍カード一覧を見る →</a>{groups.map(([key])=><a key={key} href={"#"+encodeURIComponent(key)}>{key} →</a>)}</div>
  {groups.map(([key,label])=>{
   const list=all.filter(c=>String(c.id).startsWith(key+"-")).sort((a,b)=>num(a.id)-num(b.id));
   if(!list.length)return null;
   return <section key={key} id={key} style={{scrollMarginTop:80}}>
    <div className="sectionHead"><h2>{label}</h2><span>{list.length} RECORDS</span></div>
    <div className="grid">{list.map(c=><a className="card" href={"/card/"+encodeURIComponent(c.id)} key={c.id}>
     <div className="rank">{c.rank}</div><div className="num">{c.id}</div><h3>{c.name}</h3><p>{c.character} / {c.series}</p><b>{c.id}の詳細を見る →</b>
    </a>)}</div>
   </section>;
  })}
 </section></main>;
}