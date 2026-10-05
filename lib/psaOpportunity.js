export const psaOpportunityRecords=[
 {
  id:"PR072",name:"NARUTO UZUMAKI",year:2011,
  rawPrice:19.99,rawCurrency:"USD",rawCondition:"Near Mint",rawStatus:"Sold out",
  rawSource:"FNT Collectibles",rawUrl:"https://fntcollectibles.com/products/naruto-uzumaki-pr072-super-rare-naruto-ccg",
  psa10Price:150,psa10Pop:29,psaCert:"104705537",psaUrl:"https://www.psacard.com/cert/104705537/psa",
  psa9Price:null,psa9Pop:7,psa9Source:"PSA Population Report",psa9Url:"https://www.psacard.com/pop/tcg-cards/2011/naruto-ccg-ultimate-battle-tins/94929",
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
 const psa9Jpy=r.psa9Price==null?null:r.psa9Price*config.usdJpy;
 const psa9SaleNetJpy=psa9Jpy==null?null:psa9Jpy*(1-config.sellingFeeRate)-config.saleShippingJpy;
 const psa9ProfitJpy=psa9SaleNetJpy==null?null:psa9SaleNetJpy-totalCostJpy;
 return {spread,multiple,rawJpy,psa10Jpy,totalCostJpy,saleNetJpy,grossProfitJpy,breakEvenProbability,score,psa9Jpy,psa9SaleNetJpy,psa9ProfitJpy};
}

export function expectedValueStats(r,{p10=0.5,p9=0.3,lowerRecoveryJpy=null}={},config=psaCalcConfig){
 const s=opportunityStats(r,config);
 if(r.psa9Price==null) return {...s,expectedValueReady:false,p10,p9,lowerRecoveryJpy};
 const lower=lowerRecoveryJpy==null?s.rawJpy:lowerRecoveryJpy;
 const pLower=Math.max(0,1-p10-p9);
 const expectedSaleJpy=p10*s.saleNetJpy+p9*s.psa9SaleNetJpy+pLower*lower;
 const expectedProfitJpy=expectedSaleJpy-s.totalCostJpy;
 return {...s,expectedValueReady:true,p10,p9,pLower,lowerRecoveryJpy:lower,expectedSaleJpy,expectedProfitJpy};
}
