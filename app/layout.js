import "./globals.css";
import OfficialLinksBar from "./components/OfficialLinksBar";
export const metadata={
 metadataBase:new URL("https://naruto-card-db.vercel.app"),
 title:{default:"NARUTO旧カードDB",template:"%s | NARUTO旧カードDB"},
 description:"NARUTO旧トレーディングカードの収録情報・相場・希少性をカード番号から調べる非公式データベース",
 robots:{index:true,follow:true},
 openGraph:{type:"website",locale:"ja_JP",siteName:"NARUTO旧カードDB",title:"NARUTO旧カードDB",description:"カード番号・キャラクター名からNARUTO旧カードの収録情報・相場・希少性を検索"}
};
export default function RootLayout({children}){return <html lang="ja"><body><OfficialLinksBar />{children}</body></html>}