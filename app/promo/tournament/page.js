import {findCard} from "../../../lib/cards";
import {focusPromos,tournamentCategories,tournamentPromos,tournamentCounts} from "../../../lib/tournamentPromos";

const yen=price=>price.toLocaleString("ja-JP")+"円";
export const metadata={
 title:"NARUTO大会プロモ図鑑｜優勝賞・上位入賞・連勝・参加賞",
 description:"旧NARUTOカード大会プロモを優勝賞・上位入賞・連勝賞・参加賞に分類。配布の根拠と実売記録を分離し、未確認情報を明示します。",
 alternates:{canonical:"/promo/tournament"}
};

function SaleList({sales}){
 if(!sales?.length)return <p className="tournamentNoSale">該当仕様の確認できたSOLD：未登録（調査中）</p>;
 return <div className="tournamentSales">
  <b>確認できた取引表示（平均・相場ではありません）</b>
  <ul>{sales.map(sale=><li key={sale.url}><a href={sale.url} target="_blank" rel="noopener noreferrer">{yen(sale.price)} ／ {sale.marketplace} {sale.date||"取引日未確認"} ↗</a><small>{sale.note}</small></li>)}</ul>
 </div>;
}
function PromoCard({promo}){
 const registered=Boolean(findCard(promo.id));
 return <article className="tournamentCard" id={"card-"+encodeURIComponent(promo.id)}>
  <div className="tournamentCardHeader"><span className="tournamentNumber">{promo.id}</span><span className="tournamentEvidence">{promo.evidence}</span></div>
  <h3>{registered?<a href={"/card/"+encodeURIComponent(promo.id)}>{promo.name} ↗</a>:promo.name}</h3>
  <p className="tournamentCondition">{promo.conditions}</p>
  <p className="tournamentEvidenceNote">{promo.evidenceNote}</p>
  {promo.reprint&&<p className="tournamentEvidenceNote">再録：{promo.reprint}</p>}
  {promo.marketSummary&&<p className="tournamentEvidenceNote"><strong>2026年10月15日の相場調査：</strong>{promo.marketSummary}</p>}
  <SaleList sales={promo.sales}/>
  <div className="tournamentCardLinks"><a href={promo.source} target="_blank" rel="noopener noreferrer">配布情報の根拠を確認 ↗</a>{registered&&<a href={"/card/"+encodeURIComponent(promo.id)}>カード詳細 →</a>}</div>
 </article>;
}
export default function TournamentPromoPage(){
 return <main className="tournamentPromoPage">
  <nav className="tournamentBreadcrumb" aria-label="パンくず"><a href="/">トップ</a><span>›</span><a href="/promo">プロモ一覧</a><span>›</span><span>大会配布</span></nav>
  <header className="tournamentHero">
   <span className="eyebrow">TOURNAMENT PROMOTION ARCHIVE</span>
   <h1>大会限定プロモの<br/>配布条件を探す</h1>
   <p>旧NARUTOカードゲームの優勝賞・上位入賞賞・勝ち抜き賞・参加賞を、カード番号と根拠の種類で整理しました。</p>
   <p className="tournamentDisclaimer">重要：公式大会賞品表の原本まで照合できていないカードがあります。「優勝賞」「優勝のみ」は当時の公式認定ではなく、コレクターや出品者の報告に基づく暫定分類です。</p>
  </header>
  <div className="tournamentStats"><span><b>{tournamentPromos.length}</b> 件の大会配布候補</span><span><b>{focusPromos.length}</b> 件の優先調査</span><span>更新：2026年10月15日</span></div>
  <section className="tournamentSection">
   <div className="sectionHead"><h2>優先調査カード</h2><span>大会名・公式根拠を調査中</span></div>
   <p className="mutedNote">PR忍伝-12・13、PR作-28・29を優先。出品価格と実際の取引表示価格は混ぜません。</p>
   <div className="tournamentGrid">{focusPromos.map(promo=><PromoCard key={promo.id} promo={promo}/>)}</div>
  </section>
  <nav className="tournamentJump" aria-label="大会配布区分へ移動">
   {tournamentCategories.map(cat=><a href={"#"+cat.id} key={cat.id}>{cat.label}<small>{tournamentCounts[cat.id]}件</small></a>)}
  </nav>
  {tournamentCategories.map(cat=><section className="tournamentSection" id={cat.id} key={cat.id}>
   <div className="sectionHead"><h2>{cat.label}</h2><span>{tournamentCounts[cat.id]}件</span></div>
   <p className="mutedNote">{cat.hint}</p>
   <div className="tournamentGrid">{tournamentPromos.filter(p=>p.category===cat.id&&!p.priority).map(promo=><PromoCard key={promo.id} promo={promo}/>)}</div>
   {cat.id==="winner"&&<p className="tournamentFollowHint">このほか上の「優先調査カード」4件も大会優勝賞候補に分類しています。</p>}
  </section>)}
  <section className="tournamentMethod">
   <h2>資料と実売記録の読み方</h2>
   <dl>
    <div><dt>当時の賞品表（紹介記事に転載）</dt><dd>開催時期・勝利数が読み取れる資料。ただし原本URLと現物の版違いは未照合。</dd></div>
    <div><dt>コレクター報告（二次掲載）</dt><dd>収集家の入手経路情報。賞品としての記録であって公式発表ではありません。</dd></div>
    <div><dt>販売者・出品者の説明</dt><dd>販売ページでの申告。優勝賞の断定材料にはできません。</dd></div>
    <div><dt>SOLD・購入日時</dt><dd>当該商品ページに記録された表示価格。取引の状態・仕様・決済値引き等は別途確認が必要です。</dd></div>
   </dl>
   <p>調査対象は国内の旧NARUTOカードゲームです。データカードダス・ミラバト・海外Mythos・2027年発売予定の新TCGとは混ぜていません。</p>
   <a className="textLink" href="/promo">プロモカード一覧に戻る →</a>
  </section>
 </main>;
}
