export const metadata={
 title:"NARUTOカード PSA鑑定・価値判断｜NARUTO旧カードDB",
 description:"NARUTOカードのPSA鑑定状況、PSA10の価値判断、2027年NARUTO CARD GAMEのPSA対応情報を追跡するページです。",
 alternates:{canonical:"/psa"}
};

const officialPsa="https://www.psacard.com/ja-JP/support/faq";
const newTcg="https://www.naruto-cardgame.com/jp/";

export default function PsaPage(){
 return <main>
  <header><div className="brand">NARUTO OLD CARD DATABASE</div><div className="sub">PSA GRADING WATCH</div></header>
  <section className="hero">
   <span className="eyebrow">PSA / VALUE / 2027 NEW TCG</span>
   <h1>NARUTOカードを、<br/>「PSAに出す価値」まで追う。</h1>
   <p>旧カードの鑑定状況と、2027年夏に世界同時発売予定の新しいNARUTO CARD GAMEのPSA対応を継続確認します。</p>
  </section>

  <section>
   <div className="sectionHead"><h2>現在のPSA状況</h2><span>STATUS</span></div>
   <div className="grid">
    <div className="card"><div className="rank">OLD</div><h3>NARUTO旧カード</h3><p>PSA Japanの主要受付タイトル一覧にはNARUTOは明記されていません。カードごとの受付可否はPSA公式のグレーディング可否検索で確認します。</p><a href={officialPsa} target="_blank" rel="noreferrer"><b>PSA公式で確認 →</b></a></div>
    <div className="card"><div className="rank">2027</div><h3>NARUTO CARD GAME</h3><p>2027年夏に世界同時発売予定。PSAのグレーディング対応は現時点で未確定のため、公式発表を確認後に更新します。</p><a href={newTcg} target="_blank" rel="noreferrer"><b>新TCG公式を見る →</b></a></div>
   </div>
  </section>

  <section>
   <div className="sectionHead"><h2>今後追加するPSA判断データ</h2><span>ROADMAP</span></div>
   <div className="grid">
    <div className="card"><h3>未鑑定相場</h3><p>販売済み価格を中心に、未鑑定カードの基準価格を追跡。</p></div>
    <div className="card"><h3>PSA10相場</h3><p>PSA10の確認価格・販売履歴を分けて記録。</p></div>
    <div className="card"><h3>PSA Population</h3><p>確認できるカードは鑑定枚数・PSA10枚数を記録。</p></div>
    <div className="card"><h3>提出期待値</h3><p>未鑑定価格とPSA10価格の差、鑑定費用、状態リスクから提出判断を補助。</p></div>
   </div>
  </section>

  <section className="about"><h2>PSA提出おすすめ度（準備中）</h2><p>将来は各カードを S / A / B / WATCH で表示します。ただしグレード取得を保証するものではなく、センタリング、角、表面、印刷状態など実物状態によって結果は変わります。</p></section>
  <section className="about"><h2>2027年に向けて先にデータを貯める。</h2><p>新TCG発売後にゼロから始めるのではなく、発売前からカード情報・初動相場・希少性・PSA公式の対応状況を蓄積。PSA対応が確認された時点で、カード詳細から鑑定判断までつながるデータベースへ拡張します。</p></section>

  <p><a href="/"><b>← トップへ戻る</b></a></p>
  <footer>非公式ファンデータベース。PSAとの提携・スポンサー関係を示すものではありません。受付可否・料金・サービス内容は必ずPSA公式情報をご確認ください。</footer>
 </main>
}