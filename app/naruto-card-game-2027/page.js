import {PageIntro} from "../components/DatabaseUI";
import {
 festSalesUrl,
 naruto2027AdvanceProducts,
 naruto2027AdvanceSchedule,
 naruto2027Disclosure,
 naruto2027Faq,
 naruto2027FestProducts,
 naruto2027FestPurchaseNote,
 naruto2027FestTrial,
 naruto2027Guides,
 naruto2027History,
 naruto2027Lineup,
 naruto2027Links,
 naruto2027Meta,
 naruto2027PendingProducts,
 naruto2027PurchasePendingLabel,
 naruto2027PurchaseUrl,
 naruto2027SleeveUrl,
 naruto2027TrialApplications,
 naruto2027TrialVenues,
 naruto2027UpdatedAt
} from "../../lib/naruto2027";

const title=naruto2027Meta.title;
const description=naruto2027Meta.description;
const siteImage={
 url:"https://raw.githubusercontent.com/jwjxyhito-max/naruto-card-db/main/8340944f-47b4-41ce-8706-5d4d41d6f411.png",
 width:1536,
 height:768,
 alt:"NARUTO CARD DB"
};

export const metadata={
 title,
 description,
 alternates:{canonical:naruto2027Meta.path},
 openGraph:{title,description,url:naruto2027Meta.path,images:[siteImage]},
 twitter:{card:"summary_large_image",title,description,images:[siteImage.url]}
};

function DataTable({caption,columns,rows}){
 return <div className="featureTableWrap" tabIndex={0}><table className="featureTable">
  {caption&&<caption>{caption}</caption>}
  <thead><tr>{columns.map(column=><th key={column} scope="col">{column}</th>)}</tr></thead>
  <tbody>{rows.map(row=><tr key={row[0]}>{row.map((cell,index)=><td key={columns[index]}>{cell}</td>)}</tr>)}</tbody>
 </table></div>;
}

export default function NarutoCardGame2027Page(){
 const pageUrl=`https://naruto-card-db.vercel.app${naruto2027Meta.path}`;
 const jsonLd={
  "@context":"https://schema.org",
  "@type":"Article",
  headline:naruto2027Meta.heading,
  description,
  inLanguage:"ja",
  datePublished:naruto2027UpdatedAt,
  dateModified:naruto2027UpdatedAt,
  url:pageUrl
 };
 return <main>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,"\\u003c")}}/>
  <PageIntro eyebrow={`OFFICIAL / ${naruto2027UpdatedAt}`} title={naruto2027Meta.heading} description={naruto2027Meta.description} items={[{label:"NARUTOカードゲーム 2027"}]}/>
  <p className="featureNotice">{naruto2027Meta.notice}</p>

  <section className="featureSection" id="overview">
   <h2>概要</h2>
   <p>『NARUTOカードゲーム』は、2027年6月に全世界同時発売と発表されました。発表の場は、2026年10月のニューヨーク・コミコン2026のステージです。6月の何日かは未発表です。</p>
   <p>同時に発売されるのは、スターターデッキ3種と第一弾ブースターパック「参上！うずまきナルト」です。</p>
   <p>公式サイトの「NARUTOカードゲームとは」では、カードはリーダーカード、キャラクターカード、EXキャラクター、チャクラカード、登場カードの5種類と説明されています。バトル開始時の構成は、リーダーカード1枚、デッキ50枚、チャクラカード5枚、登場カード1枚です。キャッチコピーは「チャクラで忍術を駆使し、相手の戦略を打ち破れ。」です。</p>
   <p>発売前の案内として、先行体験会（2027年1月〜3月）、プレミアムバンダイでの先行販売商品、2027年春のデモデッキ配布キャンペーン（全世界で合計100万個の予定）があります。</p>
   <p>次の大型情報発表の場はジャンプフェスタ2027（2026年12月19日・20日、幕張メッセ）と案内されています。発表内容はまだありません。</p>
  </section>

  <section className="featureSection" id="lineup">
   <h2>発売ラインナップ（2027年6月）</h2>
   <DataTable columns={naruto2027Lineup.columns} rows={naruto2027Lineup.rows}/>
   {naruto2027Lineup.notes.map(note=><p className="mutedNote" key={note}>{note}</p>)}
  </section>

  <section className="featureSection" id="advance-sale">
   <h2>先行販売スケジュール（プレミアムバンダイ）</h2>
   <h3>対象商品</h3>
   <DataTable columns={naruto2027AdvanceProducts.columns} rows={naruto2027AdvanceProducts.rows}/>
   {naruto2027AdvanceProducts.notes.map(note=><p key={note}>{note}</p>)}
   <h3>販売スケジュール</h3>
   <DataTable caption="すべて日本時間。Fest東京・プレミアムバンダイの日程です。" columns={naruto2027AdvanceSchedule.columns} rows={naruto2027AdvanceSchedule.rows}/>
   <ul>{naruto2027AdvanceSchedule.notes.map(note=><li key={note}>{note}</li>)}</ul>
  </section>

  <section className="featureSection" id="trial">
   <h2>国内の先行体験会</h2>
   <p>名称は「NARUTOカードゲーム 先行体験会」です。デモデッキを使って遊びを体験するイベントで、naruto-cardgame.com の公式ページ（2026年10月13日掲載）に案内されています。</p>
   <ul>
    <li>参加にはBANDAI TCG+からの事前応募が必要です。</li>
    <li>デモデッキは「うずまきナルトデッキ」と「うちはサスケデッキ」の2種で、持ち帰りはできません。</li>
    <li>参加記念品はCP-001 チャクラカードです。</li>
    <li>物販として、公式ページに「プレミアムカードコレクション vol.00 -チャクラセット-（1,650円・税込）」の記載があります。先行体験会の参加者を優先して販売します。</li>
   </ul>
   <DataTable columns={naruto2027TrialVenues.columns} rows={naruto2027TrialVenues.rows}/>
   <h3>応募期間と当選発表</h3>
   <ul>{naruto2027TrialApplications.map(item=><li key={item}>{item}</li>)}</ul>
   <p>先行体験会は一部の対象店舗でのみ開かれます。その後、より多くの店舗で「体験会」を開催する予定です。その店舗と日程は未発表です。</p>
  </section>

  <section className="featureSection" id="fest-trial">
   <h2>BANDAI CARD GAMES Fest 26-27 in TOKYO の体験会</h2>
   <p>名称は「体験会 in BCGFest」です。</p>
   <DataTable columns={naruto2027FestTrial.columns} rows={naruto2027FestTrial.rows}/>
   <ul>{naruto2027FestTrial.points.map(point=><li key={point}>{point}</li>)}</ul>
  </section>

  <section className="featureSection" id="demo">
   <h2>デモデッキ配布キャンペーン</h2>
   <p>2027年春に、全世界で合計100万個のデモデッキを配布するグローバルキャンペーンを実施する予定です。詳細は後日発表されます。</p>
  </section>

  <section className="featureSection" id="legacy">
   <h2>旧カードとの違い</h2>
   <p>当サイト（NARUTO旧カードDB）が扱うのは、2002年からの『NARUTO-ナルト-カードゲーム』『NARUTO疾風伝カードゲーム』などの旧カードです。サイト内のデータは2002〜2006年の収録を中心に登録しています。</p>
   <p>2027年6月発売の『NARUTOカードゲーム』は、公式が全世界同時発売の本格トレーディングカードゲームとして発表した新作です。公式の説明では、アニメやさまざまなクリエイターの描き下ろしイラストに加え、原作のアートワークを使ったカードを収録するとされています。</p>
   <p>旧カードと新作カードを同じデッキで使えるかなど、互換性についての公式説明は確認できていません。新作の相場や見通しは、発売前のため掲載していません。</p>
   <div className="sourceLinks">{naruto2027Guides.map(guide=><a href={guide.href} key={guide.href}>{guide.label} →</a>)}</div>
  </section>

  <section className="featureSection" id="purchase">
   <p className="affiliateNote">{naruto2027Disclosure}</p>
   <h2>予約・購入リンク</h2>
   <ul>
    {naruto2027PendingProducts.map(name=><li key={name}><b>{name}</b> — {naruto2027PurchaseUrl(null)?null:naruto2027PurchasePendingLabel}</li>)}
    {naruto2027FestProducts.map(name=><li key={name}><b>{name}</b> — {naruto2027FestPurchaseNote}（<a href={festSalesUrl} target="_blank" rel="noopener noreferrer">Fest販売方法ページ ↗</a>）</li>)}
   </ul>
   <p>スターターデッキ、第一弾ブースター、Amazonの商品ページは、発売前のためASINを載せていません。商品ページを確認してから掲載します。価格・在庫・販売元はリンク先でご確認ください。</p>
   <p>下のリンクはカード保護用品の検索です。新作カードの予約ページではなく、新作カードのサイズへの対応も未確認です。手持ちのカードのサイズを確認して選んでください。</p>
   <p><a href={naruto2027SleeveUrl} target="_blank" rel="sponsored nofollow noreferrer">透明スリーブをAmazonで探す ↗</a></p>
  </section>

  <section className="featureSection" id="faq">
   <h2>FAQ</h2>
   <dl className="featureFaq">{naruto2027Faq.map(item=><div key={item.q}><dt>{item.q}</dt><dd>{item.a}</dd></div>)}</dl>
  </section>

  <section className="featureSection" id="sources">
   <h2>発表元リンク</h2>
   <div className="sourceLinks">{naruto2027Links.map(link=><a href={link.url} target="_blank" rel="noopener noreferrer" key={link.url}>{link.label} ↗</a>)}</div>
  </section>

  <section className="featureSection" id="history">
   <h2>更新履歴</h2>
   <ul>{naruto2027History.map(item=><li key={item}>{item}</li>)}</ul>
  </section>
 </main>;
}
