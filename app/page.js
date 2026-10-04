const cards=[
{no:"忍-204",name:"調査中",rank:"WATCH",note:"重点監視カード。DOT調査データ連携予定"},
{no:"忍-372",name:"調査中",rank:"WATCH",note:"価格・販売履歴・海外需要を重点確認"},
{no:"忍-357",name:"調査中",rank:"WATCH",note:"旧カード監視対象。確認済み情報から順次更新"}
];
export default function Home(){return <main>
<header><div className="brand">NARUTO OLD CARD DATABASE</div><div className="sub">旧カードの「何なのか・どこにある・いくらか」を追う</div></header>
<section className="hero"><span className="eyebrow">DATABASE / MARKET / ARCHIVE</span><h1>NARUTO旧カードを、<br/>番号から追える場所へ。</h1><p>収録シリーズ、レアリティ、販売済み相場、希少性、海外需要まで。確認済みの根拠を積み上げる専門データベースです。</p>
<form action="/search"><input name="q" placeholder="カード番号・カード名で検索　例：忍-204"/><button>検索</button></form></section>
<section><div className="sectionHead"><h2>重点監視カード</h2><span>EARLY WATCHLIST</span></div><div className="grid">{cards.map(c=><a className="card" href={"/card/"+encodeURIComponent(c.no)} key={c.no}><div className="rank">{c.rank}</div><div className="num">{c.no}</div><h3>{c.name}</h3><p>{c.note}</p><b>詳細を見る →</b></a>)}</div></section>
<section className="about"><h2>価格だけで終わらせない。</h2><p>「現在出品」「販売済み」「確認済み事実」「分析」「予測」を分離。後から答え合わせできる相場履歴を目指します。</p><div className="metrics"><div><b>01</b><span>カード検索</span></div><div><b>02</b><span>相場履歴</span></div><div><b>03</b><span>S/A/B/WATCH評価</span></div><div><b>04</b><span>海外需要</span></div></div></section>
<footer>非公式ファンデータベース / カード画像は権利確認済みの参照先を基本とします。</footer></main>}