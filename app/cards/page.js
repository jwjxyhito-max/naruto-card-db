import {cards} from "../../lib/cards";
import {sortCards} from "../../lib/cardSort";
import {paginate,pageHref} from "../../lib/catalogView";
import {PageIntro,SearchForm,CardTile,Pagination} from "../components/DatabaseUI";

const ninjaCards=cards.filter(c=>/^忍-\d+$/.test(c.id));
const max=Math.max(0,...ninjaCards.map(c=>Number(c.id.split("-")[1])));
const missing=max-new Set(ninjaCards.map(c=>Number(c.id.split("-")[1]))).size;
const sortModes=["number","series","rarity"];

function view(params){
 const sort=sortModes.includes(params.sort)?params.sort:"number";
 const result=paginate(sortCards(ninjaCards,sort),params.page);
 return {...result,sort,href:page=>pageHref("/cards",{sort:sort==="number"?"":sort},page)};
}

export async function generateMetadata({searchParams}){
 const result=view(await searchParams);
 return {title:`忍カード一覧${result.page>1?`・${result.page}ページ`:""}`,description:"NARUTO旧カードの忍カードを番号・シリーズ・注目ランク順に探せる一覧。各カードの収録情報と相場を確認できます。",alternates:{canonical:pageHref("/cards",{},result.page)}};
}

export default async function Page({searchParams}){
 const result=view(await searchParams);
 return <main className="catalogPage">
  <PageIntro eyebrow="NINJA CARD ARCHIVE" title="忍カード一覧" description="確認済みの「忍-」カードを番号順に。気になる一枚から、収録情報・相場・分析を確認できます。"/>
  <div className="catalogStats"><span><b>{ninjaCards.length}</b> 登録カード</span><span>最大確認番号 <b>忍-{max}</b></span></div>
  <SearchForm compact/>
  <nav className="categoryTabs" aria-label="カードの区分"><a href="/cards" aria-current="page">忍カード</a><a href="/promo">プロモ</a><a href="/shippuden">疾風伝</a><a href="/search">全カード検索</a></nav>
  <div className="catalogToolbar"><p>{result.total}枚中 {(result.page-1)*30+1}〜{Math.min(result.page*30,result.total)}枚</p>
   <form className="sortBar" action="/cards"><label className="srOnly" htmlFor="catalog-sort">並び順</label><select id="catalog-sort" name="sort" defaultValue={result.sort}><option value="number">カード番号順</option><option value="series">シリーズ順</option><option value="rarity">注目ランク順</option></select><button type="submit">並べ替え</button></form>
  </div>
  <div className="grid catalogGrid">{result.items.map(card=><CardTile card={card} key={card.id}/>)}</div>
  <Pagination {...result}/>
  <details className="archiveNote"><summary>登録範囲と未登録番号について</summary><p>忍-1から忍-{max}までのうち、未登録番号は{missing}件です。欠番とは断定せず、旧公式資料・現物資料で確認できたものから追加します。</p></details>
 </main>;
}
