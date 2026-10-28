import {amazonProductUrl} from "./recommendedProducts";

// Facts below are limited to the Japanese official article dated 2026-10-11.
// Product codes, prices, pack counts, and card lists are not in that article.
export const naruto2027Source={
 label:"NARUTO OFFICIAL SITE",
 url:"https://www.naruto-official.com/news/01_2700",
 publishedOn:"2026-10-11",
 articleTitle:"【「ニューヨーク・コミコン2026」発表情報】『NARUTOカードゲーム』2027年6月に全世界同時発売決定！体験会や大型キャンペーンも発表！"
};

export const naruto2027Meta={
 path:"/naruto-card-game-2027",
 title:"2027年6月世界同時発売のNARUTOカードゲーム",
 description:"2026年10月11日のNARUTO公式記事から、2027年6月世界同時発売のスターターデッキ3種、第1弾ブースター「参上！うずまきナルト」、先行体験会と先行販売商品を整理します。"
};

export const naruto2027Intro={
 eyebrow:"OFFICIAL / 2026.10.11",
 heading:"NARUTOカードゲームは、2027年6月に世界同時発売。",
 lead:"2026年10月11日、NARUTO公式サイトがニューヨーク・コミコン2026での発表を掲載しました。このページに載せているのは、その日本語記事で確認できた内容だけです。"
};

export const naruto2027Highlights=[
 {label:"発売",value:"2027年6月・全世界同時"},
 {label:"掲載日",value:"2026年10月11日"},
 {label:"発表の場",value:"ニューヨーク・コミコン2026"},
 {label:"同時発売",value:"スターター3種と第1弾ブースター"}
];

export const naruto2027Sections=[
 {
  id:"release",
  heading:"2027年6月に同時発売されるもの",
  paragraphs:[
   "公式記事は、2027年6月にスターターデッキ3種と第一弾ブースターパック「参上！うずまきナルト」を発売すると書いています。",
   "発表は「スペシャルアニメトレーラー」とあわせて、ニューヨーク・コミコンで行われたとあります。"
  ]
 },
 {
  id:"starters",
  heading:"スターターデッキ3種",
  paragraphs:[
   "中心になるのは、うずまきナルト、うちはサスケ、我愛羅です。それぞれ構築済みで、遊び始めるのに必要なカードが入り、購入後すぐに対戦できると案内されています。",
   "リーダーはデッキごとに異なり、忍の顔ぶれと戦略も別だと説明されています。3種それぞれの製品名は、この記事には書かれていません。"
  ]
 },
 {
  id:"booster",
  heading:"第一弾ブースターパック「参上！うずまきナルト」",
  paragraphs:[
   "少年編と疾風伝の人気キャラクターを収録するとあります。ブースターパックは、新しい忍や術を収録したカードパックとして説明されています。",
   "スターターデッキの強化、好きなキャラクターの収集、自分のデッキ作りに使う、という位置づけです。新しいカードイラストが公開されたとも書かれています。このページでは画像を載せていません。",
   "発売までに、カードや情報を順次公開する予定だとあります。"
  ]
 },
 {
  id:"trial",
  heading:"2027年初頭の先行体験会",
  paragraphs:[
   "名称は「NARUTOカードゲーム 先行体験会」です。各地のトレーディングカードゲームショップで開くと書かれています。店舗名や日付は、この記事にはありません。",
   "カードゲームが初めての人でも、カードに触れながらルールや魅力を体験できるイベントだと説明されています。"
  ]
 },
 {
  id:"advance-sale",
  heading:"先行販売商品",
  paragraphs:[
   "先行販売商品として、「オフィシャルプレイマット -ナルトvsサスケ-」と「プレミアムカードコレクション vol.00 -チャクラセット-」が初公開されたとあります。",
   "販売場所は、先行体験会と、一部の「BANDAI CARD GAMES FEST 26-27」に限ると書かれています。詳細は後日、公式サイトと公式SNSで発表する、とあります。価格はこの記事にありません。"
  ]
 },
 {
  id:"next",
  heading:"次の大型情報はジャンプフェスタ2027",
  paragraphs:[
   "次回の『NARUTOカードゲーム』大型情報発表は、ジャンプフェスタ2027だと記事にあります。日程などの詳細は、ジャンプフェスタの公式サイトを見るよう案内されています。"
  ]
 },
 {
  id:"scope",
  heading:"このページに載せていないこと",
  paragraphs:[
   "見出しには「大型キャンペーン」もあります。本文で内容まで確認できたのは、先行体験会と先行販売商品です。キャンペーンの中身はこの記事本文にありません。",
   "発売日の日にち、価格、収録枚数、カードリスト、スターターデッキの製品名、商品型番は記載がありません。2002年からの旧カードとの関係も、この記事には書かれていません。",
   "公式サイトは、ニュース記事の一部に機械翻訳を使っていること、特に断りがなければ日付・時刻・発売時期は日本時間であることを注記しています。このページは日本語版の記事を参照しています。",
   "2026年10月13日以降に出た体験会の日程や販売条件は、ここでは扱っていません。"
  ]
 }
];

// No ASIN until a product page exists. Do not invent one.
export const naruto2027PurchasePendingLabel="商品ページ公開後に掲載";

export const naruto2027Products=[
 {id:"starter-naruto",name:"スターターデッキ（うずまきナルト中心）",asin:null},
 {id:"starter-sasuke",name:"スターターデッキ（うちはサスケ中心）",asin:null},
 {id:"starter-gaara",name:"スターターデッキ（我愛羅中心）",asin:null},
 {id:"booster-1",name:"ブースターパック「参上！うずまきナルト」",asin:null},
 {id:"playmat",name:"オフィシャルプレイマット -ナルトvsサスケ-",asin:null},
 {id:"chakra-set",name:"プレミアムカードコレクション vol.00 -チャクラセット-",asin:null}
];

export function naruto2027PurchaseUrl(product){
 if(!product?.asin) return null;
 return amazonProductUrl(product.asin);
}

export const naruto2027Links=[
 {label:"公式発表（2026/10/11）",url:naruto2027Source.url},
 {label:"スペシャルアニメトレーラー",url:"https://www.youtube.com/watch?v=bl_reRk9kD0"},
 {label:"NARUTOカードゲーム公式サイト",url:"https://www.naruto-cardgame.com/jp/"},
 {label:"NARUTOカードゲーム公式X",url:"https://x.com/narutotcg_jp"},
 {label:"ジャンプフェスタ2027",url:"https://www.jumpfesta.com/"}
];
