import {cards} from "../../lib/cards";
import {sortCards,cardIdParts} from "../../lib/cardSort";
import {PageIntro,SearchForm,CardTile} from "../components/DatabaseUI";

export const metadata={title:"プロモカード一覧｜配布系統・カード番号から探す",description:"NARUTO旧カードのPR忍・PR作・PR忍伝・PR術・PR騎・PR依・OP忍など全登録プロモを系統別に整理。配布情報と実売相場を個別ページで確認できます。",alternates:{canonical:"/promo"}};
const all=cards.filter(c=>/^PR|^OP忍-/.test(c.id));
const known=["PR忍","PR作","PR忍伝","PR術","PR騎","PR依","OP忍"];
const groups=[...known,...[...new Set(all.map(c=>cardIdParts(c.id).prefix))].filter(prefix=>!known.includes(prefix)).sort()]
 .map(prefix=>({prefix,list:sortCards(all.filter(c=>cardIdParts(c.id).prefix===prefix))})).filter(group=>group.list.length);

export default function Page(){
 return <main className="promoPage">
  <PageIntro eyebrow="PROMOTION CARD ARCHIVE" title="プロモカード一覧" description="大会賞品・配布カードを系統別に。配布背景と仕様の違いを確かめて、一枚ずつ調べられます。"/>
  <div className="catalogStats"><span><b>{all.length}</b> 登録プロモ</span><span><b>{groups.length}</b> 系統</span></div>
  <SearchForm compact/>
  <nav className="categoryTabs" aria-label="カードの区分"><a href="/cards">忍カード</a><a href="/promo" aria-current="page">プロモ</a><a href="/shippuden">疾風伝</a><a href="/search?promo=promo">プロモ検索</a></nav>
  <nav className="promoIndex" aria-label="プロモ系統へ移動">{groups.map(({prefix,list})=><a href={"#"+encodeURIComponent(prefix)} key={prefix}><b>{prefix}</b><span>{list.length}枚 ↓</span></a>)}</nav>
  <p className="mutedNote">未確認の配布経路・一次資料は、各カードの詳細に明記しています。</p>
  {groups.map(({prefix,list})=><section className="promoGroup" id={prefix} key={prefix}>
   <div className="sectionHead"><h2>{prefix}</h2><span>{list.length}枚</span></div>
   <div className="grid catalogGrid">{list.map(card=><CardTile card={card} key={card.id}/>)}</div>
   <a className="textLink" href="#main-content">系統一覧に戻る ↑</a>
  </section>)}
 </main>;
}
