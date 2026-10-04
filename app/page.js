import {cards} from "../lib/cards";

const hot=[
 {id:"忍-288",name:"うずまきナルト",price:"¥4,000",judge:"本命",note:"同状態SOLD中央値 約¥8,850。現行安値帯。"},
 {id:"忍-203",name:"うちはイタチ",price:"¥4,999",judge:"本命",note:"折れなし記載。同状態SOLD中央値 約¥7,800。"},
 {id:"忍-112",name:"砂瀑の我愛羅",price:"¥1,200",judge:"注目",note:"目立った傷なし。低資金で持ちやすい。"},
 {id:"忍-289",name:"うちはサスケ",price:"¥5,000",judge:"注目",note:"NYCC新アニメ・新TCG発表と近いサスケ枠。"},
 {id:"忍-85",name:"うずまきナルト",price:"¥5,555",judge:"注目",note:"2003年初期ナルト。生カード長期保有向け。"}
];

const guides=[
 {href:"/cards",title:"NARUTO旧カード一覧",text:"カード番号から収録情報・相場・希少性を確認"},
 {href:"/ranking",title:"注目・高額カード",text:"市場で注目したい旧カードを優先度別に確認"},
 {href:"/analysis",title:"旧カード相場分析",text:"新作・新TCGの動きと旧カード市場を分析"},
 {href:"/search",title:"カード番号・名前検索",text:"忍-204などの番号やキャラクター名から探す"}
];

export const metadata={
 title:"NARUTO旧カードDB｜カード番号・相場・収録情報を検索",
 description:"NARUTO旧トレーディングカードをカード番号・キャラクター名から検索。収録シリーズ、販売済み相場、希少性、注目カードを確認できる非公式データベースです。",
 alternates:{canonical:"/"}
};

export default function Home(){
 const watch=cards.filter(c=>["A","B","WATCH"].includes(c.rank));
 return <main>
  <header><div className="brand">NARUTO OLD CARD DATABASE</div><div className="sub">旧カードの「何なのか・どこにある・いくらか」を追う</div></header>
  <section className="hero">
    <span className="eyebrow">DATABASE / MARKET / ARCHIVE</span>
    <h1>NARUTO旧カードを、<br/>番号から追える場所へ。</h1>
    <p>収録シリーズ、販売済み相場、希少性まで。確認済みの根拠を積み上げる専門データベースです。</p>
    <form action="/search"><input name="q" aria-label="カード検索" placeholder="カード番号・カード名で検索　例：忍-204"/><button>検索</button></form>
  </section>

  <nav className="dbnav" aria-label="主要メニュー"><a href="/cards">全カード一覧</a><a href="/ranking">注目カード</a><a href="/analysis">相場分析</a><a href="/search">カード検索</a></nav>

  <section>
   <div className="sectionHead"><h2>目的から探す</h2><span>SEO GUIDE</span></div>
   <div className="grid">{guides.map(g=><a className="card" href={g.href} key={g.href}><h3>{g.title}</h3><p>{g.text}</p><b>見る →</b></a>)}</div>
  </section>

  <section>
   <div className="sectionHead"><h2>今の注目5枚</h2><span>2026-10-04 MERCARI CHECK</span></div>
   <div className="grid">{hot.map(c=><div className="card" key={c.id}><div className="rank">{c.judge}</div><div className="num">{c.id}</div><h3>{c.name}</h3><p>現在確認価格 <b>{c.price}</b></p><p>{c.note}</p><a href={"/search?q="+encodeURIComponent(c.id)}><b>同番号をDBで見る →</b></a></div>)}</div>
   <p style={{fontSize:12,opacity:.7}}>※表示価格は確認時点の出品価格で、成約相場・価値を保証するものではありません。SOLD、状態、仕様を分けて判定を更新します。</p>
  </section>

  <section>
   <div className="sectionHead"><h2>重点監視カード</h2><span>{cards.length} RECORDS / DOT DATA</span></div>
   <div className="grid">{watch.map(c=><a className="card" href={"/card/"+encodeURIComponent(c.id)} key={c.id}><div className="rank">{c.rank}</div><div className="num">{c.id}</div><h3>{c.name}</h3><p>{c.market}</p><b>詳細を見る →</b></a>)}</div>
  </section>

  <section className="about"><h2>NARUTO旧カードの調べ方</h2><p>まずカード番号またはカード名で検索し、個別ページで収録情報と市場データを確認してください。関連カード・ランキング・分析ページを行き来できる構造にし、確認できた事実と予測を分けて掲載します。</p></section>
  <section className="about"><h2>確認できたものから載せる。</h2><p>現在出品・販売済み・確認済み事実・分析・予測を混ぜず、未確認は「不明」と表示します。</p></section>
  <footer>非公式ファンデータベース / 画像は外部参照を基本とします。</footer>
 </main>
}