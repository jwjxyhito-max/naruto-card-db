const BUYBACK_LINKS=[
 {name:"古本市場（ふるいち）",url:"https://px.a8.net/svt/ejp?a8mat=4BEOXV+7YDKAQ+5W1M+BWVTE",pixel:"https://www18.a8.net/0.gif?a8mat=4BEOXV+7YDKAQ+5W1M+BWVTE"},
 {name:"遊々亭",url:"https://px.a8.net/svt/ejp?a8mat=4BEQI6+86475U+49ZW+5YJRM",pixel:"https://www16.a8.net/0.gif?a8mat=4BEQI6+86475U+49ZW+5YJRM"}
];

export function BuybackLinks(){
 return <div className="mercariSearch buybackLinks">
  <span className="eyebrow">手放す前に、買取価格もチェック</span>
  {BUYBACK_LINKS.map(x=><a key={x.name} className="secondaryButton" href={x.url} target="_blank" rel="nofollow sponsored noopener">{x.name}で買取価格を見る<span className="srOnly">（新しいタブ）</span><img src={x.pixel} width="1" height="1" alt=""/></a>)}
  <small className="affiliateNote">【PR・広告】買取リンクにはアフィリエイトが含まれます。</small>
 </div>;
}
