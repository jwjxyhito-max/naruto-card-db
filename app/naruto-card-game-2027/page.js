import {PageIntro} from "../components/DatabaseUI";
import {
 naruto2027Highlights,
 naruto2027Intro,
 naruto2027Links,
 naruto2027Meta,
 naruto2027Products,
 naruto2027PurchasePendingLabel,
 naruto2027PurchaseUrl,
 naruto2027Sections,
 naruto2027Source
} from "../../lib/naruto2027";

const title=naruto2027Meta.title;
const description=naruto2027Meta.description;

export const metadata={
 title,
 description,
 alternates:{canonical:naruto2027Meta.path},
 openGraph:{title,description,url:naruto2027Meta.path},
 twitter:{title,description}
};

export default function NarutoCardGame2027Page(){
 const pageUrl=`https://naruto-card-db.vercel.app${naruto2027Meta.path}`;
 const jsonLd={
  "@context":"https://schema.org",
  "@type":"WebPage",
  name:title,
  description,
  inLanguage:"ja",
  url:pageUrl,
  citation:naruto2027Source.url
 };
 return <main>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,"\\u003c")}}/>
  <PageIntro eyebrow={naruto2027Intro.eyebrow} title={naruto2027Intro.heading} description={naruto2027Intro.lead} items={[{label:"NARUTOカードゲーム 2027"}]}/>
  <div className="analysisFacts">{naruto2027Highlights.map(item=><div key={item.label}><small>{item.label}</small><b>{item.value}</b></div>)}</div>
  {naruto2027Sections.map(section=><section id={section.id} key={section.id}>
   <h2>{section.heading}</h2>
   {section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
  </section>)}
  <p className="affiliateNote">【PR】本ページには広告・アフィリエイトリンクが含まれます（Amazonアソシエイト）。</p>
  <section id="purchase" aria-labelledby="purchase-heading">
   <h2 id="purchase-heading">商品ページ</h2>
   <ul>{naruto2027Products.map(product=>{
    const href=naruto2027PurchaseUrl(product);
    return <li key={product.id}><b>{product.name}</b> — {href?<a href={href} target="_blank" rel="sponsored nofollow noreferrer">Amazonの商品ページを見る ↗</a>:naruto2027PurchasePendingLabel}</li>;
   })}</ul>
  </section>
  <div className="sourceLinks">{naruto2027Links.map(link=><a href={link.url} target="_blank" rel="noopener noreferrer" key={link.url}>{link.label} ↗</a>)}</div>
  <p className="mutedNote">出典は{naruto2027Source.label}の{naruto2027Source.publishedOn.replaceAll("-","/")}付記事です。旧カードの相場とは別の公式情報です。それ以降の案内は<a href="/news">最新ニュース</a>で確認できます。</p>
 </main>;
}
