import {psaRecords,psaUpdatedAt,highValueRanking,lowPopRanking} from "../../lib/psaRecords";

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

  <section className="about"><h2>未鑑定 → PSA10価格差ランキング</h2><p>準備中。同一カード・同一仕様の未鑑定SOLDを確認できたものだけ追加します。出品価格（ASK）を実売として計算せず、状態差も明示して期待値を算出します。</p></section>
  <p><a href="/psa"><b>← PSA10実績DBへ</b></a>　<a href="/"><b>トップへ</b></a></p>
  <footer>非公式ファンデータベース / PSA公式で確認できた情報を確認日時点で記録しています。</footer>
 </main>
}