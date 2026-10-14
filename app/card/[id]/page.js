import {getCardResearch} from "../../../lib/getCardResearch";
import {deepAnalysisRecords} from "../../../lib/deepAnalysisRecords";
import {dailyResearch} from "../../../lib/dailyResearch";
import {marketRecord,formatSold} from "../../../lib/dotMarket";
import {findCard,cards} from "../../../lib/cards";
import {getMarketData} from "../../../lib/market";
import {getMarketAnalysis} from "../../../lib/getMarketAnalysis";
import {notFound} from "next/navigation";
import {Breadcrumbs,CardTile,DataNotice} from "../../components/DatabaseUI";

export async function generateMetadata({params}){
 const {id}=await params;
 const decoded=decodeURIComponent(id);
 let c=findCard(decoded);
 let live=null;
 if(!c){
  const marketAnalysis=await getMarketAnalysis();
  live=marketAnalysis.picks?.find(p=>p.id===decoded);
  if(!live){
   const snapshot=await getCardResearch(decoded);
   if(!snapshot)return {};
   const name=snapshot.research.name||"名称確認中";
   c={id:decoded,name,character:name,series:"収録資料照合中",release:"不明"};
  }else{
   c={id:live.id,name:live.name,character:live.name,series:"収録シリーズ確認中",release:"不明"};
  }
 }
 const deep=deepAnalysisRecords[c.id]||null;
 const daily=dailyResearch[c.id]||null;
 const hasDeep=Boolean(deep||daily);
 const releaseText=c.release&&c.release!=="不明"?c.release:"発売時期確認中";
 const seriesText=c.series&&c.series!=="収録シリーズ確認中"?c.series:"収録情報確認中";
 const title=hasDeep
  ? `${c.id} ${c.name}｜相場・SOLD履歴・PSA・収録情報`
  : `${c.id} ${c.name}｜相場・収録情報`;
 const description=hasDeep
  ? `${c.id} ${c.name}（${seriesText}）。確認済みSOLD、相場、PSA鑑定判断、歴史的位置づけ、関連カードを整理。NARUTO旧カードを1枚ずつ検証しています。`
  : `${c.id} ${c.name}の相場、収録シリーズ、発売時期（${releaseText}）、種類、関連カードを確認。NARUTO旧カードをカード番号単位で整理しています。`;
 return {
  title,
  description,
  alternates:{canonical:"/card/"+encodeURIComponent(c.id)},
  openGraph:{
   type:"article",
   title,
   description,
   url:"/card/"+encodeURIComponent(c.id)
  },
  twitter:{card:"summary_large_image",title,description}
 };
}

export default async function Page({params}){
 const {id}=await params;
 const decoded=decodeURIComponent(id);
 const marketAnalysis=await getMarketAnalysis();
 const live=marketAnalysis.picks?.find(p=>p.id===decoded)||null;
 const dbCard=findCard(decoded);
 const researchSnapshot=await getCardResearch(decoded);
 if(!dbCard&&!live&&!researchSnapshot)notFound();

 const c=dbCard||(live?{
  id:live.id,name:live.name,character:live.name,
  series:"収録シリーズ確認中",release:"不明",type:"市場分析対象",rank:live.judge,
  market:`現在 ${live.price} / 同状態SOLD中央値 ${live.median}`,
  note:"定期市場分析で注目中。収録シリーズ・発売時期は確認でき次第追記します。",
  source:null
 }:{
  id:decoded,name:researchSnapshot.research.name||"名称確認中",
  character:researchSnapshot.research.name||"確認中",
  series:"NARUTO旧カード（収録資料照合中）",
  release:"不明",type:"調査対象",rank:"C",market:"相場調査中",
  note:"個別調査の記録があります。公式収録資料・同仕様SOLDの照合は継続中。",source:null
 });
 const m=getMarketData(c.id);
 const deepRecord=deepAnalysisRecords[c.id]||null;
 const daily=dailyResearch[c.id]||null;
 const research=researchSnapshot?.research||null;
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
 const archive=/^PR|^OP忍-/.test(c.id)?{href:"/promo",label:"プロモ一覧"}:/^忍-\d+$/.test(c.id)?{href:"/cards",label:"忍カード一覧"}:/疾風伝|伝-/.test(c.series+" "+c.id)?{href:"/shippuden",label:"疾風伝カード"}:{href:"/search",label:"カード検索"};
 const numericPrice=live?Number(String(live.price).replace(/[^0-9]/g,"")):null;
 const storageLabel=numericPrice>=5000?"高額カード向け保管":numericPrice>=1000?"スリーブ＋ケース保管":"基本スリーブ保管";
 const storageProduct=numericPrice>=5000
  ? {name:"マグネットローダー",url:"https://link.amazon/B0etIAWiI",note:"高額カードは角・表面を守れるローダーを優先"}
  : {name:"トレカ用スリーブ",url:"https://link.amazon/B05QqCBV6",note:numericPrice>=1000?"まずスリーブで保護し、必要に応じて硬質ケースへ":"低価格帯でも擦れ・皮脂を防ぐ基本保管"};

 const cardJsonLd={
  "@context":"https://schema.org",
  "@type":"CollectionPage",
  name:`${c.id} ${c.name}｜NARUTO旧カードDB`,
  url:`https://naruto-card-db.vercel.app/card/${encodeURIComponent(c.id)}`,
  description:`${c.id} ${c.name}の収録情報・相場・SOLD履歴・PSA判断を整理したカード個別ページ。`,
  about:{
   "@type":"Thing",
   name:`${c.id} ${c.name}`,
   description:`${c.character||c.name} / ${c.series||"NARUTO旧カード"}`
  },
  inLanguage:"ja"
 };

 return <main className="cardDetailPage">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(cardJsonLd).replace(/</g,"\\u003c")}} />
  <Breadcrumbs items={[archive,{label:c.id}]}/>
  <section className="detail cardDetail">
   <header className="pageIntro cardIntro"><span className="eyebrow">CARD RECORD / {c.type}</span>
    <h1><span className="cardNumber">{c.id}</span>{c.name}</h1>
    <p>{c.series}</p><div className="status">注目ランク {c.rank}</div>
   </header>

   <nav className="cardDetailNav" aria-label="カード詳細の目次">
    <a href="#market">SOLD・相場</a><a href="#analysis">個別分析</a>{daily&&<a href="#daily-research">連載分析</a>}<a href="#basic">基本情報</a><a href="#psa-storage">PSA・保管</a><a href="#related">関連カード</a>
   </nav>

   <section id="basic" className="cardSnapshot">
    <div><small>カード番号</small><b>{c.id}</b></div>
    <div><small>キャラクター</small><b>{c.character}</b></div>
    <div><small>シリーズ</small><b>{c.series}</b></div>
    <div><small>発売</small><b>{c.release}</b></div>
   </section>

   <div id="market" className="anchorTarget"></div>
   {live&&<DataNotice analysis={marketAnalysis}/>}
   {live&&<section className="valuePanel">
    <div className="sectionHead"><h2>現在の価値判断</h2><span>{marketAnalysis.updatedAt}</span></div>
    <div className="valueMetrics">
     <div><small>出品確認価格</small><b>{live.price}</b></div>
     <div><small>同状態SOLD中央値</small><b>{live.median}</b></div>
     <div><small>SOLD標本</small><b>{live.samples}</b></div>
     <div><small>中央値比</small><b>{live.discount}</b></div>
    </div>
    <div className="valueVerdict"><span>{live.judge}</span><p>{live.summary}</p></div>
    {live.previousPrice&&<p className="valueMove">前回確認：{live.previousPrice} → 今回：{live.price}{live.priceChangeText&&`（${live.priceChangeText}）`}</p>}
    <p><strong>海外：</strong>{live.overseas}</p>
    <div className="miniLinks">
     <a href={live.mercariUrl} target="_blank" rel="noreferrer">現行メルカリ出品を見る ↗</a>
     <a href="/analysis">TOP5全文分析を見る →</a>
    </div>
   </section>}

   {!live&&m&&<section className="valuePanel compactValue">
    <div className="sectionHead"><h2>相場調査・SOLD確認</h2><span>{m.soldCount>0?"SOLD CHECKED":"RESEARCHING"}</span></div>
    <div className="valueVerdict"><span>{m.soldCount>0?"個別SOLD表示あり":"同番号SOLD未確認"}</span><p>{m.market}</p></div>
    <p>{m.soldCount>0? `掲載した単品SOLD標本 ${m.soldCount}件。状態や仕様の異なる標本を混ぜた中央値は未確定です。`:"現時点で確認できるSOLD価格はありません。成約が存在しないという意味ではありません。"}</p>
    {m.checkedAt&&<p className="mutedNote">最終調査記録：{m.checkedAt}</p>}
   </section>}

   {!live&&!m&&<section className="valuePanel compactValue">
    <div className="sectionHead"><h2>現在の価値判断</h2><span>RESEARCHING</span></div>
    <div className="valueVerdict"><span>調査中</span><p>同番号・単品・状態を揃えたSOLDデータを収集中です。</p></div>
   </section>}

   <div id="analysis" className="anchorTarget"></div>

   {research&&<details className="deepAnalysis researchDetails" open>
    <summary>{c.id} {c.name}｜{researchSnapshot.snapshot_date}の個別追跡（{researchSnapshot.status==="complete"?"検証完了":"継続調査・暫定"}）</summary>
    <div className="researchContent">
     <p><strong>検証状況：</strong>{researchSnapshot.status==="complete"?"完了":"未完了。版・加工・言語・状態の厳密照合は継続中。"} 未確認の数値は確定相場ではありません。</p>
     {research.historicalContextAndVerification&&<><h3>基本情報・歴史的位置づけ</h3><p>{research.historicalContextAndVerification}</p></>}
     {research.verifiedNewFacts?.length>0&&<><h3>今回確認した事実</h3><ul>{research.verifiedNewFacts.map((x,i)=><li key={i}>{x}</li>)}</ul></>}
     {research.collectionAndGameplayAnalysis&&<><h3>収集・当時のゲームでの役割</h3><p>{research.collectionAndGameplayAnalysis}</p></>}
     <h3>同仕様SOLD・中央値</h3>
     <div className="analysisFacts">
      <div><small>同仕様の確定中央値</small><b>{research.strictSameSpecSoldMedianJPY==null?"未確認":yen(research.strictSameSpecSoldMedianJPY)}</b></div>
      <div><small>仕様確認済み標本</small><b>{research.strictSameSpecSoldCount||0}件</b></div>
      <div><small>前回の番号一致SOLD表示</small><b>{research.baselineSoldReference?.numberMatchedSampleCount??"未確認"}件（厳密照合前）</b></div>
      <div><small>今回のSOLD表示</small><b>{research.additionalSoldCount??0}件（厳密照合前）</b></div>
     </div>
     {research.additionalSoldDisplayCandidates?.length>0&&<ul>{research.additionalSoldDisplayCandidates.map((x,i)=><li key={i}>{x.url?.startsWith("https://")?<a href={x.url} target="_blank" rel="noopener noreferrer">{yen(x.displayedPriceJPY)} ↗</a>:yen(x.displayedPriceJPY)} ／ {x.sellerConditionClaim||"状態未確認"}（SOLD表示・最終決済額未確認）</li>)}</ul>}
     {research.soldSummary&&<p>{research.soldSummary}</p>}
     <h3>国内の現在ASK（販売希望額）</h3>
     {research.currentAskObservations?.length?<ul>{research.currentAskObservations.map((x,i)=><li key={i}>{x.url?.startsWith("https://")?<a href={x.url} target="_blank" rel="noopener noreferrer">{yen(x.askJPY)} ↗</a>:yen(x.askJPY)} ／ {x.sellerConditionClaim||"状態未確認"}</li>)}</ul>:<p>未確認</p>}
     <h3>海外eBay SOLD・ASK</h3>
     <p>同仕様の成約額：{research.overseasSameSpecRealizedSoldMedianUSD==null?"未確認":research.overseasSameSpecRealizedSoldMedianUSD+" USD"}。確認済み成約標本：{research.overseasSameSpecRealizedSoldCount||0}件（成約なしと断定しません）。</p>
     {research.overseasAskObservations?.length?<ul>{research.overseasAskObservations.map((x,i)=><li key={i}>{x.url?.startsWith("https://")?<a href={x.url} target="_blank" rel="noopener noreferrer">{x.askUSD??"価格未確認"} USDのASK ↗</a>:"ASK：価格未確認"} ／ {x.note||"仕様未照合"}</li>)}</ul>:<p>海外ASKは未確認</p>}
     {research.overseasSoldDisplayCandidates?.length>0&&<ul>{research.overseasSoldDisplayCandidates.map((x,i)=><li key={i}>{x.url?.startsWith("https://")?<a href={x.url} target="_blank" rel="noopener noreferrer">{x.displayedPriceUSD} USDのSOLD表示 ↗</a>:"SOLD表示"} ／ {x.note}（同仕様・最終決済額は未確認）</li>)}</ul>}
     {research.overseasAnalysis&&<p>{research.overseasAnalysis}</p>}
     {research.bundlesOtherGradesAndNonComparable?.length>0&&<><h3>セット・別仕様の比較（単品統計に含めない）</h3><ul>{research.bundlesOtherGradesAndNonComparable.map((x,i)=>typeof x==="string"?<li key={i}>{x}</li>:x&&typeof x==="object"?<li key={i}>{x.url?.startsWith("https://")?<a href={x.url} target="_blank" rel="noopener noreferrer">{yen(x.displayedPriceJPY)} ↗</a>:yen(x.displayedPriceJPY)} ／ {x.note} {x.status&&`（${x.status}）`}</li>:null)}</ul></>}
     {research.marketAndVariantCautions&&<><h3>仕様・状態差と希少性</h3><p>{research.marketAndVariantCautions}</p><p>配布枚数・希少性：{research.scarcityVerified?"裏付け確認済み":"未確認"}</p></>}
     {research.buyDecision&&<><h3>買う・仕入れる判断</h3><p>{research.buyDecision}</p></>}
     {research.sellDecision&&<><h3>売る場合の判断</h3><p>{research.sellDecision}</p></>}
     {research.futureForecastUnverified&&<><h3>今後の材料・予測（未検証）</h3><p>{research.futureForecastUnverified}</p></>}
     {research.psaDecision&&<><h3>PSA判断</h3><p>{research.psaDecision}</p></>}
     {research.storageDecision&&<><h3>保管判断</h3><p>{research.storageDecision}</p></>}
     {research.pendingVerification?.length>0&&<><h3>未完了・次の確認項目</h3><ul>{research.pendingVerification.map((x,i)=><li key={i}>{x}</li>)}</ul></>}
     {research.officialAndRetailerSources?.length>0&&<><h3>収録・仕様・公式情報の出典</h3><ul>{research.officialAndRetailerSources.map((x,i)=>{
      const url=typeof x==="string"?x:x?.url;
      const label=typeof x==="string"?x:x?.label||url;
      return url?.startsWith("https://")?<li key={i}><a href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a></li>:null;
     })}</ul></>}
     <small>この追跡記録は従来の価格履歴を上書きせず、日付ごとに別保存。ASK、SOLD表示、事実、予測は別扱いです。</small>
    </div>
   </details>}
   {deepRecord&&<details className="deepAnalysis researchDetails">
    <summary>{c.id} {c.name}｜個別分析・SOLD追跡</summary><div className="researchContent">
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
    </>:deepRecord.soldSamples?.length>0?<>
    <div className="analysisFacts"><div><small>URL付きSOLD表示</small><b>{deepRecord.soldSamples.length}件（重複未精査）</b></div><div><small>比較方針</small><b>状態別に分離／中央値保留</b></div></div>
    <ul>{deepRecord.soldSamples.map((x,i)=><li key={i}><a href={x.url} target="_blank" rel="noopener noreferrer">{yen(x.price)} ↗</a> ／ {x.platform} ／ {x.period} ／ {x.condition}</li>)}</ul>
    <small>これらは各商品ページ・落札検索の表示価格です。取引完了や同仕様であることを保証するものではありません。以前の確認済み3標本との重複が不明なため、単純に7件とは数えません。極端な状態差があり4件の中央値・平均は算出対象外です。</small>
    </>:<p>個別SOLD金額はまだ記録されていません。確認できた取引から追加します。</p>}
    {deepRecord.askSamples?.length>0&&<><h3>現在の出品価格（SOLDとは別）</h3><ul>{deepRecord.askSamples.map((x,i)=><li key={i}>{yen(x.price)} ／ {x.platform} ／ {x.period} ／ {x.condition}{x.url&&<> ／ <a href={x.url} target="_blank" rel="noopener noreferrer">出品を見る ↗</a></>}</li>)}</ul></>}
    <h3>このカード固有の注目点</h3><p>{deepRecord.note}</p>
    <h3>SOLD・相場の判断</h3><p>{m?m.market:"同番号・同加工・同状態のSOLDを確認するまで価格は設定しません。出品価格を実売と混同しません。"}</p>
    <h3>PSA鑑定・保管</h3><p>角・縁・表裏の擦れ、反り、センタリングを確認し、鑑定料と同仕様のPSA鑑定品SOLDが確認できた場合のみ採算を判断します。</p>
    <h3>今後の見通し（予測）</h3><p>{deepRecord.outlook}</p>
    <small>カード固有の観察と予測を区別。価格未確認のカードに推定相場は掲載しません。</small>
   </div></details>}

   {daily&&<details className="deepAnalysis researchDetails" id="daily-research" open>
    <summary>{daily.title}</summary><div className="researchContent">
    <span className="eyebrow">TODAY'S CARD / #{String(daily.sequence).padStart(3,"0")}</span>
    <p>調査日：{daily.checkedAt}　／　{daily.attribute||"属性確認中"}　／　{daily.rarity||"レア度確認中"}</p>
    {daily.history&&<><h3>歴史的位置づけ</h3><p>{daily.history}</p></>}
    {daily.facts?.length>0&&<><h3>確認できた事実</h3><ul>{daily.facts.map((x,i)=><li key={i}>{x}</li>)}</ul></>}
    {daily.sold?.length>0&&<><h3>確認SOLD（単品）</h3><div className="analysisFacts"><div><small>件数</small><b>{daily.sold.length}件</b></div><div><small>中央値</small><b>{yen((()=>{const v=daily.sold.map(x=>x.price).sort((a,b)=>a-b);return v.length%2?v[(v.length-1)/2]:(v[v.length/2-1]+v[v.length/2])/2})())}</b></div></div><ul>{daily.sold.map((x,i)=><li key={i}>{x.url?<a href={x.url} target="_blank" rel="noopener noreferrer">{yen(x.price)} ↗</a>:yen(x.price)} {x.condition||""} {x.period||""}</li>)}</ul></>}
    {daily.bundles?.length>0&&<><h3>セットSOLD（単品とは別集計）</h3><ul>{daily.bundles.map((x,i)=><li key={i}>{x.label}：{yen(x.price)} {x.url&&<a href={x.url} target="_blank" rel="noopener noreferrer">根拠 ↗</a>}</li>)}</ul></>}
    {daily.asks?.length>0&&<><h3>現在の出品価格（SOLDではありません）</h3><ul>{daily.asks.map((x,i)=><li key={i}>{x.label}：{yen(x.price)}</li>)}</ul></>}
    {daily.marketMovement&&<><h3>相場の動き</h3><p>{daily.marketMovement}</p></>}
    {daily.analysis&&<><h3>独自分析</h3><p>{daily.analysis}</p></>}
    {daily.forecast&&<><h3>今後の予測</h3><p>{daily.forecast}</p></>}
    {daily.buyDecision&&<><h3>購入判断</h3><p>{daily.buyDecision}</p></>}
    {daily.psa&&<><h3>PSA鑑定</h3><p>{daily.psa}</p></>}
    {daily.storage&&<><h3>保管</h3><p>{daily.storage}</p></>}
    {daily.sources?.length>0&&<><h3>参照資料</h3><ul>{daily.sources.map((x,i)=><li key={i}><a href={x.url} target="_blank" rel="noopener noreferrer">{x.label} ↗</a></li>)}</ul></>}
    <small>単品SOLD・セット取引・販売中価格・予測は区別して掲載しています。</small>
   </div></details>}

   {officialImage&&<section className="officialCard">
    <span className="eyebrow">OFFICIAL CARD IMAGE</span>
    <h2>{c.id} {c.name}</h2>
    <a href={c.source||"https://www.tv-tokyo.co.jp/anime/naruto2002/goods/card_01.html"} target="_blank" rel="noreferrer"><b>テレビ東京の旧公式カードリストで確認する ↗</b></a>
    <small>外部サイト側の画像直リンク制限を避けるため、カード画像の直接表示は行わず公式カードリストへ案内しています。</small>
   </section>}

   <div className="quickActions">
    {c.source&&<a href={c.source} target="_blank" rel="noreferrer">公式カードリストを見る ↗</a>}
    <a href={"/character/"+encodeURIComponent(c.character)}>「{c.character}」の旧カード一覧 →</a>
    <a href={"/search?series="+encodeURIComponent(c.series)}>「{c.series}」収録カードを探す →</a>
   </div>

   <div className="detailGrid cardNotes">
    <div><small>発売時期</small><p>{releaseYear?<a className="inlineYearLink" href={"/year/"+releaseYear}>{c.release} → {releaseYear}年一覧</a>:c.release}</p></div>
    <div><small>種類</small><p>{c.type}</p></div>
    <div><small>相場メモ</small><p>{m?.market||c.market}</p></div>
    <div><small>分析</small><p>{c.note}</p></div>
   </div>

   {c.id==="忍-1"&&<details className="deepAnalysis researchDetails">
    <summary>忍-1 うずまきナルト｜旧カードの原点を追う</summary><div className="researchContent">
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
   </div></details>}

   {c.id==="PR忍-1-R"&&<details className="deepAnalysis researchDetails" id="pr-ninja-1-r-analysis">
    <summary>PR忍-1-R うずまきナルト｜大会賞品プロモの相場と価値</summary><div className="researchContent">
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
   </div></details>}
   <section className="deepAnalysis" id="psa-storage">
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

   <section className="cardStorageCta" id="storage">
    <span className="eyebrow">STORAGE GUIDE</span>
    <h2>{storageLabel}</h2>
    <p>{live?`${live.price}で確認中のカード。状態を落とさない保管方法を価格帯から選べます。`:"カードの状態を落とさない基本保管を確認できます。"}</p>
    <div className="storageProductChoice">
     <span>{storageProduct.note}</span>
     <a href={storageProduct.url} target="_blank" rel="sponsored nofollow noreferrer">{storageProduct.name}をAmazonで見る →</a>
    </div>
    <a href="/storage-guide">このカードの保管方法を詳しく見る →</a>
    <a className="textLink" href="/recommended#storage" data-shopping-placement="card-storage">保護・収納用品のおすすめを選ぶ →</a>
    <small className="affiliateNote">※Amazonアソシエイトのリンクを使用しています。</small>
   </section>

   <section className="related" id="related">
    <span className="eyebrow">RELATED CARDS</span>
    <h2>{c.name}の関連カード</h2>
    <div className="grid">{related.map(card=><CardTile card={card} key={card.id}/>)}</div>
    <div className="miniLinks"><a href={"/character/"+encodeURIComponent(c.character)}>「{c.character}」の旧カードをすべて見る →</a><a href="/ranking">NARUTO旧カードの注目ランキングを見る →</a></div>
   </section>

   <aside className="amazonBox">
    <span className="eyebrow">RELATED / AMAZON</span>
    <h2>NARUTOを作品から振り返る</h2>
    <p>カードのキャラクターや当時の作品背景を確認したい人向けの関連商品です。</p>
    <a className="amazonBtn" href="/recommended#books" data-shopping-placement="card-related">漫画・映像・グッズのおすすめを見る →</a>
    <a className="textLink" href="https://link.amazon/B06EMOlAu" target="_blank" rel="sponsored nofollow noreferrer">AmazonでNARUTO関連商品を見る ↗</a>
    <small>※Amazonアソシエイトのリンクを使用しています。</small>
   </aside>

   <p>※出品希望額と販売済み価格は別扱い。未確認情報は推測で補完しません。</p>
  </section>
 </main>;
}
