import {psaRecords,psaUpdatedAt} from "../../lib/psaRecords";

export const metadata={
 title:"NARUTO PSA10実績DB｜鑑定枚数・落札実績・PSA相場",
 description:"PSA公式で確認できるNARUTOカードのPSA10実績、Population、PSA Estimate、販売実績を整理。旧NARUTO CCGから日本カードまで追跡します。",
 alternates:{canonical:"/psa"}
};

export default function PsaPage(){
 const sorted=[...psaRecords].sort((a,b)=>b.pop===a.pop?0:a.pop-b.pop);
 return <main>
  <header><div className="brand">NARUTO OLD CARD DATABASE</div><div className="sub">PSA 10 VERIFIED DATABASE</div></header>
  <section className="hero">
   <span className="eyebrow">PSA / POPULATION / SALES</span>
   <h1>NARUTOのPSA10、<br/>実績から価値を追う。</h1>
   <p>PSA公式のCert Verificationで確認できた鑑定実績を蓄積。Population、PSA Estimate、直近の確認済み販売価格を分けて表示します。</p>
  </section>

  <section>
   <div className="sectionHead"><h2>PSA10実績DB</h2><span>更新 {psaUpdatedAt} / {psaRecords.length} RECORDS</span></div>
   <div className="grid">{sorted.map(r=>
    <article className="card" key={r.cert}>
     <div className="rank">{r.tag} / POP {r.pop}</div>
     <div className="num">{r.year} / {r.card}</div>
     <h3>{r.name}</h3>
     <p>{r.set}</p>
     <p><b>{r.grade}</b>　PSA Population <b>{r.pop}</b></p>
     <p>PSA Estimate <b>{r.estimate}</b></p>
     <p>確認済み販売実績 <b>{r.lastSale}</b> <small>({r.saleDate})</small></p>
     <a href={r.url} target="_blank" rel="noreferrer"><b>PSA公式Certで確認 →</b></a>
    </article>)}</div>
   <p style={{fontSize:12,opacity:.7}}>※Population・Estimate・販売履歴は変動します。ここでは確認日時点のPSA公式表示を記録し、価格を保証するものではありません。</p>
  </section>

  <section>
   <div className="sectionHead"><h2>このDBで見るポイント</h2><span>VALUE SIGNALS</span></div>
   <div className="grid">
    <div className="card"><h3>POPの少なさ</h3><p>PSA10枚数が少ないほど供給面では希少。ただし需要がなければ高値になるとは限りません。</p></div>
    <div className="card"><h3>実売価格</h3><p>PSA Estimateだけでなく、PSAが表示するオークション等の販売履歴を優先して確認します。</p></div>
    <div className="card"><h3>旧カード × 2027</h3><p>2027年の新NARUTO CARD GAMEをきっかけに旧カードへの需要が変化するか継続観測します。</p></div>
   </div>
  </section>

  <section>
   <div className="sectionHead"><h2>PSAランキング</h2><span>VALUE / LOW POP</span></div>
   <a className="analysisCta" href="/psa-ranking"><span>PSA公式確認データから自動集計</span><b>PSA10高額・POP10以下ランキングを見る →</b></a>
  </section>

  <section className="about"><h2>今後の拡張</h2><p>カード詳細ページに「未鑑定相場 → PSA10相場 → POP → 価格差 → 提出期待値」を追加予定。PSAで受付可能かどうかはタイトル・カードごとに公式情報を確認し、未確認のものを受付可能とは表示しません。</p></section>
  <section className="about"><h2>PSAとの提携を見据えたデータ基盤</h2><p>まず第三者として検証可能なPSA公式データを積み上げます。将来Affiliateや広告提携を行う場合も、提携前のデータと広告・送客表示を明確に分離します。</p></section>
  <p><a href="/"><b>← トップへ戻る</b></a></p>
  <footer>非公式ファンデータベース / PSAとの提携・スポンサー関係を示すものではありません。PSA、PSA10等の情報は確認時点のPSA公式データを参照しています。</footer>
 </main>
}