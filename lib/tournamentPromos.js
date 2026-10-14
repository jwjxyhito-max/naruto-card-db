// 大会配布の分類。2026-10-15現在。配布情報の一次資料確認とSOLD実績は別々に扱う。
// 同一番号でも再録／仕様違いがあり得るため「優勝限定」を確定表現にしない。
const shippuden="https://naruto-card.jp/guides/shippuden-tournament-promos";
const winTable="https://naruto-card.jp/guides/tournament-win-promos";
const collector=(id,name,category,conditions,extra={})=>({
 id,name,category,conditions,evidence:"コレクター報告（二次掲載）",
 evidenceNote:"大会の正式名称・当時の公式告知は未照合",source:shippuden,verifiedOfficial:false,...extra
});
const historical=(id,name,category,conditions)=>({
 id,name,category,conditions,evidence:"当時の賞品表（紹介記事に転載）",
 evidenceNote:"賞品表の記載を二次掲載で確認。原本・版違いは継続照合",source:winTable,verifiedOfficial:false
});
const seller=(id,name,category,conditions,source,extra={})=>({
 id,name,category,conditions,evidence:"販売者・出品者の説明",
 evidenceNote:"大会の正式名称・一次資料は未確認。販売者説明は公式根拠ではない",
 source,verifiedOfficial:false,...extra
});
export const tournamentCategories=[
 {id:"winner",label:"大会優勝賞",hint:"優勝者向けと伝えられるカード。再録・別版の有無に注意"},
 {id:"top",label:"上位入賞賞",hint:"優勝以外の上位賞を含む。順位を確認できるまで断定しない"},
 {id:"streak",label:"勝ち抜き・連勝賞",hint:"3勝・5勝・10勝など、優勝限定と区別"},
 {id:"participation",label:"参加賞",hint:"参加者に配られたとされるカード。大会告知の照合状況を表示"}
];
export const tournamentPromos=[
 collector("PR忍伝-12","うちはサスケ","winner","大会優勝のみとの記録",{
  priority:true,reprint:"再録なしとの報告（未検証）"
 }),
 collector("PR忍伝-13","四代目火影","winner","大会優勝のみとの記録",{
  priority:true,reprint:"再録なしとの報告（未検証）"
 }),
 seller("PR作-28","火影の系譜","winner","2006年の大会優勝賞という出品者説明",
  "https://jp.mercari.com/search?keyword=NARUTO%20PR%E4%BD%9C28%20%E5%A4%A7%E4%BC%9A",{
  priority:true,
  sales:[
   {price:30000,date:"2026-07-02",marketplace:"Yahoo!フリマ",url:"https://paypayfleamarket.yahoo.co.jp/item/z637820310",note:"SOLD表示・7/2の取引記録"},
   {price:50000,date:"2026-07-24",marketplace:"Yahoo!フリマ",url:"https://paypayfleamarket.yahoo.co.jp/item/z638840382",note:"SOLD表示・購入日時あり"}
  ]
 }),
 seller("PR作-29","木ノ葉を襲う脅威","winner","大会優勝賞という出品者説明",
  "https://jp.mercari.com/item/m61092068686",{
  priority:true,
  sales:[{price:183000,date:"2026-09-21",marketplace:"Yahoo!フリマ",url:"https://paypayfleamarket.yahoo.co.jp/item/z664704912",note:"購入日時あり"}]
 }),
 collector("PR忍伝-6","うちはサスケ","winner","大会優勝賞との記録",{reprint:"再録ありとの報告（再録先未照合）"}),
 collector("PR忍伝-7","うちはイタチ","winner","大会優勝賞との記録",{reprint:"再録ありとの報告（再録先未照合）"}),
 collector("PR忍伝-8","うずまきナルト＆日向ヒナタ","winner","大会優勝賞との記録",{reprint:"再録ありとの報告（再録先未照合）"}),
 collector("PR忍伝-9","うずまきナルト＆はたけカカシ","winner","大会優勝賞との記録",{reprint:"再録ありとの報告（再録先未照合）"}),
 collector("PR忍伝-10","春野サクラ＆山中いの","winner","大会優勝賞との記録",{reprint:"再録ありとの報告（再録先未照合）"}),
 seller("PR作-23","永久に続く運命","winner","大会優勝賞との出品者説明",
 "https://jp.mercari.com/item/m83322468884",{
  evidenceNote:"大会優勝賞と5連勝賞の異なる説明があり、配布条件は要再検証",
  sales:[{price:4600,date:null,marketplace:"メルカリ",url:"https://jp.mercari.com/item/m83322468884",note:"SOLD表示・やや傷や汚れあり（取引日未確認）"}]
 }),
 seller("PR作-4","戦闘開始！","top","大会上位賞との出品説明","https://naruto-card.jp/guides",{evidenceNote:"順位・大会名・公式資料とも未確認"}),
 historical("PR忍-9","うちはサスケ","streak","2005年夏・勝ち抜き戦3勝／3種類から選択"),
 historical("PR作-11","存在の証明","streak","2005年夏・勝ち抜き戦3勝／3種類から選択"),
 historical("PR作-12","最後の一撃","streak","2005年夏・勝ち抜き戦3勝／3種類から選択"),
 historical("PR忍-1-R","うずまきナルト","streak","2005年夏・勝ち抜き戦5勝／3種類から選択"),
 historical("PR忍-4","うずまきナルト","streak","2005年夏・勝ち抜き戦5勝／3種類から選択"),
 historical("PR作-5","陰謀の発端","streak","2005年夏・勝ち抜き戦5勝／3種類から選択"),
 historical("PR忍-14","君麻呂","streak","2005年夏・勝ち抜き戦10勝"),
 collector("PR忍伝-1","うずまきナルト","streak","大会5連勝との記録",{reprint:"再録ありとの報告（再録先未照合）"}),
 collector("PR忍伝-2","春野サクラ","streak","大会5連勝との記録",{reprint:"再録ありとの報告（再録先未照合）"}),
 collector("PR忍伝-3","はたけカカシ","participation","大会参加賞との記録"),
 collector("PR忍伝-4","デイダラ","participation","大会参加賞との記録"),
 collector("PR忍伝-11","春野サクラ","participation","大会参加賞との記録")
];
export const focusPromos=tournamentPromos.filter(card=>card.priority);
export const tournamentCounts=Object.fromEntries(tournamentCategories.map(cat=>[cat.id,tournamentPromos.filter(card=>card.category===cat.id).length]));
