// Owner-confirmed Associates tag shared by this site's Amazon links.
export const AMAZON_ASSOCIATE_TAG="jakusha5092-22";
export const productsReviewedOn="2026-10-11";

export function amazonProductUrl(asin){
 if(!/^[A-Z0-9]{10}$/.test(asin))throw new Error("Invalid Amazon product ID");
 const url=new URL(`https://www.amazon.co.jp/dp/${asin}`);
 url.searchParams.set("tag",AMAZON_ASSOCIATE_TAG);
 return url.href;
}

export function amazonSearchUrl(keywords){
 const url=new URL("https://www.amazon.co.jp/s");
 url.searchParams.set("k",keywords);
 url.searchParams.set("tag",AMAZON_ASSOCIATE_TAG);
 return url.href;
}

export const amazonStorefrontUrl=`https://www.amazon.co.jp/shop/jakusha5092?tag=${AMAZON_ASSOCIATE_TAG}`;

export const recommendedCategories=[
 {id:"storage",label:"カード保護・収納",icon:"storage",description:"まずはサイズの合う保護用品から。手持ちの枚数や、見返す頻度に合わせて選びます。",guideHref:"/storage-guide",guideLabel:"価値別の保管方法を読む"},
 {id:"books",label:"漫画・映像",icon:"book",description:"カードに描かれたキャラクターや作品の背景を、原作・資料集・映画から楽しむ。"},
 {id:"goods",label:"グッズ",icon:"goods",description:"好きなキャラクターを飾って楽しむ。商品名・仕様・販売元を確かめて選びます。"}
];

// Add new selections here; category counts, navigation and structured data update together.
export const recommendedProducts=[
 {id:"clear-sleeves",category:"storage",name:"透明スリーブ",format:"基本のカード保護",kind:"search",url:amazonSearchUrl("トレカ スリーブ 透明 100枚"),reason:"カードの絵柄を見ながら、表面の擦れや指紋への対策を始めたい人に。枚数が多いコレクションの基本用品です。",check:"カードの実寸とスリーブの内寸を確認。無理に押し込まず、余裕のあるサイズを選びます。"},
 {id:"magnetic-loader",category:"storage",name:"マグネットローダー",format:"お気に入りを保護・展示",kind:"search",url:amazonSearchUrl("マグネットローダー 35pt"),reason:"大切な一枚を、収納しながら見返したい人に。カードを裸のまま扱う回数を減らす保管方法の候補です。",check:"35ptは検索の目安です。カードの厚さ・内寸・スリーブ対応を確認し、きついケースは避けます。"},
 {id:"storage-box",category:"storage",name:"カードストレージボックス",format:"増えたカードを整理",kind:"search",url:amazonSearchUrl("トレカ ストレージボックス 大容量"),reason:"カード番号や収録シリーズごとに整理したい人に。DBで調べた一枚を、手元のコレクションから探しやすくします。",check:"収納枚数はスリーブの厚さで変わります。ローダーやPSAスラブを入れる場合は対応サイズを確認。"},
 {id:"naruto-volume-1",category:"books",name:"NARUTO―ナルト― 1巻",format:"原作コミック・紙版",kind:"product",url:amazonProductUrl("4088728408"),reason:"初期カードと一緒に、物語の始まりを読み返したい人に。うずまきナルトの原点を手元に残せる一冊です。",check:"通常の紙版へのリンクです。初版・帯・カードなどの付属品は保証されません。",source:{label:"集英社の書誌情報",url:"https://www.s-manga.net/items/contents.html?isbn=4088728408"}},
 {id:"naruto-jin-no-sho",category:"books",name:"NARUTO［秘伝・陣の書］",format:"キャラクターオフィシャルデータBOOK",kind:"product",url:amazonProductUrl("4088802632"),reason:"カードに登場する忍や術について、作品の設定を深く知りたい人に。キャラクターを軸に集めるときの読み物として。",check:"中古品は書き込み・欠品を確認。初版限定の付属品は、商品説明に明記されたものを選びます。",source:{label:"集英社の書誌情報",url:"https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-880263-3"}},
 {id:"animation-chronicle-earth",category:"books",name:"NARUTO THE ANIMATION CHRONICLE 地",format:"TVアニメプレミアムブック",kind:"product",url:amazonProductUrl("4087925153"),reason:"原作だけでなく、TVアニメの資料もコレクションしたい人に。アニメを振り返る本として、カードと一緒に楽しめます。",check:"「天」と「地」は別の商品です。巻名と、新品・中古の状態を確認してください。"},
 {id:"the-last-blu-ray",category:"books",name:"THE LAST -NARUTO THE MOVIE-",format:"国内版Blu-ray・通常版",kind:"search",url:amazonSearchUrl("THE LAST NARUTO THE MOVIE Blu-ray ANSX-11371"),reason:"カード収集と一緒に劇場版を手元に残したい人に。映像作品を楽しむ入口として、国内版Blu-rayの候補を探せます。",check:"通常版の品番はANSX-11371。DVD・限定版・輸入版と区別し、再生環境も確認してください。",source:{label:"アニプレックスの商品情報",url:"https://www.aniplex.co.jp/naruto/movie/11.html"}},
 {id:"shfiguarts-naruto",category:"goods",name:"S.H.Figuarts うずまきナルト",format:"意外性No.1のドタバタ忍者・再販版",kind:"product",url:amazonProductUrl("B0G4TKFRTZ"),reason:"少年期のナルトを立体でも飾りたい人に。表情やポーズを変えて、カードと一緒に好きなキャラクターを楽しめます。",check:"メーカー対象年齢は15才以上。商品名・再販版の仕様・販売元を確認してください。",source:{label:"メーカーの商品情報",url:"https://tamashiiweb.com/item/14255/"}}
];
