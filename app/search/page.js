import {cards} from "../../lib/cards";\nimport {sortCards} from "../../lib/cardSort";

const options=(key)=>[...new Set(cards.map(c=>c[key]).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),"ja"));

export const metadata={
 title:"カード検索｜NARUTO旧カードDB",
 description:"NARUTO旧カードをフリーワード・シリーズ・キャラクター・ランクから絞り込み検索できます。"
};

export default async function Search({searchParams}){
 const p=await searchParams;
 const q=(p.q||"").trim().toLowerCase();
 const series=p.series||"";
 const character=p.character||"";
 const rank=p.rank||"";
 const promo=p.promo||"";\n const sort=p.sort||"number";
 const found=sortCards(cards.filter(c=>{
  const text=[c.id,c.name,c.character,c.series].join(" ").toLowerCase();
  const isPromo=/^PR|プロモ/i.test(c.id)||/プロモ/i.test(c.series||"");
  return (!q||text.includes(q))
   &&(!series||c.series===series)
   &&(!character||c.character===character)
   &&(!rank||c.rank===rank)
   &&(!promo||(promo==="promo"?isPromo:!isPromo));
 });

 return <main>
  <a className="back" href="/">← TOP</a>
  <section className="detail">
   <span className="eyebrow">CARD SEARCH / {found.length} RESULTS</span>
   <h1>カード検索</h1>
   <p>カード番号・名前だけでなく、シリーズやキャラクターなど条件を組み合わせて探せます。</p>

   <form className="advancedSearch" action="/search">
    <label>フリーワード<input name="q" defaultValue={p.q||""} placeholder="例：忍-204 / ナルト"/></label>
    <div className="searchFilters">
     <label>シリーズ<select name="series" defaultValue={series}><option value="">すべて</option>{options("series").map(v=><option key={v}>{v}</option>)}</select></label>
     <label>キャラクター<select name="character" defaultValue={character}><option value="">すべて</option>{options("character").map(v=><option key={v}>{v}</option>)}</select></label>
     <label>注目ランク<select name="rank" defaultValue={rank}><option value="">すべて</option>{options("rank").map(v=><option key={v}>{v}</option>)}</select></label>
     <label>区分<select name="promo" defaultValue={promo}><option value="">すべて</option><option value="promo">プロモのみ</option><option value="normal">通常カード</option></select></label>
    </div>
    <div className="searchActions"><button type="submit">この条件で検索する</button><a href="/search">条件を解除</a></div>
   </form>

   <div className="searchResultHead"><b>{found.length}件</b><span>登録済みカードから検索</span></div>
   <div className="grid">{found.map(c=><a className="card" href={"/card/"+encodeURIComponent(c.id)} key={c.id}>
    <div className="rank">{c.rank}</div><div className="num">{c.id}</div><h3>{c.name}</h3>
    <p>{c.series}</p>{c.character&&<p>{c.character}</p>}<b>詳細を見る →</b>
   </a>)}</div>
   {found.length===0&&<p>該当カードはまだ登録されていません。条件を減らして再検索してください。</p>}
  </section>
 </main>;
}