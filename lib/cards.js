export const cards=[
{id:"忍-1",name:"うずまきナルト",character:"うずまきナルト",series:"NARUTO-ナルト-カードゲーム 巻ノ壱",release:"2002-12-13",type:"忍",rank:"C",market:"同版の単品実績は調査中",note:"公式カードリストで番号・名称・収録を確認。初期シリーズを調べる基礎カード。",source:"https://www.tv-tokyo.co.jp/anime/naruto2002/goods/card_01.html"},
{id:"忍-2",name:"うちはサスケ",character:"うちはサスケ",series:"NARUTO-ナルト-カードゲーム 巻ノ壱",release:"2002-12-13",type:"忍",rank:"C",market:"同版の単品実績は調査中",note:"公式カードリストで番号・名称・収録を確認。",source:"https://www.tv-tokyo.co.jp/anime/naruto2002/goods/card_01.html"},
{id:"忍-3",name:"春野サクラ",character:"春野サクラ",series:"NARUTO-ナルト-カードゲーム 巻ノ壱",release:"2002-12-13",type:"忍",rank:"C",market:"同版の単品実績は調査中",note:"公式カードリストで番号・名称・収録を確認。",source:"https://www.tv-tokyo.co.jp/anime/naruto2002/goods/card_01.html"},
{id:"忍-204",name:"調査継続中",character:"不明",series:"不明",release:"不明",type:"忍",rank:"WATCH",market:"同条件SOLD精査中",note:"重点監視対象。版・加工・状態を分離して調査中。"},
{id:"忍-372",name:"綱手",character:"綱手",series:"調査継続中",release:"不明",type:"忍",rank:"A",market:"状態・箔色差を分離して精査中",note:"重点監視。価格差の要因を版・加工・状態ごとに確認する。"},
{id:"忍-357",name:"名称同定中",character:"不明",series:"巻ノ十五の番号帯との二次資料あり・要確認",release:"不明",type:"忍",rank:"B",market:"単品相場不明",note:"6枚セット出品に番号記載を確認。セット総額を単品相場には使用しない。"},
{id:"PR術-2",name:"黒夢",character:"うちはイタチ",series:"プロモーション",release:"不明",type:"術",rank:"B",market:"確認標本 SOLD 12,000円 / 12,888円",note:"現在80,000円出品も確認されているが、希望額を相場として扱わない。配布経路は一次資料確認中。"}
];
export function findCard(id){return cards.find(c=>c.id===id)}
