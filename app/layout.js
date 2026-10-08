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
  description:"NARUTO旧カードの収録情報・SOLD相場・希少性・PSA鑑定候補をカード番号から調べる非公式データベース"
 },
 twitter:{
  card:"summary_large_image",
  title:"NARUTO旧カードDB｜カード番号・相場・PSA・収録情報",
  description:"NARUTO旧カードの収録情報・SOLD相場・希少性・PSA鑑定候補をカード番号から検索"
 },
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
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteJsonLd)}} />
  <OfficialLinksBar />{children}
 </body></html>
}