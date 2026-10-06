import {getMarketAnalysis} from "../../lib/getMarketAnalysis";

export const metadata={
 title:"NARUTO旧カード相場分析｜今集めたい5枚",
 description:"メルカリSOLD、eBay海外需要、2027年NARUTO CARD GAME、新作アニメ、BORUTO、イベントをまとめて分析。",
 alternates:{canonical:"/analysis"}
};

export const dynamic="force-dynamic";

export default async function AnalysisPage(){
 const marketAnalysis=await getMarketAnalysis();
 const picks=marketAnalysis.picks||[];
 const dropped=marketAnalysis.droppedPicks||[];

 return <main className="analysisPage">
  <a className="back" href="/">← トップへ戻る</a>

  <section className="analysisHero">
   <span className="eyebrow">{marketAnalysis.cadence} / 最終確認 {marketAnalysis.updatedAt}{marketAnalysis.isStale?" / 更新確認中":""}</span>
   <h1>{marketAnalysis.headline}</h1>
  </section>

  <section>
   <div className="sectionHead"><h2>現在の5枚</h2><span>{marketAnalysis.updatedAt}</span></div>

   {dropped.length>0&&<div className="droppedMarket">
    <b>前回TOP5から外れたカード</b>
    {dropped.map(x=><span key={x.id}>{x.id} {x.name}（前回{x.rank}位）</span>)}
   </div>}

   <div className="analysisCards">
    {picks.map(p=><article className="analysisCard" key={p.id}>
     <div className="analysisRank">#{p.rank} / {p.judge}</div>
     <div className="num">{p.id}</div>
     <h2>{p.name}</h2>

     {(p.previousPrice||p.isNewEntry||p.rankChange)&&<div className="marketDelta">
      {p.previousPrice&&<span>前回 {p.previousPrice} → 現在 {p.price}{p.priceChangeText&&`（${p.priceChangeText}）`}</span>}
      {p.rankChange>0&&<span>順位 ↑ {p.rankChange}</span>}
      {p.rankChange<0&&<span>順位 ↓ {Math.abs(p.rankChange)}</span>}
      {p.isNewEntry&&<span>TOP5新規</span>}
     </div>}

     <div className="analysisMetrics">
      <div><small>現在価格</small><b>{p.price}</b></div>
      <div><small>同状態SOLD中央値</small><b>{p.median}</b></div>
      <div><small>サンプル</small><b>{p.samples}</b></div>
      <div><small>中央値比</small><b>{p.discount}</b></div>
      {p.profit&&<div><small>概算利益</small><b>{p.profit}</b></div>}
      {p.roi&&<div><small>ROI</small><b>{p.roi}</b></div>}
     </div>

     <p>{p.summary}</p>
     <p>{p.detail}</p>
     <p><strong>海外：</strong>{p.overseas}</p>
     <div className="marketLinks">
      <a className="mercariBtn" href={p.mercariUrl} target="_blank" rel="noreferrer">メルカリの現行出品を見る →</a>
      {p.ebayUrl&&<a className="mercariBtn" href={p.ebayUrl} target="_blank" rel="noreferrer">eBayで同番号を見る →</a>}
     </div>
    </article>)}
   </div>
  </section>

  <section className="analysisMethod">
   <div className="sectionHead"><h2>この分析の見方</h2><span>METHOD</span></div>
   <p className="analysisLead">{marketAnalysis.lead}</p>
   <div className="analysisIntro">
    <div><b>集計ルール</b><span>同番号 / 単品 / 同状態を優先</span></div>
    <div><b>海外</b><span>ASKとSOLDを分離</span></div>
    <div><b>更新</b><span>{marketAnalysis.cadence}</span></div>
   </div>
  </section>

  <section className="analysisSection">
   <div className="sectionHead"><h2>海外需要（eBay）の見方</h2><span>SOLD &gt; ASK</span></div>
   {(marketAnalysis.overseasSummary||[]).map((x,i)=><p key={i}>{x}</p>)}
  </section>

  <section className="analysisSection">
   <div className="sectionHead"><h2>2027年までの追い風</h2><span>OFFICIAL EVENTS</span></div>
   <div className="timeline">
    {(marketAnalysis.catalysts||[]).map((x,i)=><div key={i}><b>{x.date}</b><p>{x.text}</p></div>)}
   </div>
   <div className="sourceLinks">
    <a href="https://naruto-official.com/news/01_2661" target="_blank" rel="noreferrer">公式：NARUTO CARD GAME</a>
    <a href="https://naruto-official.com/news/01_2695" target="_blank" rel="noreferrer">公式：NYCC / 完全新作アニメ</a>
    <a href="https://naruto-official.com/news/01_2688" target="_blank" rel="noreferrer">公式：BORUTO 9巻</a>
    <a href="https://naruto-official.com/news/01_2686" target="_blank" rel="noreferrer">公式：Ninja Show NARUTO</a>
   </div>
  </section>

  <section className="analysisSection">
   <div className="sectionHead"><h2>今の買い方</h2><span>POSITION SIZING</span></div>
   <p>{marketAnalysis.strategy}</p>
   <p className="analysisNote">{marketAnalysis.disclaimer}</p>
  </section>

  <footer>非公式ファンデータベース / 4時間ごとの確認データを反映します。</footer>
 </main>;
}
