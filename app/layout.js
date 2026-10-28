import Script from "next/script";
import "./globals.css";
import OfficialLinksBar from "./components/OfficialLinksBar";
import SiteNav from "./components/SiteNav";

const siteUrl="https://naruto-card-db.vercel.app";
export const viewport={width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#0b0c0f"};

export const metadata={
 metadataBase:new URL(siteUrl),
 title:{default:"NARUTO旧カードDB｜カード番号・相場・PSA・収録情報",template:"%s | NARUTO旧カードDB"},
 description:"NARUTO旧トレーディングカードをカード番号から検索。収録シリーズ、発売時期、SOLD相場、希少性、PSA鑑定候補、関連カードを整理する非公式データベース。",
 alternates:{canonical:"/"},
 robots:{index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}},
 openGraph:{
  type:"website",
  locale:"ja_JP",
  url:siteUrl,
  siteName:"NARUTO旧カードDB",
  title:"NARUTO旧カードDB｜カード番号・相場・PSA・収録情報",
  description:"NARUTO旧カードの収録情報・SOLD相場・希少性・PSA鑑定候補をカード番号から調べる非公式データベース",
  images:[{url:"https://raw.githubusercontent.com/jwjxyhito-max/naruto-card-db/main/8340944f-47b4-41ce-8706-5d4d41d6f411.png",width:1536,height:768,alt:"NARUTO CARD DB"}]
 },
 twitter:{
  card:"summary_large_image",
  title:"NARUTO旧カードDB｜カード番号・相場・PSA・収録情報",
  description:"NARUTO旧カードの収録情報・SOLD相場・希少性・PSA鑑定候補をカード番号から検索",
  images:["https://raw.githubusercontent.com/jwjxyhito-max/naruto-card-db/main/8340944f-47b4-41ce-8706-5d4d41d6f411.png"]
 },
 applicationName:"NARUTO旧カードDB",
 category:"collectibles"
};

export default function RootLayout({children}){
 const websiteJsonLd={
  "@context":"https://schema.org",
  "@type":"WebSite",
  name:"NARUTO旧カードDB",
  url:siteUrl,
  description:"NARUTO旧トレーディングカードの収録情報・相場・希少性を整理する非公式データベース",
  inLanguage:"ja"
 };
 return <html lang="ja"><body>
  <Script id="ga4" strategy="afterInteractive">{`
    if (['naruto-card-db.vercel.app','naruto-card-db-jwjxyhito-2386.vercel.app'].includes(location.hostname)) {
    var script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id=G-9F6Z3TXQ7G';document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9F6Z3TXQ7G');
    }
  `}</Script>
  <Script id="naruto-analytics-click-events" strategy="afterInteractive">{`
    (function() {
      function send(name, fields) {
        if (typeof window.gtag === 'function') window.gtag('event', name, fields);
      }
      document.addEventListener('click', function(event) {
        var node = event.target;
        var anchor = node && node.closest ? node.closest('a[href]') : null;
        if (!anchor) return;
        var url;
        try { url = new URL(anchor.getAttribute('href'), location.href); } catch (e) { return; }
        if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
        if (url.origin !== location.origin) {
          send('external_link_click', { destination_host: url.hostname, source_path: location.pathname });
          if (url.hostname === 'www.amazon.co.jp' || url.hostname === 'amazon.co.jp' || url.hostname === 'link.amazon' || url.hostname === 'amzn.to') {
            send(anchor.dataset.amazonLink === 'store' ? 'amazon_store_click' : 'amazon_product_click', { product_id: anchor.dataset.productId || 'existing-link', product_category: anchor.dataset.productCategory || 'other', placement: anchor.dataset.shoppingPlacement || 'existing', source_path: location.pathname });
          }
        } else if (url.pathname.indexOf('/card/') === 0) {
          send('card_detail_click', { card_number: decodeURIComponent(url.pathname.split('/')[2] || ''), source_path: location.pathname });
        } else if (url.pathname === '/analysis') {
          send('market_analysis_click', { source_path: location.pathname });
        } else if (url.pathname === '/recommended') {
          send('shopping_guide_click', { placement: anchor.dataset.shoppingPlacement || 'navigation', source_path: location.pathname });
        }
      }, true);
      document.addEventListener('submit', function(event) {
        var form = event.target;
        if (!form || !form.getAttribute) return;
        var action = form.getAttribute('action') || '';
        if (action === '/search') send('card_search_submit', { source_path: location.pathname });
      }, true);
    })();
  `}</Script>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteJsonLd)}} />
  <a className="skipLink" href="#main-content">本文へ移動</a>
  <header className="siteHeader">
   <div className="siteHeaderInner">
    <a className="siteBrand" href="/" aria-label="NARUTO CARD DB トップ"><span className="brandMark" aria-hidden="true">N</span><span>NARUTO <strong>CARD DB</strong><small>旧カードの収録情報・相場を調べる</small></span></a>
    <a className="headerSearch" href="/search" aria-label="カードを検索">検索 <span aria-hidden="true">⌕</span></a>
    <SiteNav />
   </div>
   <OfficialLinksBar />
  </header>
  <div id="main-content" tabIndex={-1}>{children}</div>
  <footer className="siteFooter"><div>
   <a className="footerBrand" href="/">NARUTO CARD DB</a>
   <nav aria-label="補助メニュー"><a href="/shippuden">疾風伝</a><a href="/ranking">注目カード</a><a href="/psa">PSA鑑定</a><a href="/psa-ranking">PSA候補</a><a href="/psa-simulator">PSA計算</a><a href="/storage-guide">保管ガイド</a><a href="/recommended" data-shopping-placement="footer">おすすめ商品</a><a href="/search">詳細検索</a></nav>
   <p>非公式ファンデータベース。現在出品・SOLD・分析・予測を分けて掲載しています。</p>
   <p className="affiliateNote">Amazonのアソシエイトとして、NARUTO CARD DATABASEは適格販売により収入を得ています。</p>
  </div></footer>
 </body></html>
}
