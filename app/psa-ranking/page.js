import {psaRecords,psaUpdatedAt,highValueRanking,lowPopRanking} from "../../lib/psaRecords";
import {psaOpportunityRecords,opportunityStats} from "../../lib/psaOpportunity";

export const metadata={
 title:"NARUTO PSA10ランキング｜高額・低POPカード",
 description:"PSA公式で確認したNARUTOカードのPSA10販売実績とPopulationから、高額カード・低POPカードをランキング表示。",
 alternates:{canonical:"/psa-ranking"}
};

export default function PsaRanking(){
 const value=highValueRanking();
 const rare=lowPopRanking();
 return <main>
  <header><div className="brand">NARUTO OLD CARD DATABASE</div><div className="sub">PSA 10 RANKING</div></header>
  <section className="hero"><span className="eyebrow">VERIFIED SALES / POPULATION</span><h1>NARUTO PSA10<br/>ランキング</h1><p>PSA公式Cert Verificationで確認した販売実績とPopulationを別々に評価します。高額＝希少とは限らないため、2軸で見ます。</p></section>

  <section>
   <div className="sectionHead"><h2>PSA10 高額実績ランキング</h2><span>更新 {psaUpdatedAt}</span></div>
   <div className="grid">{value.map((r,i)=><article className="card" key={"v"+r.cert}>
    <div className="rank">#{i+1} / {r.tag}</div><div className="num">{r.card}</div><h3>{r.name}</h3>
    <p>{r.set}</p><p>確認済み販売 <b>{r.lastSale}</b></p><p>PSA10 POP <b>{r.pop}</b> / Estimate {r.estimate}</p>
    <a href={r.url} target="_blank" rel="noreferrer"><b>PSA公式で確認 →</b></a>
   </article>)}</div>
  </section>

  <section>
   <div className="sectionHead"><h2>PSA10 POP10以下ランキング</h2><span>LOW POP</span></div>
   <div className="grid">{rare.map((r,i)=><article className="card" key={"p"+r.cert}>
    <div className="rank">#{i+1} / POP {r.pop}</div><div className="num">{r.card}</div><h3>{r.name}</h3>
    <p>{r.set}</p><p>PSA10 POP <b>{r.pop}</b></p><p>確認済み販売 <b>{r.lastSale}</b></p>
    <a href={r.url} target="_blank" rel="noreferrer"><b>PSA公式Cert →</b></a>
   </article>)}</div>
  </section>

  <section>
   <div className="sectionHead"><h2>未鑑定 → PSA10価格差</h2><span>VERIFIED MATCH ONLY</span></div>
   <div className="grid">{psaOpportunityRecords.map((r,i)=>{const s=opportunityStats(r);return <article className="card" key={r.id}>
    <div className="rank">#{i+1} / PRICE SIGNAL</div><div className="num">{r.id}</div><h3>{r.name}</h3>
    <p>未鑑定 {r.rawCondition} <b>$ {r.rawPrice.toFixed(2)}</b> <small>({r.rawSource} / {r.rawStatus})</small></p>
    <p>PSA10 確認実売 <b>$ {r.psa10Price.toFixed(2)}</b> <small>({r.psaSaleDate})</small></p>
    <p>単純価格差 <b>+$ {s.spread.toFixed(2)}</b> / 約 <b>{s.multiple.toFixed(1)}倍</b></p>
    <p>PSA10 POP <b>{r.psa10Pop}</b></p>
    <a href={r.rawUrl} target="_blank" rel="noreferrer">未鑑定ソース →</a><br/>
    <a href={r.psaUrl} target="_blank" rel="noreferrer"><b>PSA公式 →</b></a>
   </article>})}</div>
   <p style={{fontSize:12,opacity:.7}}>※これは利益予測ではありません。鑑定料金、往復送料、保険、販売手数料、税、カード状態、PSA10取得率を控除していない単純な市場価格差です。未鑑定品がPSA10になる保証はありません。</p>
  </section>

  <section className="about"><h2>提出期待値スコアは次段階</h2><p>同一カードの未鑑定SOLDデータを増やした後、鑑定コストとPSA10取得率を別入力にして「損益分岐PSA10確率」を計算できる形へ拡張します。確認できない相場は推測で埋めません。</p></section>
  <p><a href="/psa"><b>← PSA10実績DBへ</b></a>　<a href="/"><b>トップへ</b></a></p>
  <footer>非公式ファンデータベース / PSA公式で確認できた情報を確認日時点で記録しています。</footer>
 </main>
}