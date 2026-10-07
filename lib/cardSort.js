const prefixOrder=["忍","忍伝","術","作","PR忍"];
const rarityOrder=["S","A","B","WATCH","R","SR","UR","SEC","N"];
export function cardIdParts(id=""){const s=String(id).trim();const m=s.match(/^(.+?)-(\d+)(.*)$/);if(!m)return {prefix:s,number:Number.MAX_SAFE_INTEGER,suffix:""};return {prefix:m[1],number:Number(m[2]),suffix:m[3]||""};}
export function isPromoCard(c){return /^PR/i.test(String(c.id))||/プロモ/i.test(String(c.series||""));}
const prefixRank=p=>{const i=prefixOrder.indexOf(p);return i<0?prefixOrder.length:i};
const seriesKey=c=>String(c.series||"");
export function compareCardNumber(a,b){const ap=isPromoCard(a),bp=isPromoCard(b);if(ap!==bp)return ap?1:-1;const A=cardIdParts(a.id),B=cardIdParts(b.id);return prefixRank(A.prefix)-prefixRank(B.prefix)||A.prefix.localeCompare(B.prefix,"ja")||A.number-B.number||A.suffix.localeCompare(B.suffix,"ja",{numeric:true})||seriesKey(a).localeCompare(seriesKey(b),"ja",{numeric:true});}
export function compareSeries(a,b){const ap=isPromoCard(a),bp=isPromoCard(b);if(ap!==bp)return ap?1:-1;return seriesKey(a).localeCompare(seriesKey(b),"ja",{numeric:true})||compareCardNumber(a,b);}
export function compareRarity(a,b){const ar=rarityOrder.indexOf(String(a.rank||"")),br=rarityOrder.indexOf(String(b.rank||""));const A=ar<0?rarityOrder.length:ar,B=br<0?rarityOrder.length:br;return A-B||compareCardNumber(a,b);}
export function sortCards(list,mode="number"){const cmp=mode==="series"?compareSeries:mode==="rarity"?compareRarity:compareCardNumber;return [...list].sort(cmp);}
