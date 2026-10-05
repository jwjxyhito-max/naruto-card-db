import {cards} from "../../lib/cards";
export const metadata={title:"NARUTOプロモカード一覧 | NARUTO旧カードDB",description:"NARUTO旧カードのPR忍・PR術・PR作・OP忍などプロモーションカードをまとめた一覧。"};
export default function Page(){
 const list=cards.filter(c=>/^PR|^OP忍-/.test(String(c.id))).sort((a,b)=>String(a.id).localeCompare(String(b.id),"ja",{numeric:true}));
 return <main><a className="back" href="/">← TOP</a><section className="detail">
  <span className="eyebrow">PROMO CARDS / {list.length} RECORDS</span>
  <h1>プロモカード一覧</h1>
  <p>PR忍・PR術・PR作・PR騎・PR依・OP忍など、通常弾とは別に配布されたプロモーションカードを番号順でまとめています。一次資料未確認の項目は、その旨を詳細ページに明記します。</p>
  <div className="miniLinks"><a href="/cards">忍カード一覧を見る →</a></div>
  <div className="grid">{list.map(c=><a className="card" href={"/card/"+encodeURIComponent(c.id)} key={c.id}>
   <div className="rank">{c.rank}</div><div className="num">{c.id}</div><h2>{c.name}</h2><p>{c.character} / {c.series}</p><b>{c.id}の詳細を見る →</b>
  </a>)}</div>
 </section></main>;
}