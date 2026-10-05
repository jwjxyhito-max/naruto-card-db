import {cards} from "../lib/cards";
import {getMarketAnalysis} from "../lib/getMarketAnalysis";

const guides=[
 {href:"/cards",title:"NARUTO旧カード一覧",text:"カード番号から収録情報・相場・希少性を確認"},
 {href:"/promo",title:"プロモカード一覧",text:"PR忍・PR術など通常番号とは別のカードを確認"},
 {href:"/ranking",title:"注目・高額カード",text:"市場で注目したい旧カードを優先度別に確認"},
 {href:"/analysis",title:"旧カード相場分析",text:"新作・新TCGの動きと旧カード市場を分析"},
 {href:"/search",title:"カード番号・名前検索",text:"忍-204などの番号やキャラクター名から探す"},
 {href:"/psa",title:"PSA鑑定・価値判断",text:"旧カードの鑑定状況と2027年新TCGのPSA対応を追跡"}
];

export const metadata={
 title:"NARUTO旧カードDB｜カード番号・相場・収録情報を検索",
 description:"NARUTO旧トレーディングカードをカード番号・キャラクター名から検索。収録シリーズ、販売済み相場、希少性、注目カードを確認できる非公式データベースです。",
 alternates:{canonical:"/"}
};

export const dynamic="force-dynamic";

export default async function Home(){
 const marketAnalysis=await getMarketAnalysis();
 const watch=cards.filter(c=>["A","B","WATCH"].includes(c.rank));
 const watchPreview=watch.slice(0,3);
 const hot=marketAnalysis.picks;
 const hotPreview=hot.slice(0,3);
 return <main>
  <header><div className="brand">NARUTO OLD CARD DATABASE</div><div className="sub">旧カードの「何なのか・どこにある・いくらか」を追う</div></header>

  <section className="hero">
    <span className="eyebrow">DATABASE / MARKET / ARCHIVE</span>
    <h1>NARUTO旧カードを、<br/>番号から追える場所へ。</h1>
    <p>収録シリーズ、販売済み相場、希少性まで。確認済みの根拠を積み上げる専門データベースです。</p>

    <a className="analysisCta" href="/analysis">
      <span>{marketAnalysis.cadence} / 最終確認 {marketAnalysis.updatedAt}{marketAnalysis.isStale?" / 更新確認中":""}</span>
      <b>2027年新TCGに向けた「今集めたい5枚」を全文で見る →</b>
    </a>

    <form action="/search"><input name="q" aria-label="カード検索" placeholder="カード番号・カード名で検索　例：忍-204"/><button>検索</button></form>
  </section>

  <nav className="dbnav" aria-label="主要メニュー"><a href="/cards">忍カード一覧</a><a href="/promo">プロモカード</a><a href="/ranking">注目カード</a><a href="/analysis">相場分析</a><a href="/psa">PSA鑑定</a><a href="/psa-simulator">PSA計算</a><a href="/search">カード検索</a></nav>

  <section>
   <div className="sectionHead"><h2>目的から探す</h2><span>SEO GUIDE</span></div>
   <div className="grid homeCompactGrid">{guides.map(g=><a className="card" href={g.href} key={g.href}><h3>{g.title}</h3><p>{g.text}</p><b>見る →</b></a>)}</div>
  </section>

  <section>
   <div className="sectionHead"><h2>今の注目5枚</h2><span>{marketAnalysis.updatedAt} / {marketAnalysis.cadence}{marketAnalysis.isStale?" / 更新確認中":""}</span></div>
   <div className="grid homeCompactGrid">{hotPreview.map(c=><div className="card" key={c.id}><div className="rank">{c.judge}</div><div className="num">{c.id}</div><h3>{c.name}</h3><p>現在確認価格 <b>{c.price}</b></p>{c.previousPrice&&<div className="marketChange">{c.previousPrice} → {c.price}{c.priceChangeText&&` / ${c.priceChangeText}`}</div>}{c.isNewEntry&&<div className="marketChange marketNew">TOP5新規</div>}<p>{c.summary}</p><a href="/analysis"><b>全文分析を見る →</b></a></div>)}</div>
   <p style={{fontSize:12,opacity:.7}}>※表示価格は確認時点の出品価格で、成約相場・価値を保証するものではありません。SOLD、状態、仕様、海外ASK/SOLDを分けて更新します。</p>
  </section>

  <section>
   <div className="sectionHead"><h2>重点監視カード</h2><span>{cards.length} RECORDS / DOT DATA</span></div>
   <div className="grid homeCompactGrid">{watchPreview.map(c=><a className="card" href={"/card/"+encodeURIComponent(c.id)} key={c.id}><div className="rank">{c.rank}</div><div className="num">{c.id}</div><h3>{c.name}</h3><p>{c.market}</p><b>詳細を見る →</b></a>)}</div>
   {watch.length>6&&<a className="homeMore" href="/ranking">重点監視カードをすべて見る（{watch.length}件） →</a>}
  </section>

  <section className="affiliateSection">
   <div className="sectionHead"><h2>NARUTOカード収集・保管用品</h2><span>AMAZON / STORAGE</span></div>
   <p className="affiliateLead">旧カードは状態も大切。まずはスリーブ、特に残したいカードはローダー、枚数が増えたらストレージで整理。</p>
   <div className="affiliateGrid">
    <a href="https://link.amazon/B05QqCBV6" target="_blank" rel="sponsored nofollow noreferrer"><b>トレカ用スリーブ</b><span>基本のカード保護に</span><strong>Amazonで見る →</strong></a>
    <a href="https://link.amazon/B0etIAWiI" target="_blank" rel="sponsored nofollow noreferrer"><b>マグネットローダー</b><span>お気に入り・高額カードに</span><strong>Amazonで見る →</strong></a>
    <a href="https://link.amazon/B06uxlbxz" target="_blank" rel="sponsored nofollow noreferrer"><b>カードストレージ</b><span>増えた旧カードの整理に</span><strong>Amazonで見る →</strong></a>
   </div>
   <a className="storageGuideLink" href="/guide/card-storage">NARUTO旧カードの保管方法を詳しく見る →</a>
   <small className="affiliateNote">※Amazonアソシエイトのリンクを使用しています。</small>
  </section>

  <section className="about homeAbout"><h2>このDBについて</h2><p>カード番号・名前から検索し、収録情報・市場データ・PSA情報を確認できます。現在出品・販売済み・確認済み事実・分析・予測を混ぜず、未確認は「不明」と表示します。</p></section>
  <footer>非公式ファンデータベース / 画像は外部参照を基本とします。</footer>
 </main>
}