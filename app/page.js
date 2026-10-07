import {getDbStats,marketStatus} from "../lib/status";
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

  <section className="portalSection">
   <div className="sectionHead"><h2>カードを探す・調べる</h2><span>EXPLORE DATABASE</span></div>
   <div className="portalGrid">
    <a className="portalMain" href="/search"><span>CARD SEARCH</span><b>カードを探す</b><p>番号・名前・シリーズ・キャラクター・注目ランクから絞り込み。</p><strong>検索を開く →</strong></a>
    <a href="/cards"><span>ARCHIVE</span><b>旧カード一覧</b><p>登録カードを番号順に確認</p></a>
    <a href="/promo"><span>PROMO</span><b>プロモカード</b><p>PR忍・PR術をまとめて確認</p></a>
    <a href="/ranking"><span>RANKING</span><b>注目カード</b><p>市場で追うカードを優先度別に</p></a>
    <a href="/analysis"><span>MARKET</span><b>相場分析</b><p>SOLD・価格変化・今後の材料</p></a>
    <a href="/psa"><span>GRADING</span><b>PSA鑑定</b><p>鑑定と価値判断の入口</p></a>
   </div>
  </section>

  <section className="seriesSection">
   <div className="sectionHead"><h2>シリーズから探す</h2><span>SERIES ARCHIVE</span></div>
   <p className="seriesLead">収録シリーズを入口に、登録済みカードをまとめて確認できます。</p>
   <div className="seriesRail">
    {[...new Set(cards.map(c=>c.series).filter(Boolean))].map(s=>{
     const count=cards.filter(c=>c.series===s).length;
     return <a key={s} href={"/search?series="+encodeURIComponent(s)}><span>SERIES</span><b>{s}</b><small>{count} CARDS</small></a>
    })}
   </div>
   <div className="seriesFoot"><a href="/cards">登録カードをすべて見る →</a><a href="/promo">プロモだけを見る →</a></div>
  </section>

  <section className="characterSection">
   <div className="sectionHead"><h2>キャラクターから探す</h2><span>CHARACTER INDEX</span></div>
   <p className="seriesLead">好きなキャラクターから、登録済みの旧カードへ直接アクセス。</p>
   <div className="characterGrid">
    {[...new Set(cards.map(c=>c.character).filter(v=>v&&v!=="不明"&&v!=="複数"))]
     .map(name=>({name,count:cards.filter(c=>c.character===name).length}))
     .sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,"ja"))
     .slice(0,12)
     .map((x,i)=><a key={x.name} href={"/search?character="+encodeURIComponent(x.name)}>
      <span>{String(i+1).padStart(2,"0")}</span><b>{x.name}</b><small>{x.count} CARDS</small>
     </a>)}
   </div>
   <a className="characterMore" href="/search">全条件からカードを検索する →</a>
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
