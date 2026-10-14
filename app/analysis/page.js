import {getMarketAnalysis} from "../../lib/getMarketAnalysis";
import {PageIntro,DataNotice,SectionHeading} from "../components/DatabaseUI";

export const metadata={title:"NARUTO旧カード相場分析｜SOLD・注目カード・海外需要",description:"メルカリSOLD、eBay海外需要、NARUTO CARD GAME、新作アニメ、BORUTO、イベントをまとめて分析。出品価格と実売を区別して掲載します。",alternates:{canonical:"/analysis"}};
export const dynamic="force-dynamic";

export default async function AnalysisPage(){
 const analysis=await getMarketAnalysis();
 const picks=analysis.picks||[],dropped=analysis.droppedPicks||[];
 return <main className="analysisPage" data-analysis-id={analysis.analysisId || "fallback"}>
  <PageIntro eyebrow="MARKET RESEARCH" title={analysis.headline} description="出品価格・同状態SOLD・海外需要を並べて確認。気になるカードの根拠から購入判断につなげられます。" items={[{label:"相場分析"}]}/>
  <DataNotice analysis={analysis}/>
  <div className="analysisIntro"><div><b>国内の実売</b><span>同番号・単品・同状態</span></div><div><b>海外需要</b><span>ASKとSOLDを区別</span></div><div><b>判断の根拠</b><span>状態差・標本数・出典</span></div></div>
  <nav className="anchorTabs" aria-label="分析カードへ移動">{picks.map(p=><a href={"#pick-"+encodeURIComponent(p.id)} key={p.id}>#{p.rank} {p.id}</a>)}</nav>
  <section className="marketPicks">
   <SectionHeading title={`今回の注目カード ${picks.length}枚`} label="MARKET PICKS" href="/search" action="カード検索"/>
   {dropped.length>0&&<details className="droppedMarket"><summary>前回から外れたカード（{dropped.length}枚）</summary>{dropped.map(p=><a href={"/card/"+encodeURIComponent(p.id)} key={p.id}>{p.id} {p.name} · 前回{p.rank}位</a>)}</details>}
   <div className="analysisCards">{picks.map(p=><article className="analysisCard" id={"pick-"+p.id} key={p.id}>
    <div className="analysisCardTop"><span className="analysisRank">#{p.rank} / {p.judge}</span><a href={"/card/"+encodeURIComponent(p.id)}>カード詳細 →</a></div>
    <div className="num">{p.id}</div><h2>{p.name}</h2>
    {(p.previousPrice||p.isNewEntry||p.rankChange)&&<div className="marketDelta">
     {p.previousPrice&&<span>前回 {p.previousPrice} → 今回 {p.price}{p.priceChangeText&&`（${p.priceChangeText}）`}</span>}
     {p.rankChange>0&&<span>順位 ↑ {p.rankChange}</span>}{p.rankChange<0&&<span>順位 ↓ {Math.abs(p.rankChange)}</span>}{p.isNewEntry&&<span>新規掲載</span>}
    </div>}
    <div className="analysisMetrics"><div><small>出品確認価格</small><b>{p.price||"未確認"}</b></div><div><small>同状態SOLD中央値</small><b>{p.median||"未確認"}</b></div><div><small>SOLD標本</small><b>{p.samples||"未確認"}</b></div><div><small>中央値比</small><b>{p.discount||"未確認"}</b></div>{p.profit&&<div><small>概算利益</small><b>{p.profit}</b></div>}{p.roi&&<div><small>ROI</small><b>{p.roi}</b></div>}</div>
    <p className="pickSummary">{p.summary}</p>
    <details className="pickEvidence" open><summary>SOLDの根拠・国内分析</summary><p>{p.detail}</p></details>
    <details className="pickEvidence"><summary>海外需要の確認</summary><p>{p.overseas}</p></details>
    <div className="marketLinks">{p.mercariUrl&&<a className="mercariBtn" href={p.mercariUrl} target="_blank" rel="noopener noreferrer">メルカリの現行出品 ↗</a>}{p.ebayUrl&&<a className="secondaryButton" href={p.ebayUrl} target="_blank" rel="noopener noreferrer">eBayで同番号を確認 ↗</a>}</div>
   </article>)}</div>
  </section>
  <section className="analysisMethod"><SectionHeading title="分析の見方と今の買い方" label="METHOD & STRATEGY"/><p>{analysis.lead}</p><p>{analysis.strategy}</p><p className="analysisNote">{analysis.disclaimer}</p>
   <details className="contextDetails"><summary>海外需要（eBay）の見方</summary>{(analysis.overseasSummary||[]).map((text,i)=><p key={i}>{text}</p>)}</details>
   <details className="contextDetails"><summary>新TCG・アニメ・イベントの注目材料</summary><div className="timeline">{(analysis.catalysts||[]).map((item,i)=><div key={i}><b>{item.date}</b><p>{item.text}</p></div>)}</div><div className="sourceLinks">
    <a href="https://naruto-official.com/news/01_2661" target="_blank" rel="noopener noreferrer">公式：NARUTO CARD GAME ↗</a><a href="https://naruto-official.com/news/01_2695" target="_blank" rel="noopener noreferrer">公式：NYCC / 完全新作アニメ ↗</a><a href="https://naruto-official.com/news/01_2688" target="_blank" rel="noopener noreferrer">公式：BORUTO 9巻 ↗</a><a href="https://naruto-official.com/news/01_2686" target="_blank" rel="noopener noreferrer">公式：Ninja Show NARUTO ↗</a>
   </div></details>
  </section>
  <aside className="nextStep"><div><small>NEXT / ARCHIVE</small><h2>気になる一枚を、もっと詳しく。</h2><p>収録情報・個別調査・PSA判断まで確認できます。</p></div><a href="/search">カードを探す →</a></aside>
 </main>;
}
