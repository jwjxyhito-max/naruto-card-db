import {cards} from "../lib/cards";

const hot=[
 {id:"PR忍-8",name:"うずまきナルト",price:"¥3,200",judge:"注目",note:"現在出品を確認。状態差を見ながらSOLD比較を継続。"},
 {id:"忍-203",name:"うちはイタチ",price:"¥4,300",judge:"注目",note:"同番号に価格差が大きい。状態と実売の照合を優先。"},
 {id:"PR忍-6",name:"二代目火影",price:"¥2,000",judge:"監視",note:"プロモ系の低価格個体として継続監視。"},
 {id:"PR作-2R",name:"伝説の三忍",price:"¥4,500",judge:"監視",note:"箔・プロモ仕様を分けて相場を追跡。"},
 {id:"PR忍-12",name:"ナルト＆サスケ",price:"¥6,777",judge:"監視",note:"人気キャラ組み合わせ。SOLD蓄積後に判定を更新。"}
];

export default function Home(){
 const watch=cards.filter(c=>["A","B","WATCH"].includes(c.rank));
 return <main>
  <header><div className="brand">NARUTO OLD CARD DATABASE</div><div className="sub">旧カードの「何なのか・どこにある・いくらか」を追う</div></header>
  <section className="hero"><span className="eyebrow">DATABASE / MARKET / ARCHIVE</span><h1>NARUTO旧カードを、<br/>番号から追える場所へ。</h1><p>収録シリーズ、販売済み相場、希少性まで。確認済みの根拠を積み上げる専門データベースです。</p><form action="/search"><input name="q" placeholder="カード番号・カード名で検索　例：忍-204"/><button>検索</button></form></section>
  <nav className="dbnav"><a href="/cards">全カード一覧</a><a href="/ranking">注目カード</a><a href="/search">カード検索</a></nav>
  <section><div className="sectionHead"><h2>今の注目5枚</h2><span>2026-10-04 MERCARI CHECK</span></div><div className="grid">{hot.map(c=><div className="card" key={c.id}><div className="rank">{c.judge}</div><div className="num">{c.id}</div><h3>{c.name}</h3><p>現在確認価格 <b>{c.price}</b></p><p>{c.note}</p><a href={"/search?q="+encodeURIComponent(c.id)}><b>同番号をDBで見る →</b></a></div>)}</div><p style={{fontSize:12,opacity:.7}}>※表示価格は確認時点の出品価格で、成約相場・価値を保証するものではありません。SOLD、状態、仕様を分けて判定を更新します。</p></section>
  <section><div className="sectionHead"><h2>重点監視カード</h2><span>{cards.length} RECORDS / DOT DATA</span></div><div className="grid">{watch.map(c=><a className="card" href={"/card/"+encodeURIComponent(c.id)} key={c.id}><div className="rank">{c.rank}</div><div className="num">{c.id}</div><h3>{c.name}</h3><p>{c.market}</p><b>詳細を見る →</b></a>)}</div></section>
  <section className="about"><h2>確認できたものから載せる。</h2><p>現在出品・販売済み・確認済み事実・分析・予測を混ぜず、未確認は「不明」と表示します。</p></section>
  <footer>非公式ファンデータベース / 画像は外部参照を基本とします。</footer>
 </main>
}