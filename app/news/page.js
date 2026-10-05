import {getLatestNews} from "../../lib/getLatestNews";

export const metadata={
 title:"NARUTO最新ニュース",
 description:"NARUTO・BORUTO・完全新作アニメ・NARUTO CARD GAME・世界イベントの公式最新情報を整理して表示します。",
 alternates:{canonical:"/news"}
};
export const dynamic="force-dynamic";

export default async function NewsPage(){
 const news=await getLatestNews(30);
 return <main className="newsPage">
  <section className="newsHero">
   <div className="brand">NARUTO NEWS WATCH</div>
   <h1>NARUTO最新ニュース</h1>
   <p>NARUTO・BORUTO・完全新作アニメ・NARUTO CARD GAME・世界イベントの最新公式情報を、見やすく整理して掲載しています。</p>
  </section>

  <div className="newsGrid">
   {news.length===0?<div className="newsItem"><h2>現在ニュースを取得できません</h2><p>公式リンクから最新情報を確認できます。</p></div>:
    news.map(item=><a className={`newsItem ${item.importance==="high"?"newsHigh":""}`} href={item.url} target="_blank" rel="noopener noreferrer" key={item.id}>
     <div className="newsMeta">
      <span>{item.publishedLabel}</span>
      {item.category&&<span>{item.category}</span>}
      <span>{item.source}</span>
      {item.importance==="high"&&<b>重要</b>}
     </div>
     <h2>{item.title}</h2>
     {item.summary&&<p>{item.summary}</p>}
    </a>)
   }
  </div>

  <p className="newsSourceNote">※事実確認前の噂は掲載しません。公式発表・公式サイト・原作公式Xなど一次情報を優先します。</p>
 </main>;
}