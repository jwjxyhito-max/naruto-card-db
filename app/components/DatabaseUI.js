import {isPromoCard} from "../../lib/cardSort";

export function Breadcrumbs({items=[]}){
 const entries=[{label:"トップ",href:"/"},...items];
 const schema={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:entries.map((item,index)=>({"@type":"ListItem",position:index+1,name:item.label,...(item.href?{item:"https://naruto-card-db.vercel.app"+item.href}:{})}))};
 return <nav className="breadcrumbs" aria-label="パンくずリスト"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/><ol>
  <li><a href="/">トップ</a></li>
  {items.map((item,index)=><li key={index}>{item.href?<a href={item.href}>{item.label}</a>:<span aria-current="page">{item.label}</span>}</li>)}
 </ol></nav>;
}

export function PageIntro({eyebrow,title,description,items,children}){
 return <><Breadcrumbs items={items||[{label:title}]}/><header className="pageIntro">
  <span className="eyebrow">{eyebrow}</span><h1>{title}</h1>
  {description&&<p>{description}</p>}{children}
 </header></>;
}

export function SearchForm({q="",compact=false}){
 return <form action="/search" role="search" className={`cardSearch ${compact?"compactSearch":""}`}>
  <label className="srOnly" htmlFor={compact?"compact-query":"card-query"}>カード番号・カード名で検索</label>
  <input id={compact?"compact-query":"card-query"} name="q" type="search" defaultValue={q} placeholder="例：忍-204、ナルト" autoComplete="off"/>
  <button type="submit">検索</button>
 </form>;
}

export function SectionHeading({title,label,href,action="すべて見る"}){
 return <div className="sectionHead"><div>{label&&<span className="eyebrow">{label}</span>}<h2>{title}</h2></div>
  {href&&<a href={href}>{action}<span aria-hidden="true"> →</span></a>}
 </div>;
}

export function CardTile({card}){
 return <a className="card catalogCard" href={"/card/"+encodeURIComponent(card.id)}>
  <span className={`cardMark ${isPromoCard(card)||/^OP忍-/.test(card.id)?"promoMark":""}`} aria-hidden="true">{isPromoCard(card)||/^OP忍-/.test(card.id)?"PR":card.type||"忍"}</span>
  <div className="catalogBody"><div className="num">{card.id}</div><h3>{card.name}</h3><p>{card.series}</p>
   <small className="catalogStatus">{card.market?.includes("SOLD")?"SOLD記録あり":"収録情報・相場を確認"}</small>
  </div><span className="cardArrow" aria-hidden="true">↗</span>
 </a>;
}

export function Pagination({page,pages,href}){
 if(pages<=1)return null;
 return <nav className="pagination" aria-label="一覧のページ送り">
  {page>1?<a href={href(page-1)} rel="prev">← 前へ</a>:<span className="disabled">← 前へ</span>}
  <span aria-live="polite">{page} / {pages}</span>
  {page<pages?<a href={href(page+1)} rel="next">次へ →</a>:<span className="disabled">次へ →</span>}
 </nav>;
}

export function DataNotice(){
 return <div className="dataNotice"><span className="dataDot" aria-hidden="true"/><b>保存済みの分析</b></div>;
}

export function NewsList({items,compact=false}){
 const Heading=compact?"h3":"h2";
 return <div className={`newsGrid ${compact?"compactNews":""}`}>
  {items.map(item=><a className={`newsItem ${item.importance==="high"?"newsHigh":""}`} href={item.url} target="_blank" rel="noopener noreferrer" key={item.id}>
   <div className="newsMeta"><span>{item.publishedLabel}</span>{item.category&&<span>{item.category}</span>}{item.importance==="high"&&<b>重要</b>}</div>
   <Heading>{item.title}</Heading>{!compact&&item.summary&&<p>{item.summary}</p>}
   <div className="newsFoot"><span>{item.source}</span><b>発表元を読む ↗</b></div>
  </a>)}
 </div>;
}
