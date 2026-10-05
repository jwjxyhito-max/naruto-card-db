"use client";
import {useMemo,useState} from "react";

const yen=n=>"¥"+Math.round(n||0).toLocaleString();
function scoreFromBreakEven(p){return p<30?"S":p<50?"A":p<70?"B":"WATCH";}

export default function PsaSimulator(){
 const [raw,setRaw]=useState(20);
 const [psa10,setPsa10]=useState(150);
 const [psa9,setPsa9]=useState(70);
 const [p10,setP10]=useState(50);
 const [p9,setP9]=useState(30);
 const [grading,setGrading]=useState(13150);
 const [fx,setFx]=useState(150);
 const [fee,setFee]=useState(10);
 const [shipping,setShipping]=useState(750);

 const x=useMemo(()=>{
  const prob10=Math.max(0,Math.min(100,p10))/100;
  const prob9=Math.max(0,Math.min(100-p10,p9))/100;
  const probLow=Math.max(0,1-prob10-prob9);
  const rawJpy=raw*fx;
  const total=rawJpy+grading;
  const net=v=>v*fx*(1-fee/100)-shipping;
  const n10=Math.max(0,net(psa10));
  const n9=Math.max(0,net(psa9));
  const low=rawJpy;
  const expected=n10*prob10+n9*prob9+low*probLow;
  const profit=expected-total;
  const breakEven=n10>0?total/n10*100:Infinity;
  return {prob10,prob9,probLow,rawJpy,total,n10,n9,expected,profit,breakEven,score:scoreFromBreakEven(breakEven)};
 },[raw,psa10,psa9,p10,p9,grading,fx,fee,shipping]);

 const field=(label,value,setter,suffix)=><label style={{display:"grid",gap:6}}><span>{label}</span><div style={{display:"flex",gap:6}}><input type="number" value={value} min="0" step="0.01" onChange={e=>setter(Number(e.target.value))}/>{suffix&&<span style={{alignSelf:"center"}}>{suffix}</span>}</div></label>;

 return <main>
  <header><div className="brand">NARUTO OLD CARD DATABASE</div><div className="sub">PSA GRADING SIMULATOR</div></header>
  <section className="hero"><span className="eyebrow">RAW → PSA 9 / PSA 10 → EXPECTED VALUE</span><h1>このカード、<br/>PSAに出すべき？</h1><p>購入価格とPSA9・10相場、取得確率、鑑定コストを入れると、期待利益と損益分岐を試算します。</p></section>

  <section>
   <div className="sectionHead"><h2>条件を入力</h2><span>CALCULATOR</span></div>
   <div className="grid">
    <div className="card">{field("未鑑定価格",raw,setRaw,"USD")}{field("PSA10売却価格",psa10,setPsa10,"USD")}{field("PSA9売却価格",psa9,setPsa9,"USD")}</div>
    <div className="card">{field("PSA10取得確率",p10,setP10,"%")}{field("PSA9取得確率",p9,setP9,"%")}<p><small>8以下確率は残りを自動計算：{(x.probLow*100).toFixed(1)}%</small></p></div>
    <div className="card">{field("PSA鑑定関連総費用",grading,setGrading,"円")}{field("為替 1USD",fx,setFx,"円")}{field("販売手数料",fee,setFee,"%")}{field("販売時送料",shipping,setShipping,"円")}</div>
   </div>
  </section>

  <section>
   <div className="sectionHead"><h2>判定結果</h2><span>EXPECTED VALUE</span></div>
   <div className="grid">
    <div className="card"><div className="rank">{x.score}</div><h3>提出期待値スコア</h3><p>損益分岐PSA10率 <b>{Number.isFinite(x.breakEven)?x.breakEven.toFixed(1)+"%":"計算不可"}</b></p></div>
    <div className="card"><h3>総原価</h3><p><b>{yen(x.total)}</b></p><small>未鑑定価格＋鑑定関連総費用</small></div>
    <div className="card"><h3>PSA10手取り</h3><p><b>{yen(x.n10)}</b></p><small>販売手数料・販売送料控除後</small></div>
    <div className="card"><h3>PSA9手取り</h3><p><b>{yen(x.n9)}</b></p><small>販売手数料・販売送料控除後</small></div>
    <div className="card"><h3>期待回収額</h3><p><b>{yen(x.expected)}</b></p><small>10・9・8以下の確率加重</small></div>
    <div className="card"><div className="rank">{x.profit>=0?"PLUS":"MINUS"}</div><h3>期待利益</h3><p><b>{x.profit>=0?"+":""}{yen(x.profit)}</b></p></div>
   </div>
  </section>

  <section className="about"><h2>計算方法</h2><p>PSA10・PSA9は入力した取得確率で確率加重し、8以下は未鑑定価格相当を回収できる簡易モデルです。実際のグレード分布、カード状態、関税・税金、保険、為替、販売価格、PSA料金等により結果は変わります。</p></section>
  <section className="about"><h2>スコア</h2><p>S：PSA10単独の損益分岐30%未満 / A：30〜50%未満 / B：50〜70%未満 / WATCH：70%以上。期待利益とは別指標として表示します。</p></section>
  <p><a href="/psa-ranking"><b>← PSAランキング</b></a>　<a href="/psa"><b>PSA実績DB</b></a>　<a href="/"><b>トップ</b></a></p>
  <footer>試算ツールであり利益・鑑定結果を保証するものではありません。PSAとの提携・スポンサー関係を示すものではありません。</footer>
 </main>
}