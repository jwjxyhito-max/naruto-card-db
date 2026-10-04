const picks = [
  {
    rank: "1",
    id: "忍-288",
    name: "うずまきナルト",
    price: "¥4,000",
    median: "¥8,850",
    samples: "8件",
    discount: "約55%下",
    url: "https://jp.mercari.com/item/m49515606580",
    summary: "主人公ナルトの旧UR系。現行の同状態は次が6,000円、その次が7,999円で、4,000円だけが一段安い。",
    detail: "同番号・単品・「やや傷や汚れあり」のSOLDを抽出すると、3,200 / 6,350 / 6,999 / 7,700 / 10,000 / 10,700 / 15,555 / 27,200円。中央値は8,850円。2027年の値上がりを一切入れず、現在相場との位置だけを見ても下側にいる。"
  },
  {
    rank: "2",
    id: "忍-203",
    name: "うちはイタチ",
    price: "¥4,999",
    median: "¥7,800",
    samples: "12件",
    discount: "約36%下",
    url: "https://jp.mercari.com/item/m56088153394",
    summary: "出品説明に「折れなし・スレ傷あり」。海外でも日本版203番の実売を確認できる人気キャラ枠。",
    detail: "同状態SOLDは2,600〜13,500円まで幅があるが、12件中央値は7,800円。一般購入できる同状態の次点価格が大きく上なので、現行在庫でも4,999円は見やすい。"
  },
  {
    rank: "3",
    id: "忍-112",
    name: "砂瀑の我愛羅",
    price: "¥1,200",
    median: "約¥4,040",
    samples: "6件",
    discount: "約70%下",
    url: "https://jp.mercari.com/item/m74239661000",
    summary: "低予算枠の本命。目立った傷なし、写真15枚で状態を確認しやすく、絶対損失を抑えやすい。",
    detail: "ウエハース表記を除いた同状態SOLDは2,000 / 3,200 / 3,999 / 4,080 / 5,000 / 9,800円。中央値は約4,040円。海外期待を入れなくても国内価格差が大きい。"
  },
  {
    rank: "4",
    id: "忍-289",
    name: "うちはサスケ",
    price: "¥5,000",
    median: "¥6,650",
    samples: "8件",
    discount: "約25%下",
    url: "https://jp.mercari.com/item/m48746037038",
    summary: "国内の割安幅は上3枚より小さいが、NYCCの新作アニメ・新TCG発表と最も直接つながるサスケ枠。",
    detail: "同状態SOLDは2,500 / 3,000 / 4,200 / 6,100 / 7,200 / 8,600 / 10,000 / 11,211円。中央値6,650円。ニュース材料を理由に高値を追わず、5,000円個体だけを候補にする。"
  },
  {
    rank: "5",
    id: "忍-85",
    name: "うずまきナルト",
    price: "¥5,555",
    median: "¥8,000",
    samples: "9件",
    discount: "約31%下",
    url: "https://jp.mercari.com/item/m54437494760",
    summary: "2003年の初期ナルト。裏面下部の傷みはあるため鑑定狙いではなく、生カード長期保有向け。",
    detail: "同状態SOLDは2,800 / 4,000 / 5,000 / 7,777 / 8,000 / 9,000 / 9,000 / 11,000 / 18,000円。中央値8,000円。初期・主人公・URという説明力を評価。"
  }
];

export default function AnalysisPage() {
  return (
    <main className="analysisPage">
      <a className="back" href="/">← トップへ戻る</a>

      <section className="analysisHero">
        <span className="eyebrow">2026-10-04 / MARKET REPORT</span>
        <h1>2027年に向けて、<br/>今集めたい旧NARUTOカード5枚</h1>
        <p>
          現在のメルカリ出品、同番号・単品・同状態のSOLD、海外eBay実売、
          2027年の新「NARUTO CARD GAME」、完全新作アニメ、漫画・イベントまでまとめて見る。
          高額な出品価格だけでは判断せず、国内の実売を軸にした定点分析です。
        </p>
      </section>

      <section className="analysisIntro">
        <div><b>集計ルール</b><span>同番号 / 単品 / 同状態を優先</span></div>
        <div><b>海外</b><span>ASKとSOLDを分離</span></div>
        <div><b>狙い</b><span>新TCGから旧カードへの波及</span></div>
      </section>

      <section>
        <div className="sectionHead"><h2>現在の5枚</h2><span>MERCARI CHECK</span></div>
        <div className="analysisCards">
          {picks.map((p) => (
            <article className="analysisCard" key={p.id}>
              <div className="analysisRank">#{p.rank}</div>
              <div className="num">{p.id}</div>
              <h2>{p.name}</h2>
              <div className="analysisMetrics">
                <div><small>現在価格</small><b>{p.price}</b></div>
                <div><small>同状態SOLD中央値</small><b>{p.median}</b></div>
                <div><small>サンプル</small><b>{p.samples}</b></div>
                <div><small>中央値比</small><b>{p.discount}</b></div>
              </div>
              <p>{p.summary}</p>
              <p>{p.detail}</p>
              <a className="mercariBtn" href={p.url} target="_blank" rel="noreferrer">メルカリの現行出品を見る →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="analysisSection">
        <div className="sectionHead"><h2>海外需要（eBay）の見方</h2><span>SOLD &gt; ASK</span></div>
        <p>
          eBayは「出品価格が高い＝その値段で売れている」ではありません。
          今回はSOLDを優先します。日本版の<strong>うちはイタチ 忍-203</strong>は
          2026年6月8日にUS$32で実売を確認。一方で現行ASKにはそれを大きく上回る価格もあります。
          海外需要は存在するが、ASKをそのまま相場にしないのが基本です。
        </p>
        <p>
          旧日本版プロモの強い参考例では、<strong>PR忍-1 うずまきナルト</strong>が
          2026年7月17日にUS$500でSOLD。これは別カードなので他番号へ価格を横展開はしませんが、
          日本版旧BANDAIプロモに高額実需が存在する証拠として見ています。
        </p>
        <div className="sourceLinks">
          <a href="https://www.ebay.com/itm/205212568142" target="_blank" rel="noreferrer">eBay：忍-203 日本版 SOLD</a>
          <a href="https://www.ebay.com/itm/318505270991" target="_blank" rel="noreferrer">eBay：PR忍-1 US$500 SOLD</a>
        </div>
      </section>

      <section className="analysisSection">
        <div className="sectionHead"><h2>2027年までの追い風</h2><span>OFFICIAL EVENTS</span></div>
        <div className="timeline">
          <div><b>2026.10</b><p>New York Comic Con「NARUTO: What's Next?」で、完全新作アニメの世界初公開情報とNARUTO CARD GAME最新情報を発表予定。</p></div>
          <div><b>2026.10〜11</b><p>NYCC、PAX Australia、SPIEL Essen、Paris Games Week、Lucca Comics & Gamesなど世界イベントを巡回。</p></div>
          <div><b>2026.10.02</b><p>『BORUTO -TWO BLUE VORTEX-』9巻発売。Vジャンプ連載継続。10巻は2027年3月上旬予定。</p></div>
          <div><b>2027.02〜06</b><p>京都・南座でNinja Show「NARUTO」。ナルト、サスケ、サクラ、カカシが主要キャスト。</p></div>
          <div><b>2027夏</b><p>新「NARUTO CARD GAME」世界同時発売予定。</p></div>
        </div>
        <div className="sourceLinks">
          <a href="https://naruto-official.com/news/01_2661" target="_blank" rel="noreferrer">公式：NARUTO CARD GAMEロードマップ</a>
          <a href="https://naruto-official.com/news/01_2695" target="_blank" rel="noreferrer">公式：NYCC完全新作アニメ情報</a>
          <a href="https://naruto-official.com/news/01_2688" target="_blank" rel="noreferrer">公式：BORUTO 9巻</a>
          <a href="https://naruto-official.com/news/01_2686" target="_blank" rel="noreferrer">公式：Ninja Show NARUTO</a>
        </div>
      </section>

      <section className="analysisSection">
        <div className="sectionHead"><h2>今の買い方</h2><span>POSITION SIZING</span></div>
        <p>
          1万円前後なら、まず<strong>忍-288 ナルト 4,000円＋忍-203 イタチ 4,999円＝8,999円</strong>を本命。
          低資金で分散するなら、我愛羅1,200円を追加候補にします。
          サスケは10月の公式発表と近い一方、国内の割安幅は上位3枚より小さいため、ニュースだけで高値を追わない方針です。
        </p>
        <p className="analysisNote">
          ※価格は確認時点。状態差・版違い・送料・販売手数料で結果は変わります。
          新TCGと旧BANDAIカードに互換性があるという公式発表は確認されていません。
          想定しているのは、新TCG・アニメ・世界イベントで検索人口が増え、旧カードへコレクター需要が波及するシナリオです。
        </p>
      </section>

      <footer>非公式ファンデータベース / 分析は確認できた公開情報と市場データをもとに随時更新します。</footer>
    </main>
  );
}
