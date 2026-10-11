import {cards} from "../lib/cards";
import {getMarketAnalysis} from "../lib/getMarketAnalysis";
import {getLatestNews} from "../lib/getLatestNews";
import {dailyResearch} from "../lib/dailyResearch";
import {sortCards} from "../lib/cardSort";
import VisitCounter from "./components/VisitCounter";
import {SearchForm,SectionHeading,CardTile,DataNotice,NewsList} from "./components/DatabaseUI";

export const metadata={
 title:{absolute:"NARUTO CARD DB｜旧カードの番号検索・相場・最新ニュース"},
 description:"NARUTO旧カードを番号・名前から検索。収録シリーズ、SOLD相場、プロモ、PSA判断と公式最新ニュースを整理する非公式データベースです。",
 alternates:{canonical:"/"}
};
export const dynamic="force-dynamic";

export default async function Home(){
 const [analysis,news]=await Promise.all([getMarketAnalysis(),getLatestNews(3)]);
 const picks=(analysis.picks||[]).slice(0,3);
 const recentResearch=Object.entries(dailyResearch).sort((a,b)=>(b[1].sequence||0)-(a[1].sequence||0)).slice(0,3);
 const characters=[...new Set(cards.map(c=>c.character).filter(v=>v&&v!=="不明"&&v!=="複数"))]
  .map(name=>({name,count:cards.filter(c=>c.character===name).length})).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,"ja")).slice(0,8);
 const series=[...new Set(sortCards(cards).map(c=>c.series).filter(Boolean))];
 const promoCount=cards.filter(c=>/^PR|^OP忍-/.test(c.id)).length;

 return <main className="homePage">
  <section className="homeHero">
   <span className="eyebrow">NARUTO OLD CARD DATABASE</span>
   <h1>その一枚を、<br/><em>もっと深く。</em></h1>
   <p>番号から探す。実売から知る。<br/>NARUTO旧カードの収録情報と相場を、一枚ずつ。</p>
   <SearchForm/>
   <div className="searchHints"><span>よく調べられる番号</span>{["忍-1","忍-204","PR忍-1-R"].map(id=><a href={"/card/"+encodeURIComponent(id)} key={id}>{id}</a>)}</div>
   <div className="homeStats"><div><strong>{cards.length}</strong><span>登録カード</span></div><div><strong>{promoCount}</strong><span>登録プロモ</span></div><div><strong>{Object.keys(dailyResearch).length}</strong><span>連載分析</span></div></div>
  </section>

  <nav className="homeRoutes" aria-label="目的から探す">
   <a href="/cards"><span>01 / ARCHIVE</span><b>旧カードを探す</b><small>番号・収録シリーズから →</small></a>
   <a href="/promo"><span>02 / PROMO</span><b>プロモを調べる</b><small>配布系統・カード番号から →</small></a>
  </nav>

  <section className="homeSection">
   <SectionHeading title="最新ニュース" label="OFFICIAL NEWS" href="/news"/>
   {news.length?<NewsList items={news} compact/>:<div className="emptyState"><p>ニュースを取得できませんでした。</p><a href="/news">ニュース・公式リンクを確認する →</a></div>}
  </section>

  <section className="homeSection">
   <SectionHeading title="いまの相場を読む" label="MARKET WATCH" href="/analysis" action="全文分析"/>
   <DataNotice analysis={analysis}/>
   <div className="marketPreviewGrid">{picks.map(p=><article className="marketPreview" key={p.id}>
    <div className="marketPreviewHead"><span className="rank">#{p.rank} {p.judge}</span><span>{p.id}</span></div>
    <h3><a href={"/card/"+encodeURIComponent(p.id)}>{p.name}</a></h3>
    <dl><div><dt>出品確認価格</dt><dd>{p.price||"未確認"}</dd></div><div><dt>SOLD中央値</dt><dd>{p.median||"未確認"}</dd></div></dl>
    <p>{p.summary}</p><a className="textLink" href={"/analysis#pick-"+encodeURIComponent(p.id)}>根拠と分析を見る →</a>
   </article>)}</div>
   <p className="mutedNote">出品価格とSOLDは別扱い。価格は確認時点の記録です。</p>
  </section>

  {recentResearch.length>0&&<section className="homeSection">
   <SectionHeading title="一枚ずつ、詳しく分析" label="CARD RESEARCH" href="/search" action="カード検索"/>
   <div className="researchList">{recentResearch.map(([id,record])=><a href={"/card/"+encodeURIComponent(id)+"#daily-research"} key={id}>
    <span className="researchSequence">#{String(record.sequence).padStart(3,"0")}</span><div><small>{record.checkedAt}</small><b>{record.title}</b></div><span aria-hidden="true">→</span>
   </a>)}</div>
  </section>}

  <section className="homeSection">
   <SectionHeading title="キャラクターから探す" label="CHARACTERS" href="/search" action="条件を指定"/>
   <div className="characterGrid">{characters.map(x=><a href={"/character/"+encodeURIComponent(x.name)} key={x.name}><b>{x.name}</b><span>{x.count}枚 →</span></a>)}</div>
  </section>

  <section className="homeSection">
   <SectionHeading title="収録シリーズから探す" label="SERIES ARCHIVE"/>
   <div className="seriesList">{series.slice(0,6).map(s=><a href={"/search?series="+encodeURIComponent(s)} key={s}><b>{s}</b><span>{cards.filter(c=>c.series===s).length}枚 →</span></a>)}</div>
   {series.length>6&&<details className="moreSeries"><summary>すべてのシリーズを見る（{series.length}件）</summary><div className="seriesList">{series.slice(6).map(s=><a href={"/search?series="+encodeURIComponent(s)} key={s}><b>{s}</b><span>{cards.filter(c=>c.series===s).length}枚 →</span></a>)}</div></details>}
  </section>

  <section className="homeSection">
   <SectionHeading title="最近追加されたカード" label="NEW RECORDS" href="/cards" action="忍カード一覧"/>
   <div className="grid">{cards.slice(-3).reverse().map(card=><CardTile card={card} key={card.id}/>)}</div>
  </section>

  <section className="homeSection">
   <SectionHeading title="集めた一枚を守る" label="COLLECTION & STORAGE" href="/storage-guide" action="保管ガイド"/>
   <div className="affiliateGrid">
    <a href="https://link.amazon/B05QqCBV6" target="_blank" rel="sponsored nofollow noreferrer"><b>トレカ用スリーブ</b><span>基本のカード保護</span><strong>Amazonで確認 ↗</strong></a>
    <a href="https://link.amazon/B0etIAWiI" target="_blank" rel="sponsored nofollow noreferrer"><b>マグネットローダー</b><span>高額・お気に入りの保護</span><strong>Amazonで確認 ↗</strong></a>
    <a href="https://link.amazon/B06uxlbxz" target="_blank" rel="sponsored nofollow noreferrer"><b>カードストレージ</b><span>増えたカードを整理</span><strong>Amazonで確認 ↗</strong></a>
   </div><small className="affiliateNote">Amazonアソシエイトのリンクを使用しています。</small>
  </section>
  <aside className="homeAbout"><h2>確認できたことを、積み重ねる。</h2><p>収録情報・実売・分析・予測を分け、未確認の情報は「不明」と表示します。各カードの詳細から参照資料を確認できます。</p><VisitCounter/></aside>
 </main>;
}
