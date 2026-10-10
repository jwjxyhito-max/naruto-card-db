import {deepAnalysisRecords} from "../../../lib/deepAnalysisRecords";
import {marketRecord,formatSold} from "../../../lib/dotMarket";
import {findCard,cards} from "../../../lib/cards";
import {getMarketData} from "../../../lib/market";
import {getMarketAnalysis} from "../../../lib/getMarketAnalysis";
import {notFound} from "next/navigation";

export async function generateMetadata({params}){
 const {id}=await params;
 const decoded=decodeURIComponent(id);
 let c=findCard(decoded);
 if(!c){
  const marketAnalysis=await getMarketAnalysis();
  const live=marketAnalysis.picks?.find(p=>p.id===decoded);
  if(!live)return {};
  c={id:live.id,name:live.name};
 }
 return {
  title:`${c.id} ${c.name}の相場・収録情報`,
  description:`${c.id} ${c.name}の相場、収録シリーズ、発売時期、種類、調査状況を確認。NARUTO旧カードをカード番号単位で整理しています。`,
  alternates:{canonical:"/card/"+encodeURIComponent(c.id)},
  openGraph:{title:`${c.id} ${c.name}の相場・収録情報`,description:`${c.id} ${c.name}の収録情報・相場・関連カードを確認`}
 };
}

export default async function Page({params}){
 const {id}=await params;
 const decoded=decodeURIComponent(id);
 const marketAnalysis=await getMarketAnalysis();
 const live=marketAnalysis.picks?.find(p=>p.id===decoded)||null;
 const dbCard=findCard(decoded);
 if(!dbCard&&!live)notFound();

 const c=dbCard||{
  id:live.id,
  name:live.name,
  character:live.name,
  series:"収録シリーズ確認中",
  release:"不明",
  type:"市場分析対象",
  rank:live.judge,
  market:`現在 ${live.price} / 同状態SOLD中央値 ${live.median}`,
  note:"4時間ごとの市場分析で注目中。収録シリーズ・発売時期は確認でき次第追記します。",
  source:null
 };
 const m=getMarketData(c.id);
 const deepRecord=deepAnalysisRecords[c.id]||null;
 const soldRecord=marketRecord(c.id);
 const verifiedMarketCount=m?.soldCount||0;
 const hasRecordedSold=Array.isArray(soldRecord?.sold)&&soldRecord.sold.some(v=>Number.isFinite(v)&&v>0);
 const soldPrices=(soldRecord?.sold||[]).filter(x=>Number.isFinite(x)&&x>0).slice().sort((a,b)=>a-b);
 const soldMedian=soldPrices.length?(soldPrices.length%2?soldPrices[(soldPrices.length-1)/2]:(soldPrices[soldPrices.length/2-1]+soldPrices[soldPrices.length/2])/2):null;
 const yen=n=>n==null?"未確認":n.toLocaleString("ja-JP")+"円";
 const ninjaNo=String(c.id).match(/^忍-(\d+)$/)?.[1];
 const officialImage=dbCard&&ninjaNo?`https://www.tv-tokyo.co.jp/anime/naruto2002/goods/cardimg/n${ninjaNo}.jpg`:null;
 const related=dbCard
  ? cards.filter(x=>x.id!==c.id&&(x.character===c.character||x.series===c.series)).slice(0,6)
  : cards.filter(x=>x.id!==c.id&&x.character===c.character).slice(0,6);

 const releaseYear=String(c.release||"").match(/^(20\d{2})/)?.[1]||null;
 const numericPrice=live?Number(String(live.price).replace(/[^0-9]/g,"")):null;
 const storageLabel=numericPrice>=5000?"高額カード向け保管":numericPrice>=1000?"スリーブ＋ケース保管":"基本スリーブ保管";
 const storageProduct=numericPrice>=5000
  ? {name:"マグネットローダー",url:"https://link.amazon/B0etIAWiI",note:"高額カードは角・表面を守れるローダーを優先"}
  : {name:"トレカ用スリーブ",url:"https://link.amazon/B05QqCBV6",note:numericPrice>=1000?"まずスリーブで保護し、必要に応じて硬質ケースへ":"低価格帯でも擦れ・皮脂を防ぐ基本保管"};

 return <main>
  <a className="back" href="/">← NARUTO旧カードDB</a>
  <section className="detail">
   <span className="eyebrow">CARD RECORD / VERIFIED FIRST</span>
   <h1>{c.id} {c.name}</h1>
   <div className="status">{c.rank}</div>
   <p>{c.id}「{c.name}」の収録情報・相場・関連カードをまとめています。</p>

   {deepRecord&&<section className="deepAnalysis">
    <span className="eyebrow">CARD RESEARCH / STRUCTURED ANALYSIS</span>
    <h2>{c.id} {c.name}｜個別分析・SOLD追跡</h2>
    <div className="analysisFacts">
     <div><small>注目点</small><b>{deepRecord.angle}</b></div>
     <div><small>実売データ</small><b>{verifiedMarketCount?verifiedMarketCount+"件確認":hasRecordedSold?"価格記録あり":"未確認"}</b></div>
     <div><small>最終調査</small><b>{m?.checkedAt||"確認待ち"}</b></div>
     <div><small>検証状況</small><b>{verifiedMarketCount||hasRecordedSold?"SOLD照合中":"SOLD未確認"}</b></div>
    </div>
    <h3>確認できたSOLD価格（個別標本）</h3>
    {soldPrices.length>0?<><div className="analysisFacts">
     <div><small>記録済みSOLD中央値（参考）</small><b>{yen(soldMedian)}</b></div>
     <div><small>最低SOLD</small><b>{yen(soldPrices[0])}</b></div>
     <div><small>最高SOLD</small><b>{yen(soldPrices[soldPrices.length-1])}</b></div>
     <div><small>金額が記録された件数</small><b>{soldPrices.length}件</b></div>
    </div>
    <p>確認価格：{soldPrices.map(yen).join(" ／ ")}</p>
    <small>数字はDOTの保存済みSOLD記録による参考値。日時・取引URL・状態が全件紐付いていないため、同仕様の確定相場ではありません。上部のSOLD確認件数と金額記録件数は異なる場合があります。</small>
    </>:<p>個別SOLD金額はまだ記録されていません。確認できた取引から追加します。</p>}
    <h3>このカード固有の注目点</h3><p>{deepRecord.note}</p>
    <h3>SOLD・相場の判断</h3><p>{m?m.market:"同番号・同加工・同状態のSOLDを確認するまで価格は設定しません。出品価格を実売と混同しません。"}</p>
    <h3>PSA鑑定・保管</h3><p>角・縁・表裏の擦れ、反り、センタリングを確認し、鑑定料と同仕様のPSA鑑定品SOLDが確認できた場合のみ採算を判断します。</p>
    <h3>今後の見通し（予測）</h3><p>{deepRecord.outlook}</p>
    <small>カード固有の観察と予測を区別。価格未確認のカードに推定相場は掲載しません。</small>
   </section>}


   <nav className="cardDetailNav" aria-label="カード詳細メニュー">
    <a href="#basic">基本情報</a><a href="#market">SOLD・相場</a><a href="#analysis">分析・予測</a><a href="#psa-storage">PSA・保管</a><a href="#related">関連カード</a>
   </nav>

   <section id="basic" className="cardSnapshot">
    <div><small>カード番号</small><b>{c.id}</b></div>
    <div><small>キャラクター</small><b>{c.character}</b></div>
    <div><small>シリーズ</small><b>{c.series}</b></div>
    <div><small>発売</small><b>{c.release}</b></div>
   </section>

   <div id="market"></div>
   {live&&<section className="valuePanel">
    <div className="sectionHead"><h2>現在の価値判断</h2><span>{marketAnalysis.updatedAt}</span></div>
    <div className="valueMetrics">
     <div><small>現在確認価格</small><b>{live.price}</b></div>
     <div><small>同状態SOLD中央値</small><b>{live.median}</b></div>
     <div><small>SOLD標本</small><b>{live.samples}</b></div>
     <div><small>中央値比</small><b>{live.discount}</b></div>
    </div>
    <div className="valueVerdict"><span>{live.judge}</span><p>{live.summary}</p></div>
    {live.previousPrice&&<p className="valueMove">4時間前：{live.previousPrice} → 現在：{live.price}{live.priceChangeText&&`（${live.priceChangeText}）`}</p>}
    <p><strong>海外：</strong>{live.overseas}</p>
    <div className="miniLinks">
     <a href={live.mercariUrl} target="_blank" rel="noreferrer">現行メルカリ出品を見る ↗</a>
     <a href="/analysis">TOP5全文分析を見る →</a>
    </div>
   </section>}

   {!live&&m&&<section className="valuePanel compactValue">
    <div className="sectionHead"><h2>現在の価値判断</h2><span>MARKET CHECKED</span></div>
    <div className="valueVerdict"><span>相場確認済み</span><p>{m.market}</p></div>
    <p>SOLD標本 {m.soldCount}件を確認。TOP5対象外でも実売データは継続して蓄積します。</p>
   </section>}

   {!live&&!m&&<section className="valuePanel compactValue">
    <div className="sectionHead"><h2>現在の価値判断</h2><span>RESEARCHING</span></div>
    <div className="valueVerdict"><span>調査中</span><p>同番号・単品・状態を揃えたSOLDデータを収集中です。</p></div>
   </section>}

   {officialImage&&<section className="officialCard">
    <span className="eyebrow">OFFICIAL CARD IMAGE</span>
    <h2>{c.id} {c.name}</h2>
    <a href={c.source||"https://www.tv-tokyo.co.jp/anime/naruto2002/goods/card_01.html"} target="_blank" rel="noreferrer"><b>テレビ東京の旧公式カードリストで確認する ↗</b></a>
    <small>外部サイト側の画像直リンク制限を避けるため、カード画像の直接表示は行わず公式カードリストへ案内しています。</small>
   </section>}

   <div className="quickActions">
    {c.source&&<a href={c.source} target="_blank" rel="noreferrer">公式カードリストを見る ↗</a>}
    <a href={"/character/"+encodeURIComponent(c.character)}>「{c.character}」の旧カード一覧 →</a>
    <a href={"/search?q="+encodeURIComponent(c.series)}>「{c.series}」収録カードを探す →</a>
   </div>

   <div className="detailGrid" id="analysis">
    <div><small>カード番号</small><p>{c.id}</p></div>
    <div><small>キャラクター</small><p>{c.character}</p></div>
    <div><small>収録シリーズ</small><p>{c.series}</p></div>
    <div><small>発売時期</small><p>{releaseYear?<a className="inlineYearLink" href={"/year/"+releaseYear}>{c.release} → {releaseYear}年一覧</a>:c.release}</p></div>
    <div><small>種類</small><p>{c.type}</p></div>
    <div><small>相場メモ</small><p>{m?.market||c.market}</p></div>
    <div><small>分析</small><p>{c.note}</p></div>
   </div>

   {c.id==="忍-1"&&<section className="deepAnalysis">
    <span className="eyebrow">DAILY DEEP ANALYSIS / #001</span>
    <h2>忍-1 うずまきナルト｜旧カードの原点を追う</h2>
    <p><strong>位置づけ：</strong>2002年12月13日発売「巻ノ壱」の公式カードリスト先頭に掲載された、主人公うずまきナルトの忍カードNo.1。忍-2はうちはサスケ、忍-3は春野サクラと続きます。</p>
    <div className="analysisFacts">
     <div><small>発売</small><b>2002年12月13日</b></div>
     <div><small>シリーズ</small><b>巻ノ壱</b></div>
     <div><small>直近確認SOLD</small><b>18,200円</b></div>
     <div><small>確認日</small><b>2026年9月29日</b></div>
    </div>
    <h3>相場の見方</h3>
    <p>現時点で確認できる実売には価格差があります。古いカードは傷・白欠け・反りなど状態差の影響が大きいため、単純な平均価格ではなく「同番号・同仕様・状態」を揃えて追跡します。</p>
    <h3>このカードが面白い理由</h3>
    <p>「2002年の最初期」「主人公ナルト」「忍カード番号1」という3つのコレクション要素を持ちます。単なるナルトのカードではなく、旧シリーズの入口として説明しやすい一枚です。</p>
    <h3>今後の予測</h3>
    <p><strong>サイト独自分析：</strong>美品と並品のSOLD差が今後も維持・拡大するかを重点監視します。新しいNARUTOカードゲームへの注目が旧カードへ波及する可能性はありますが、値上がりを保証する材料ではありません。SOLDを追加しながら答え合わせします。</p>
    <h3>PSA・保管判断</h3>
    <p>番号1のコレクション性があるため、傷の少ない個体は鑑定候補として継続観察。鑑定前はスリーブ＋硬質ケースまたはローダーで、表面・角・湿気・紫外線から守るのを優先します。</p>
    <small>事実・SOLD・分析・予測を分けて掲載しています。相場は確認時点の記録で、将来価格を保証するものではありません。</small>
   </section>}

   {c.id==="PR忍-1-R"&&<section className="deepAnalysis" id="pr-ninja-1-r-analysis">
    <span className="eyebrow">VERIFIED SOLD / PROMO DEEP ANALYSIS</span>
    <h2>PR忍-1-R うずまきナルト｜大会賞品プロモの相場と価値</h2>
    <p><strong>確認できた配布背景：</strong>2005年夏の勝ち抜き戦で、5勝達成者が選択できたBランク賞品の一つ。PR忍-4、PR作-5との選択式で、銀色の特製ナルトコインと任務完遂証明書も賞品欄に記載されています。配布枚数は未確認です。</p>
    <div className="analysisFacts">
     <div><small>確認SOLD価格帯（下記4件）</small><b>160,000〜300,000円</b></div>
     <div><small>確認SOLD</small><b>4件（重複要精査）</b></div>
     <div><small>カード仕様</small><b>PR忍-1-R／箔押し</b></div>
     <div><small>配布</small><b>2005年夏・5勝賞品</b></div>
    </div>
    <h3>実売履歴と根拠リンク</h3>
    <div className="historyRow"><b>2026/07/28 Yahoo!フリマ</b><span>160,000円</span></div>
    <div className="historyRow"><b>2026/08/01 Yahoo!フリマ</b><span>300,000円</span></div>
    <div className="historyRow"><b>2026/08/08 Yahoo!フリマ</b><span>259,999円</span></div>
    <div className="historyRow"><b>2026/10/03 オークション集計</b><span>245,000円</span></div>
    <p><a href="https://paypayfleamarket.yahoo.co.jp/item/z651440312" target="_blank" rel="noreferrer">7/28 成約根拠 ↗</a> ／ <a href="https://paypayfleamarket.yahoo.co.jp/item/z652974126" target="_blank" rel="noreferrer">8/1 成約根拠 ↗</a> ／ <a href="https://paypayfleamarket.yahoo.co.jp/item/z657176454" target="_blank" rel="noreferrer">8/8 成約根拠 ↗</a> ／ <a href="https://noncky.net/list/2084064427?sort=price" target="_blank" rel="noreferrer">10/3 集計根拠 ↗</a></p>
    <p><strong>相場判定：</strong>数十万円台の成約実績は確認できますが、標本数が少なく、状態差・同一個体の再販売・販路間重複は未精査です。4件の単純中央値を安定相場として断定しません。ラクマの89,000円SOLD表示も別途存在し、調査範囲によって価格帯が変わります。</p>
    <h3>希少性とコレクション価値</h3>
    <p>主人公ナルトの旧カードであり、一般パックの通常収録品とは異なる大会賞品という入手経路に特徴があります。5勝達成に加え、賞品が選択式だったことは注目点ですが、現存数や配布総数を推測で記載しません。</p>
    <h3>PSA鑑定・状態別の判断</h3>
    <p>高額帯のため、箔押し面の擦れ、四隅の白欠け、縁の傷、反り、表裏の状態を強い光で確認。PSA提出前に鑑定料・補償・往復送料と、同一番号の鑑定品SOLDを比較します。PSA10の取得や鑑定による値上がりは保証されません。</p>
    <h3>今後の相場予測（独自分析）</h3>
    <p>旧NARUTOカードへの関心が増せば大会賞品プロモの再評価余地はあります。一方、薄い取引市場では一件の高額成約だけで相場が大きく見えるリスクがあります。今後は同番号・同加工・状態別SOLD、再出品の有無、PSA実売、海外成約を追跡します。</p>
    <p><a href="https://naruto-card.jp/guides/tournament-win-promos" target="_blank" rel="noreferrer">2005年夏の大会賞品資料を読む ↗</a></p>
    <small>2026年10月9日調査。成約表示と独自分析を区別。取引時点の価格であり現在の買取保証額ではありません。</small>
   </section>}
   <section className="deepAnalysis">
    <span className="eyebrow">CARD VALUE CHECK</span>
    <h2>{c.id} {c.name}｜収集・PSA判断</h2>
    <div className="analysisFacts">
     <div><small>コレクション軸</small><b>{c.character||c.name}</b></div>
     <div><small>収録</small><b>{c.series||"確認中"}</b></div>
     <div><small>年代</small><b>{releaseYear?releaseYear+"年":"確認中"}</b></div>
     <div><small>市場データ</small><b>{live?"監視中":m?m.soldCount+"件確認":"調査中"}</b></div>
    </div>
    <h3>このカードの見方</h3>
    <p>{c.id}「{c.name}」は、キャラクター人気だけでなく、収録シリーズ・発売時期・カード番号・状態を分けて評価します。旧カードは同じ番号でも白欠け、角傷、表面傷、反りで実売価格が大きく変わるため、出品価格ではなく同仕様のSOLDを優先します。</p>
    <h3>PSA候補として見るポイント</h3>
    <p>{c.character||c.name}の人気、初期・節目の番号、希少な配布条件などのコレクション性に加え、センタリング、四隅、縁、表裏の傷を確認します。鑑定料を含めた採算が取れるかは、未鑑定美品とPSA鑑定品の実売差が確認できてから判断します。</p>
    <h3>今後の相場チェック</h3>
    <p>同番号・同仕様のSOLD件数、状態別の価格差、海外需要、PSA鑑定品の実売を継続確認します。データ不足時は価格を推測せず「調査中」とし、確認できた実売から更新します。</p>
    <small>相場・PSA評価は将来価格や鑑定結果を保証するものではありません。</small>
   </section>

   {m&&<section className="history">
    <span className="eyebrow">VERIFIED MARKET DATA</span>
    <h2>{c.id} {c.name}の実売調査</h2>
    <div className="historyRow"><b>確認SOLD標本</b><span>{m.soldCount}件</span></div>
    <div className="historyRow"><b>データ状態</b><span>{m.confidence}</span></div>
    <div className="historyRow"><b>最終確認</b><span>{m.checkedAt}</span></div>
    <p>{m.market}</p>
    <p>※SOLD標本数は確認できた掲載資料の件数で、市場全体の販売件数ではありません。状態・版・加工が揃わないデータを無理に平均化しません。</p>
   </section>}

   {!m&&<section className="history">
    <span className="eyebrow">MARKET DATA</span>
    <h2>{c.id} {c.name}の相場</h2>
    <p>現在、実売データを調査中です。確認できたSOLDから順次反映します。</p>
   </section>}

   <section className="cardStorageCta" id="psa-storage">
    <span className="eyebrow">STORAGE GUIDE</span>
    <h2>{storageLabel}</h2>
    <p>{live?`${live.price}で確認中のカード。状態を落とさない保管方法を価格帯から選べます。`:"カードの状態を落とさない基本保管を確認できます。"}</p>
    <div className="storageProductChoice">
     <span>{storageProduct.note}</span>
     <a href={storageProduct.url} target="_blank" rel="sponsored nofollow noreferrer">{storageProduct.name}をAmazonで見る →</a>
    </div>
    <a href="/storage-guide">このカードの保管方法を詳しく見る →</a>
    <small className="affiliateNote">※Amazonアソシエイトのリンクを使用しています。</small>
   </section>

   <section className="related" id="related">
    <span className="eyebrow">RELATED CARDS</span>
    <h2>{c.name}の関連カード</h2>
    <div className="grid">{related.map(x=><a className="card" href={"/card/"+encodeURIComponent(x.id)} key={x.id}><div className="num">{x.id}</div><h3>{x.name}</h3><p>{x.series}</p><b>{x.id}の相場・収録情報 →</b></a>)}</div>
    <div className="miniLinks"><a href={"/character/"+encodeURIComponent(c.character)}>「{c.character}」の旧カードをすべて見る →</a><a href="/ranking">NARUTO旧カードの注目ランキングを見る →</a></div>
   </section>

   <aside className="amazonBox">
    <span className="eyebrow">RELATED / AMAZON</span>
    <h2>NARUTOを作品から振り返る</h2>
    <p>カードのキャラクターや当時の作品背景を確認したい人向けの関連商品です。</p>
    <a className="amazonBtn" href="https://link.amazon/B06EMOlAu" target="_blank" rel="sponsored nofollow noreferrer">NARUTO関連商品をAmazonで見る →</a>
    <small>※Amazonアソシエイトのリンクを使用しています。</small>
   </aside>

   <p>※出品希望額と販売済み価格は別扱い。未確認情報は推測で補完しません。</p>
  </section>
 </main>;
}
