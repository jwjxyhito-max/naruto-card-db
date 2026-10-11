import {cards} from "../../lib/cards";
import {sortCards} from "../../lib/cardSort";
import {paginate,pageHref,queryValue,matchesCardQuery} from "../../lib/catalogView";
import {PageIntro,CardTile,Pagination} from "../components/DatabaseUI";

const options=key=>[...new Set(cards.map(c=>c[key]).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),"ja"));
export const metadata={title:"カード検索｜番号・名前・シリーズから探す",description:"NARUTO旧カードをフリーワード・シリーズ・キャラクター・注目ランクから絞り込み検索できます。",alternates:{canonical:"/search"},robots:{index:false,follow:true,googleBot:{index:false,follow:true}}};

export default async function Search({searchParams}){
 const p=await searchParams;
 const q=queryValue(p.q).trim();
 const series=queryValue(p.series),character=queryValue(p.character),rank=queryValue(p.rank);
 const promo=["promo","normal"].includes(p.promo)?p.promo:"";
 const sort=["number","series","rarity"].includes(p.sort)?p.sort:"number";
 const found=sortCards(cards.filter(c=>{
  const isPromo=/^PR|^OP忍-/i.test(c.id)||/プロモ/i.test(c.series||"");
  return (!q||matchesCardQuery(c,q))&&(!series||c.series===series)&&(!character||c.character===character)&&(!rank||c.rank===rank)&&(!promo||(promo==="promo"?isPromo:!isPromo));
 }),sort);
 const result=paginate(found,p.page);
 const href=page=>pageHref("/search",{q,series,character,rank,promo,sort:sort==="number"?"":sort},page);
 const activeFilters=Boolean(series||character||rank||promo);
 return <main className="searchPage">
  <PageIntro eyebrow="SEARCH THE DATABASE" title="カード検索" description="番号・名前から一枚を検索。シリーズやキャラクターを組み合わせて絞り込めます。"/>
  <form className="advancedSearch" action="/search" role="search">
   <label htmlFor="search-query">カード番号・カード名</label><div className="searchInputRow"><input id="search-query" name="q" type="search" defaultValue={q} placeholder="例：忍-204 / ナルト"/><button type="submit">検索</button></div>
   <details className="filterDetails" open={activeFilters}><summary>条件で絞り込む{activeFilters&&<span>条件指定中</span>}</summary><div className="searchFilters">
    <label>シリーズ<select name="series" defaultValue={series}><option value="">すべて</option>{options("series").map(v=><option key={v}>{v}</option>)}</select></label>
    <label>キャラクター<select name="character" defaultValue={character}><option value="">すべて</option>{options("character").map(v=><option key={v}>{v}</option>)}</select></label>
    <label>注目ランク<select name="rank" defaultValue={rank}><option value="">すべて</option>{options("rank").map(v=><option key={v}>{v}</option>)}</select></label>
    <label>区分<select name="promo" defaultValue={promo}><option value="">すべて</option><option value="promo">プロモのみ</option><option value="normal">通常カード</option></select></label>
   </div><button type="submit">この条件で検索</button></details>
   <div className="searchActions"><label>並び順<select name="sort" defaultValue={sort}><option value="number">カード番号順</option><option value="series">シリーズ順</option><option value="rarity">注目ランク順</option></select></label><button type="submit">適用</button><a href="/search">条件を解除</a></div>
  </form>
  <div className="searchResultHead"><h2>{q?`「${q}」の検索結果`:"登録カード"}</h2><span>{found.length}件</span></div>
  {found.length?<><div className="grid catalogGrid">{result.items.map(card=><CardTile card={card} key={card.id}/>)}</div><Pagination {...result} href={href}/></>:<div className="emptyState"><h3>該当するカードが見つかりませんでした</h3><p>条件を減らすか、カード番号・キャラクター名を変えて検索してください。未登録のカードもあります。</p><a href="/search">条件を解除して探す →</a></div>}
 </main>;
}
