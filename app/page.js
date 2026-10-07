import CardMarquee from "./components/CardMarquee";
import {cards} from "../lib/cards";
import {getMarketAnalysis} from "../lib/getMarketAnalysis";
import VisitCounter from "./components/VisitCounter";

const guides=[
 {href:"/cards",title:"旧カード一覧",text:"番号・収録から探す"},
 {href:"/promo",title:"プロモカード",text:"PR忍・PR術を確認"},
 {href:"/ranking",title:"注目カード",text:"優先度別に見る"},
 {href:"/analysis",title:"相場分析",text:"最新TOP5を見る"},
 {href:"/psa",title:"PSA鑑定",text:"鑑定・価値判断"},
 {href:"/search",title:"カード検索",text:"番号・名前で検索"}
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
 const hot=marketAnalysis.picks||[];
 const hotPreview=hot.slice(0,3);

 return <main>
  <a className="homeHeroVisual" href="/analysis" aria-label="NARUTO CARD DB 相場分析を見る">
   <img src="https://raw.githubusercontent.com/jwjxyhito-max/naruto-card-db/main/8340944f-47b4-41ce-8706-5d4d41d6f411.png" alt="NARUTO CARD DB - NARUTOカードの世界をもっと深く" />
  </a>

  <header>
   <div className="brand">NARUTO OLD CARD DATABASE</div>
   <div className="sub">旧カードの「何なのか・どこにある・いくらか」を追う</div>
  </header>

  <section className="hero">
   <span className="eyebrow">DATABASE / MARKET / ARCHIVE</span>
   <h1>NARUTO旧カードを、<br/>番号から追える場所へ。</h1>
   <p>収録シリーズ、販売済み相場、希少性まで。確認済みの根拠を積み上げる専門データベースです。</p>

   <a className="analysisCta" href="/analysis">
    <span>{marketAnalysis.cadence} / 最終確認 {marketAnalysis.updatedAt}{marketAnalysis.isStale?" / 更新確認中":""}</span>
    <b>2027年新TCGに向けた「今集めたい5枚」を全文で見る →</b>
   </a>

   <form action="/search">
    <input name="q" aria-label="カード検索" placeholder="カード番号・カード名で検索　例：忍-204"/>
    <button>検索</button>
   </form>
   <VisitCounter />
  </section>

  <nav className="dbnav" aria-label="主要メニュー">
   <a href="/cards">忍カード一覧</a>
   <a href="/promo">プロモ</a>
   <a href="/ranking">注目</a>
   <a href="/analysis">相場分析</a>
   <a href="/psa">PSA</a>
   <a href="/psa-simulator">PSA計算</a>
   <a href="/search">検索</a>
  </nav>

  <section className="homeQuickSection">
   <div className="sectionHead"><h2>目的から探す</h2><span>QUICK GUIDE</span></div>
   <div className="quickGuideGrid">
    {guides.map(g=><a href={g.href} key={g.href}><b>{g.title}</b><span>{g.text}</span></a>)}
   </div>
  </section>

  <section>
   <div className="sectionHead">
    <h2>今の注目TOP3</h2>
    <span>{marketAnalysis.updatedAt} / {marketAnalysis.cadence}{marketAnalysis.isStale?" / 更新確認中":""}</span>
   </div>
   <div className="grid homeCompactGrid">
    {hotPreview.map(c=><div className="card" key={c.id}>
     <div className="rank">{c.judge}</div>
     <div className="num">{c.id}</div>
     <h3>{c.name}</h3>
     <p>現在確認価格 <b>{c.price}</b></p>
     {c.previousPrice&&<div className="marketChange">{c.previousPrice} → {c.price}{c.priceChangeText&&` / ${c.priceChangeText}`}</div>}
     {c.isNewEntry&&<div className="marketChange marketNew">TOP5新規</div>}
     <p>{c.summary}</p>
     <a href="/analysis"><b>全文分析を見る →</b></a>
    </div>)}
   </div>
   <a className="topFiveMore" href="/analysis">残り2枚＋数値分析・eBay・2027年材料を全文で見る →</a>
   <p style={{fontSize:12,opacity:.7}}>※表示価格は確認時点。SOLD・状態・版違い・海外ASK/SOLDを分けて判定します。</p>
  </section>

  <section>
   <div className="sectionHead"><h2>重点監視カード</h2><span>{cards.length} RECORDS / DOT DATA</span></div>
   <div className="grid homeCompactGrid">
    {watchPreview.map(c=><a className="card" href={"/card/"+encodeURIComponent(c.id)} key={c.id}>
     <div className="rank">{c.rank}</div>
     <div className="num">{c.id}</div>
     <h3>{c.name}</h3>
     <p>{c.market}</p>
     <b>詳細を見る →</b>
    </a>)}
   </div>
   {watch.length>3&&<a className="homeMore" href="/ranking">重点監視カードをすべて見る（{watch.length}件） →</a>}
  </section>

  <section className="affiliateSection">
   <div className="sectionHead"><h2>NARUTOカード収集・保管用品</h2><span>AMAZON / STORAGE</span></div>
   <p className="affiliateLead">旧カードは状態も大切。カードの価値に合わせた保管方法を先に確認できます。</p>
   <div className="affiliateGrid">
    <a href="https://link.amazon/B05QqCBV6" target="_blank" rel="sponsored nofollow noreferrer"><b>トレカ用スリーブ</b><span>基本のカード保護に</span><strong>Amazonで見る →</strong></a>
    <a href="https://link.amazon/B0etIAWiI" target="_blank" rel="sponsored nofollow noreferrer"><b>マグネットローダー</b><span>お気に入り・高額カードに</span><strong>Amazonで見る →</strong></a>
    <a href="https://link.amazon/B06uxlbxz" target="_blank" rel="sponsored nofollow noreferrer"><b>カードストレージ</b><span>増えた旧カードの整理に</span><strong>Amazonで見る →</strong></a>
   </div>
   <a className="storageGuideLink" href="/storage-guide">カードの価値別・おすすめ保管方法を見る →</a>
   <small className="affiliateNote">※Amazonアソシエイトのリンクを使用しています。</small>
  </section>

  <section className="about homeAbout">
   <h2>このDBについて</h2>
   <p>カード番号・名前から検索し、収録情報・市場データ・PSA情報を確認できます。現在出品・SOLD・事実・分析・予測を混ぜず、未確認は「不明」と表示します。</p>
  </section>

  <footer>非公式ファンデータベース / 画像は外部参照を基本とします。</footer>
 </main>;
}
