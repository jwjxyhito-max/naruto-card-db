import {cards} from "../../lib/cards";
import {sortCards,cardIdParts} from "../../lib/cardSort";
import {paginate,pageHref,queryValue} from "../../lib/catalogView";
import {PageIntro,SearchForm,CardTile,Pagination} from "../components/DatabaseUI";

const all=cards.filter(c=>/^PR|^OP忍-/.test(c.id));
const known=["PR忍","PR作","PR忍伝","PR術","PR騎","PR依","OP忍"];
const groups=[...known,...[...new Set(all.map(c=>cardIdParts(c.id).prefix))].filter(prefix=>!known.includes(prefix)).sort()]
 .map(prefix=>({prefix,list:sortCards(all.filter(c=>cardIdParts(c.id).prefix===prefix))})).filter(group=>group.list.length);

function groupView(params){
 const requested=queryValue(params.group);
 const group=groups.find(item=>item.prefix===requested)||null;
 const result=group?paginate(group.list,params.page):null;
 return {group,result,href:page=>pageHref("/promo",group?{group:group.prefix}:{},page)};
}

export async function generateMetadata({searchParams}){
 const {group,result,href}=groupView(await searchParams);
 return {title:group?`${group.prefix} プロモカード一覧${result.page>1?`・${result.page}ページ`:""}`:"プロモカード一覧｜配布系統・カード番号から探す",description:"NARUTO旧カードのPR忍・PR作・PR忍伝・PR術・PR騎・PR依・OP忍・PR学など全登録プロモを系統別に整理。配布情報と実売相場を個別ページで確認できます。",alternates:{canonical:href(result?.page||1)}};
}

export default async function Page({searchParams}){
 const {group,result,href}=groupView(await searchParams);
 const visible=group?[group]:groups;
 return <main className="promoPage">
  <PageIntro eyebrow="PROMOTION CARD ARCHIVE" title={group?`${group.prefix}のプロモ一覧`:"プロモカード一覧"} description="大会賞品・配布カードを系統別に。配布背景と仕様の違いを確かめて、一枚ずつ調べられます。" items={group?[{href:"/promo",label:"プロモ一覧"},{label:group.prefix}]:undefined}/>
  <div className="catalogStats"><span><b>{all.length}</b> 登録プロモ</span><span><b>{groups.length}</b> 系統</span></div>
  <p className="mutedNote"><a href="/promo/tournament">大会優勝・入賞・連勝・参加賞のプロモ特集 →</a></p>
  <SearchForm compact/>
  <nav className="categoryTabs" aria-label="カードの区分"><a href="/cards">忍カード</a><a href="/promo" aria-current="page">プロモ</a><a href="/shippuden">疾風伝</a><a href="/search?promo=promo">プロモ検索</a></nav>
  <nav className="promoIndex" aria-label="プロモ系統へ移動">{groups.map(({prefix,list})=><a href={group?"/promo?group="+encodeURIComponent(prefix):"#"+encodeURIComponent(prefix)} aria-current={group?.prefix===prefix?"page":undefined} key={prefix}><b>{prefix}</b><span>{list.length}枚 {group?"→":"↓"}</span></a>)}</nav>
  <p className="mutedNote">未確認の配布経路・一次資料は、各カードの詳細に明記しています。<a href="/search?promo=promo">全プロモを検索 →</a></p>
  {visible.map(({prefix,list})=><section className="promoGroup" id={prefix} key={prefix}>
   <div className="sectionHead"><h2>{prefix}</h2><span>{list.length}枚</span></div>
   <div className="grid catalogGrid">{(result?result.items:list.slice(0,3)).map(card=><CardTile card={card} key={card.id}/>)}</div>
   {!group&&list.length>3&&<a className="textLink" href={"/promo?group="+encodeURIComponent(prefix)}>{prefix}の{list.length}枚をすべて見る →</a>}
   {group&&<Pagination {...result} href={href}/>}
   <a className="textLink" href={group?"/promo":"#main-content"}>系統一覧に戻る ↑</a>
  </section>)}
 </main>;
}
