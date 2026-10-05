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

export const psaCalcConfig={
 usdJpy:150,
 gradingTotalJpy:13150,
 sellingFeeRate:0,
 saleShippingJpy:0,
 updatedAt:"2026-10-05",
 note:"初期値。為替・PSA料金・送料等は変動するため更新可能な設定値として扱います。"
};

export function opportunityStats(r,config=psaCalcConfig){
 const spread=r.psa10Price-r.rawPrice;
 const multiple=r.rawPrice? r.psa10Price/r.rawPrice:0;
 const rawJpy=r.rawPrice*config.usdJpy;
 const psa10Jpy=r.psa10Price*config.usdJpy;
 const totalCostJpy=rawJpy+config.gradingTotalJpy;
 const saleNetJpy=psa10Jpy*(1-config.sellingFeeRate)-config.saleShippingJpy;
 const grossProfitJpy=saleNetJpy-totalCostJpy;
 const breakEvenProbability=saleNetJpy>0?totalCostJpy/saleNetJpy:Infinity;
 const p=breakEvenProbability*100;
 const score=p<30?"S":p<50?"A":p<70?"B":"WATCH";
 return {spread,multiple,rawJpy,psa10Jpy,totalCostJpy,saleNetJpy,grossProfitJpy,breakEvenProbability,score};
}
