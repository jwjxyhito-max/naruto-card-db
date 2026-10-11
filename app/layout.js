import Script from "next/script";
import "./globals.css";
import OfficialLinksBar from "./components/OfficialLinksBar";

const siteUrl="https://naruto-card-db.vercel.app";

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
  <Script src="https://www.googletagmanager.com/gtag/js?id=G-9F6Z3TXQ7G" strategy="afterInteractive" />
  <Script id="ga4" strategy="afterInteractive">{`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9F6Z3TXQ7G');
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
        } else if (url.pathname.indexOf('/card/') === 0) {
          send('card_detail_click', { card_number: decodeURIComponent(url.pathname.split('/')[2] || ''), source_path: location.pathname });
        } else if (url.pathname === '/analysis') {
          send('market_analysis_click', { source_path: location.pathname });
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
  <OfficialLinksBar />{children}
 </body></html>
}