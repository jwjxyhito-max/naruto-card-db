import {cards} from "../../lib/cards";
import {sortCards} from "../../lib/cardSort";
export const metadata={title:"NARUTO忍カード一覧 | NARUTO OLD CARD DATABASE",description:"NARUTO旧カードの忍カードをカード番号順に探せる一覧。確認済みカードから段階的に追加しています。"};
const num=id=>Number(String(id).split("-")[1])||999999;
export default function Page(){
 const list=cards.filter(c=>/^忍-\d+$/.test(String(c.id))).sort((a,b)=>num(a.id)-num(b.id));
 const nums=new Set(list.map(c=>num(c.id)));
 const max=Math.max(...nums);
 const gaps=[];for(let i=1;i<=max;i++)if(!nums.has(i))gaps.push(i);
 return <main><a className="back" href="/">← TOP</a><section className="detail">
  <span className="eyebrow">NINJA CARDS / {list.length} VERIFIED RECORDS</span>
  <h1>忍カード一覧</h1>
  <p>「忍-」番号の確認済みカードを番号順に表示しています。未登録番号は欠番と断定せず、旧公式資料・現物資料で確認できたものから追加します。</p>
  <div className="detailGrid">
   <div><small>登録済み忍カード</small><p>{list.length}枚</p></div>
   <div><small>現在の最大確認番号</small><p>忍-{max}</p></div>
   <div><small>未登録番号</small><p>{gaps.length}件（照合中）</p></div>
  </div>
  <form className="sortBar"><label>並び替え<select name="sort" defaultValue="number"><option value="number">カード番号順</option><option value="series">シリーズ順</option><option value="rarity">レア度順</option></select></label><button type="submit">並び替え</button></form>
  <div className="miniLinks"><a href="/promo">プロモカード一覧を見る →</a><a href="/year/2002">2002年 →</a><a href="/year/2003">2003年 →</a><a href="/year/2005">2005年 →</a><a href="/year/2006">2006年 →</a></div>
  <div className="grid">{list.map(c=><a className="card" href={"/card/"+encodeURIComponent(c.id)} key={c.id}><div className="rank">{c.rank}</div><div className="num">{c.id}</div><h3>{c.name}</h3><p>{c.character} / {c.series}</p><b>{c.id}の詳細を見る →</b></a>)}</div>
 </section></main>
}