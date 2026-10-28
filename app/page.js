import {cards} from "../lib/cards";
import {getMarketAnalysis} from "../lib/getMarketAnalysis";
import {getLatestNews} from "../lib/getLatestNews";
import {dailyResearch} from "../lib/dailyResearch";
import {getCardResearchIndex} from "../lib/getCardResearch";
import {sortCards} from "../lib/cardSort";
import VisitCounter from "./components/VisitCounter";
import {SearchForm,SectionHeading,CardTile,NewsList} from "./components/DatabaseUI";
import {ShoppingCallout} from "./components/ShoppingUI";
import {amazonSearchUrl} from "../lib/recommendedProducts";

export const metadata={
 title:{absolute:"NARUTO CARD DB｜旧カードの番号検索・相場・最新ニュース"},
 description:"NARUTO旧カードを番号・名前から検索。収録シリーズ、SOLD相場、プロモ、PSA判断と公式最新ニュースを整理する非公式データベースです。",
 alternates:{canonical:"/"}
};
export const dynamic="force-dynamic";

export default async function Home(){
 const [analysis,news,researchIndex]=await Promise.all([getMarketAnalysis(),getLatestNews(3),getCardResearchIndex()]);
 const picks=(analysis.picks||[]).filter(p=>!p.soldOut).slice(0,3);
 const recentResearch=Object.entries(dailyResearch).sort((a,b)=>(b[1].sequence||0)-(a[1].sequence||0)).slice(0,3);
 const characters=[...new Set(cards.map(c=>c.character).filter(v=>v&&v!=="不明"&&v!=="複数"))]
  .map(name=>({name,count:cards.filter(c=>c.character===name).length})).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,"ja")).slice(0,8);
 const series=[...new Set(sortCards(cards).map(c=>c.series).filter(Boolean))];
 const promoCount=cards.filter(c=>/^PR|^OP忍-/.test(c.id)).length;

 return <main className="homePage" data-analysis-id={analysis.analysisId || "fallback"}>
  <section className="homeHero">
   <span className="eyebrow">NARUTO OLD CARD DATABASE</span>
   <h1>その一枚を、<br/><em>もっと深く。</em></h1>
   <p>番号から探す。実売から知る。<br/>NARUTO旧カードの収録情報と相場を、一枚ずつ。</p>
   <SearchForm/>
   <div className="searchHints"><span>よく調べられる番号</span>{["忍-1","忍-204","PR忍-1-R"].map(id=><a href={"/card/"+encodeURIComponent(id)} key={id}>{id}</a>)}</div>
   <ShoppingCallout/>
   <div className="homeStats"><div><strong>{cards.length}</strong><span>登録カード</span></div><div><strong>{promoCount}</strong><span>登録プロモ</span></div><div><strong>{researchIndex?.length ?? "—"}</strong><span>公開詳細調査</span></div></div>
   {researchIndex?.length>0&&<a className="textLink" href="#published-card-research">追加の詳細調査：{researchIndex.length}枚を見る →</a>}
  </section>

  <nav className="homeRoutes" aria-label="目的から探す">
   <a href="/cards"><span>01 / ARCHIVE</span><b>旧カードを探す</b><small>番号・収録シリーズから →</small></a>
   <a href="/promo"><span>02 / PROMO</span><b>プロモを調べる</b><small>配布系統・カード番号から →</small></a>
  </nav>

  <section className="homeSection">
   <aside className="nextStep">
    <div><small>2027 / NEW TCG</small><h2>NARUTOカードゲームは、2027年6月に世界同時発売。</h2><p>2026年10月11日の公式記事で確認できた商品と体験会だけをまとめています。</p></div>
    <a href="/naruto-card-game-2027">公式発表の要点を見る →</a>
   </aside>
  </section>

  <section className="homeSection">
   <SectionHeading title="最新ニュース" label="OFFICIAL NEWS" href="/news"/>
   {news.length?<NewsList items={news} compact/>:<div className="emptyState"><p>ニュースを取得できませんでした。</p><a href="/news">ニュース・公式リンクを確認する →</a></div>}
  </section>

  <section className="homeSection">
   <SectionHeading title="いまの相場を読む" label="MARKET WATCH" href="/analysis" action="全文分析"/>
   {picks.length===0&&<p className="mutedNote">現在購入候補として確認できた商品はありません。過去のSOLD相場は全文分析に保存しています。</p>}
   <div className="marketPreviewGrid">{picks.map(p=><article className="marketPreview" key={p.id}>
    <div className="marketPreviewHead"><span className="rank">#{p.rank} {p.displayJudge||p.judge}</span><span>{p.id}</span></div>
    <h3><a href={"/card/"+encodeURIComponent(p.id)}>{p.name}</a></h3>
    <dl><div><dt>過去の出品確認価格</dt><dd>{p.displayPrice||p.price||"未確認"}</dd></div><div><dt>SOLD中央値</dt><dd>{p.median||"未確認"}</dd></div></dl>
    <p>{p.displaySummary||p.summary}</p><a className="textLink" href={"/analysis#pick-"+encodeURIComponent(p.id)}>根拠と分析を見る →</a>
   </article>)}</div>
   <p className="mutedNote">出品価格とSOLDは別扱い。価格は確認時点の記録です。</p>
  </section>

  {researchIndex?.length>0&&<section className="homeSection" id="published-card-research">
   <SectionHeading title="追加の詳細調査" label="CARD RESEARCH"/>
   <p className="mutedNote">{researchIndex.length}枚を公開中。相場・仕様・売買判断をカードごとに確認できます。未確認の情報は調査中と表示します。</p>
   <div className="researchList">{researchIndex.slice(0,5).map(record=><a href={"/card/"+encodeURIComponent(record.card_id)+"#analysis"} key={record.card_id}>
    <div><small>{record.snapshot_date} ／ {record.status==="complete"?"検証完了":"継続調査"}</small><b>{record.card_id} {record.name}</b></div><span aria-hidden="true">→</span>
   </a>)}</div>
   {researchIndex.length>5&&<details className="moreSeries"><summary>ほかの詳細調査を見る（{researchIndex.length-5}枚）</summary><div className="researchList">{researchIndex.slice(5).map(record=><a href={"/card/"+encodeURIComponent(record.card_id)+"#analysis"} key={record.card_id}>
    <div><small>{record.snapshot_date} ／ {record.status==="complete"?"検証完了":"継続調査"}</small><b>{record.card_id} {record.name}</b></div><span aria-hidden="true">→</span>
   </a>)}</div></details>}
  </section>}

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
    <a href={amazonSearchUrl("トレカ スリーブ 透明 100枚")} target="_blank" rel="sponsored nofollow noreferrer"><b>トレカ用スリーブ</b><span>基本のカード保護</span><strong>Amazonで確認 ↗</strong></a>
    <a href={amazonSearchUrl("マグネットローダー 35pt")} target="_blank" rel="sponsored nofollow noreferrer"><b>マグネットローダー</b><span>高額・お気に入りの保護</span><strong>Amazonで確認 ↗</strong></a>
    <a href={amazonSearchUrl("トレカ ストレージボックス 大容量")} target="_blank" rel="sponsored nofollow noreferrer"><b>カードストレージ</b><span>増えたカードを整理</span><strong>Amazonで確認 ↗</strong></a>
   </div><a className="textLink" href="/recommended" data-shopping-placement="home-storage">NARUTO関連商品・保管用品のおすすめをすべて見る →</a><small className="affiliateNote">【PR】本ページには広告・アフィリエイトリンクが含まれます（Amazonアソシエイト）。</small>
  </section>
  <aside className="homeAbout"><h2>確認できたことを、積み重ねる。</h2><p>収録情報・実売・分析・予測を分け、未確認の情報は「不明」と表示します。各カードの詳細から参照資料を確認できます。</p><VisitCounter/></aside>
 </main>;
}
