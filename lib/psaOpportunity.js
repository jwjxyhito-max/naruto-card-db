export const psaOpportunityRecords=[
 {
  id:"PR072",name:"NARUTO UZUMAKI",year:2011,
  rawPrice:19.99,rawCurrency:"USD",rawCondition:"Near Mint",rawStatus:"Sold out",
  rawSource:"FNT Collectibles",rawUrl:"https://fntcollectibles.com/products/naruto-uzumaki-pr072-super-rare-naruto-ccg",
  psa10Price:150,psa10Pop:29,psaCert:"104705537",psaUrl:"https://www.psacard.com/cert/104705537/psa",
  psaSaleDate:"2026-03-22",psaSaleType:"eBay BestOffer",
  note:"同一カードの未鑑定NM販売ページとPSA10販売履歴を確認。鑑定料・送料・税・PSA10取得率は未控除。"
 }
];

export function opportunityStats(r){
 const spread=r.psa10Price-r.rawPrice;
 const multiple=r.rawPrice? r.psa10Price/r.rawPrice:0;
 return {spread,multiple};
}
