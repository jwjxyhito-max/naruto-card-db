export function ShoppingIcon({kind="bag"}){
 const shapes={
  bag:<><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></>,
  storage:<><rect x="7" y="3" width="13" height="17" rx="2"/><path d="M4 6v13a3 3 0 0 0 3 3M11 8h5M11 12h5M11 16h3"/></>,
  book:<><path d="M3 4h6a4 4 0 0 1 3 2 4 4 0 0 1 3-2h6v16h-6a4 4 0 0 0-3 1 4 4 0 0 0-3-1H3V4Z"/><path d="M12 6v15"/></>,
  goods:<><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></>
 };
 return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[kind]||shapes.bag}</svg>;
}

export function ShoppingCallout(){
 return <a className="homeShoppingCta" href="/recommended" data-shopping-placement="home-hero">
  <span className="shoppingCtaIcon"><ShoppingIcon/></span>
  <span><b>NARUTO関連商品・保管用品を見る</b><small>カード保護・収納 ／ 漫画・映像 ／ グッズ</small></span>
  <span className="shoppingCtaArrow" aria-hidden="true">→</span>
 </a>;
}

export function RecommendedProduct({product,icon}){
 return <article className="recommendedCard" id={product.id}>
  <header className="recommendedCardHead"><span className="recommendedIcon"><ShoppingIcon kind={icon}/></span><div><span className="recommendedFormat">{product.format}</span><h3>{product.name}</h3></div></header>
  <p className="recommendedReason">{product.reason}</p>
  <div className="recommendedCheck"><b>選ぶ前に</b><p>{product.check}</p></div>
  <div className="recommendedActions">
   <a className="recommendedAmazon" href={product.url} target="_blank" rel="sponsored nofollow noopener noreferrer" data-amazon-link="product" data-product-id={product.id} data-product-category={product.category} data-shopping-placement="recommendations">{product.kind==="search"?"Amazonで候補を比較":"Amazonで商品を見る"}<span aria-hidden="true"> ↗</span><span className="srOnly">（{product.name}・新しいタブ）</span></a>
   {product.source&&<a className="recommendedSource" href={product.source.url} target="_blank" rel="noopener noreferrer">{product.source.label}<span aria-hidden="true"> ↗</span></a>}
  </div>
 </article>;
}
