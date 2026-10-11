import {getLatestNews} from "../../lib/getLatestNews";
import {queryValue} from "../../lib/catalogView";
import {PageIntro,NewsList} from "../components/DatabaseUI";

export async function generateMetadata({searchParams}){
 const category=queryValue((await searchParams).category);
 return {title:"NARUTO最新ニュース",description:"NARUTO・BORUTO・完全新作アニメ・NARUTO CARD GAME・世界イベントの公式最新情報を整理して表示します。",alternates:{canonical:"/news"},...(category?{robots:{index:false,follow:true,googleBot:{index:false,follow:true}}}:{})};
}
export const dynamic="force-dynamic";

export default async function NewsPage({searchParams}){
 const [news,params]=await Promise.all([getLatestNews(30),searchParams]);
 const categories=[...new Set(news.map(item=>item.category).filter(Boolean))];
 const requested=queryValue(params.category);
 const category=categories.includes(requested)?requested:"";
 const filtered=category?news.filter(item=>item.category===category):news;
 const itemListJsonLd={"@context":"https://schema.org","@type":"ItemList",name:"NARUTO最新ニュース",itemListElement:news.map((item,index)=>({"@type":"ListItem",position:index+1,name:item.title,url:item.url}))};
 return <main className="newsPage">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(itemListJsonLd).replace(/</g,"\\u003c")}}/>
  <PageIntro eyebrow="OFFICIAL NEWS WATCH" title="NARUTO最新ニュース" description="アニメ・カードゲーム・イベントの公式発表をまとめて確認。発表元のページへ直接進めます。"/>
  <nav className="categoryTabs" aria-label="ニュースのカテゴリ">
   <a href="/news" aria-current={!category?"page":undefined}>すべて <small>{news.length}</small></a>
   {categories.map(value=><a href={"/news?category="+encodeURIComponent(value)} aria-current={category===value?"page":undefined} key={value}>{value}</a>)}
  </nav>
  <p className="resultCount">{category||"すべてのニュース"} · {filtered.length}件{news[0]?.publishedLabel&&<span>最新掲載日 {news[0].publishedLabel}</span>}</p>
  {filtered.length?<NewsList items={filtered}/>:<div className="emptyState"><h2>現在ニュースを取得できません</h2><p>公式サイト・公式Xから最新の発表を確認できます。</p><div className="miniLinks"><a href="https://naruto-official.com/" target="_blank" rel="noopener noreferrer">NARUTO公式サイト ↗</a><a href="https://x.com/narutotcg_jp" target="_blank" rel="noopener noreferrer">CARD GAME公式X ↗</a></div></div>}
  <p className="mutedNote">公式発表・公式サイト・原作公式Xなど一次情報を優先。事実確認前の噂は掲載しません。</p>
  <aside className="nextStep"><div><small>NEXT / MARKET</small><h2>ニュースから、旧カードの相場へ。</h2><p>注目材料と実売価格を分けて確認できます。</p></div><a href="/analysis">相場分析を読む →</a></aside>
 </main>;
}
