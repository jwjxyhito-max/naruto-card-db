import {cards} from "../../lib/cards";

export const metadata={
 title:"NARUTO疾風伝カード｜プロモ一覧・PSA候補",
 description:"NARUTO-ナルト- 疾風伝カードゲームの登録カードを一覧化。プロモカード、キャラクター、相場調査状況を確認し、PSA鑑定候補を探せます。",
 alternates:{canonical:"/shippuden"}
};

export default function Shippuden(){
 const shippuden=cards.filter(c=>/疾風伝|忍伝/.test((c.series||"")+" "+(c.id||"")));
 const psa=shippuden.filter(c=>["A","B","WATCH"].includes(c.rank)).slice(0,10);
 return <main>
  <a className="back" href="/">← NARUTO旧カードDB</a>
  <section className="detail">
   <span className="eyebrow">SHIPPUDEN CARD ARCHIVE</span>
   <h1>NARUTO疾風伝カード</h1>
   <p>疾風伝カードゲームを、カード番号・キャラクター・配布区分・市場調査状況から追う専用入口です。未確認情報は推測で埋めず、確認できた資料とSOLDから更新します。</p>
   <div className="analysisFacts">
    <div><small>現在の登録</small><b>{shippuden.length}枚</b></div>
    <div><small>PSA注目</small><b>{psa.length}枚</b></div>
    <div><small>主な区分</small><b>忍伝 / プロモ</b></div>
    <div><small>相場</small><b>SOLD優先</b></div>
   </div>
   <h2>PSA候補として優先確認</h2>
   <p>キャラクター人気だけでなく、配布条件・再録有無・状態・同仕様SOLD・鑑定品実売を揃えて判断します。ランクはサイト内の調査優先度で、PSAの点数や将来価格を保証するものではありません。</p>
   <div className="grid">{psa.length?psa.map(c=><a className="card" href={"/card/"+encodeURIComponent(c.id)} key={c.id}><div className="num">{c.id}</div><h3>{c.name}</h3><p>{c.series}</p><b>{c.rank} / 詳細を見る →</b></a>):<p>現在、疾風伝カードのPSA候補を精査中です。</p>}</div>
   <h2>疾風伝カード一覧</h2>
   <div className="grid">{shippuden.map(c=><a className="card" href={"/card/"+encodeURIComponent(c.id)} key={c.id}><div className="num">{c.id}</div><h3>{c.name}</h3><p>{c.character}</p><b>{c.market||"相場調査中"} →</b></a>)}</div>
  </section>
 </main>;
}