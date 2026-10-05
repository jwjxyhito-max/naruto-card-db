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
    <a href={officialImage} target="_blank" rel="noreferrer"><img src={officialImage} alt={`${c.id} ${c.name} 公式カード画像`}/><b>画像をタップして拡大 ↗</b></a>
    <small>画像出典：テレビ東京 NARUTO旧公式カードリスト。画像は当サイトへ保存せず公式URLを参照しています。</small>
   </section>}

   <div className="quickActions">
    {c.source&&<a href={c.source} target="_blank" rel="noreferrer">公式カードリストを見る ↗</a>}
    <a href={"/character/"+encodeURIComponent(c.character)}>「{c.character}」の旧カード一覧 →</a>
    <a href={"/search?q="+encodeURIComponent(c.series)}>「{c.series}」収録カードを探す →</a>
   </div>

   <div className="detailGrid">
    <div><small>カード番号</small><p>{c.id}</p></div>
    <div><small>キャラクター</small><p>{c.character}</p></div>
    <div><small>収録シリーズ</small><p>{c.series}</p></div>
    <div><small>発売時期</small><p>{releaseYear?<a className="inlineYearLink" href={"/year/"+releaseYear}>{c.release} → {releaseYear}年一覧</a>:c.release}</p></div>
    <div><small>種類</small><p>{c.type}</p></div>
    <div><small>相場メモ</small><p>{m?.market||c.market}</p></div>
    <div><small>分析</small><p>{c.note}</p></div>
   </div>

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

   <section className="cardStorageCta">
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

   <section className="related">
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
