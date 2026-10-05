import {cards} from "../../../lib/cards";
import {notFound} from "next/navigation";

const supportedYears=["2002","2003","2005","2006"];

export function generateStaticParams(){
  return supportedYears.map(year=>({year}));
}

export async function generateMetadata({params}){
  const {year}=await params;
  if(!supportedYears.includes(year)) return {};
  const count=cards.filter(c=>String(c.release||"").startsWith(year)).length;
  return {
    title:`${year}年 NARUTO旧カード一覧・相場`,
    description:`${year}年発売のNARUTO旧カードをカード番号・キャラクター・収録シリーズから確認。現在${count}件を掲載しています。`,
    alternates:{canonical:`/year/${year}`}
  };
}

export default async function YearPage({params}){
  const {year}=await params;
  if(!supportedYears.includes(year)) notFound();

  const list=cards
    .filter(c=>String(c.release||"").startsWith(year))
    .sort((a,b)=>String(a.release).localeCompare(String(b.release))||String(a.id).localeCompare(String(b.id),"ja"));

  if(!list.length) notFound();

  return <main>
    <a className="back" href="/">← NARUTO旧カードDB</a>
    <section className="detail">
      <span className="eyebrow">YEAR ARCHIVE / {list.length} CARDS</span>
      <h1>{year}年のNARUTO旧カード</h1>
      <p>{year}年発売と確認できた旧NARUTOカードを、カード番号・キャラクター・収録シリーズごとにまとめています。発売年が未確認のカードは無理に分類していません。</p>

      <nav className="yearNav" aria-label="発売年別">
        {supportedYears.map(y=><a className={y===year?"active":""} href={"/year/"+y} key={y}>{y}年</a>)}
      </nav>

      <div className="grid">
        {list.map(c=><a className="card" href={"/card/"+encodeURIComponent(c.id)} key={c.id}>
          <div className="rank">{c.rank}</div>
          <div className="num">{c.id}</div>
          <h2>{c.name}</h2>
          <p>{c.release}<br/>{c.series}</p>
          <b>{c.id}の相場・収録情報を見る →</b>
        </a>)}
      </div>

      <div className="miniLinks">
        <a href="/cards">忍カード一覧を見る →</a>
        <a href="/promo">プロモカードを見る →</a>
        <a href="/analysis">最新相場分析を見る →</a>
      </div>
    </section>
  </main>;
}
