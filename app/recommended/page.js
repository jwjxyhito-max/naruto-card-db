import {recommendedCategories,recommendedProducts,amazonStorefrontUrl,productsReviewedOn} from "../../lib/recommendedProducts";
import {PageIntro} from "../components/DatabaseUI";
import {ShoppingIcon,RecommendedProduct} from "../components/ShoppingUI";

const title="NARUTO関連商品・保管用品のおすすめ";
const description="NARUTOカードを守るスリーブ・ローダー・収納用品と、原作漫画・資料集・Blu-ray・グッズを目的別に紹介。選ぶ理由と確認ポイントから、Amazonで商品を探せます。";
export const metadata={title,description,alternates:{canonical:"/recommended"},openGraph:{title,description,url:"/recommended"},twitter:{title,description}};

export default function Recommended(){
 const schema={"@context":"https://schema.org","@type":"ItemList",name:title,numberOfItems:recommendedProducts.length,itemListElement:recommendedProducts.map((product,index)=>({"@type":"ListItem",position:index+1,name:product.name,url:`https://naruto-card-db.vercel.app/recommended#${product.id}`}))};
 return <main className="recommendedPage">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
  <PageIntro eyebrow="COLLECT / PROTECT / ENJOY" title={<>集めた一枚を守る。<br/><em>作品も、もっと楽しむ。</em></>} description="NARUTOの関連商品とカード保管用品を、目的別に選びました。気になるものから、選ぶ理由と確認ポイントを見てみてください。" items={[{label:"おすすめ商品"}]}/>
  <div className="shoppingDisclosure"><span>PR / Amazonアソシエイト</span><p>当サイトはAmazonアソシエイトとして、適格販売により収入を得ています。価格・在庫・販売元はリンク先でご確認ください。</p></div>
  <nav className="shoppingCategories" aria-label="おすすめの目的を選ぶ">{recommendedCategories.map(category=><a href={`#${category.id}`} key={category.id}><ShoppingIcon kind={category.icon}/><span><b>{category.label}</b><small>{recommendedProducts.filter(product=>product.category===category.id).length}件</small></span><span aria-hidden="true">↓</span></a>)}</nav>
  <div className="shoppingSelectionNote"><p>おすすめ {recommendedProducts.length}件</p><p>商品選定：<time dateTime={productsReviewedOn}>{productsReviewedOn.replaceAll("-","/")}</time></p></div>
  {recommendedCategories.map((category,index)=><section className="shoppingSection" id={category.id} key={category.id}>
   <div className="shoppingSectionHead"><div><span className="eyebrow">0{index+1} / {category.id.toUpperCase()}</span><h2>{category.label}</h2><p>{category.description}</p></div>{category.guideHref&&<a className="textLink" href={category.guideHref}>{category.guideLabel} →</a>}</div>
   <div className="recommendedGrid">{recommendedProducts.filter(product=>product.category===category.id).map(product=><RecommendedProduct product={product} icon={category.icon} key={product.id}/>)}</div>
   <a className="textLink" href="#main-content">目的から選び直す ↑</a>
  </section>)}
  <aside className="shoppingStore"><ShoppingIcon/><div><h2>運営者のAmazonストア</h2><p>漫画・トレカ用品など、ほかのおすすめもまとめて確認できます。</p></div><a href={amazonStorefrontUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" data-amazon-link="store" data-shopping-placement="recommendations">Amazonストアを見る ↗</a></aside>
  <nav className="shoppingReturn" aria-label="カード調査に戻る"><a href="/search">カード番号・名前から調べる →</a><a href="/analysis">SOLD・相場分析を見る →</a></nav>
 </main>;
}
