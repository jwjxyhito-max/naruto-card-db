import fs from "node:fs/promises";
const input=process.env.DOT_MARKET_INPUT||"data/dot-market-input.json";
const output="data/dot-market.json";
const raw=JSON.parse(await fs.readFile(input,"utf8"));
if(!Array.isArray(raw.records))throw new Error("records must be an array");
const money=v=>Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<=10000000?Number(v):null;
const records=[];
for(const r of raw.records){
 if(!r||typeof r.id!=="string"||!r.id.trim())continue;
 const sold=Array.isArray(r.sold)?r.sold.map(money).filter(v=>v!==null):[];
 const currentListing=money(r.currentListing);
 const rank=["S","A","B","WATCH","C"].includes(r.rank)?r.rank:"C";
 if(!sold.length&&currentListing===null)continue;
 records.push({id:r.id.trim(),sold,currentListing,rank,note:String(r.note||"").slice(0,500),checkedAt:r.checkedAt||raw.updatedAt||new Date().toISOString(),sources:Array.isArray(r.sources)?r.sources.filter(x=>typeof x==="string"&&/^https:\/\//.test(x)).slice(0,20):[]});
}
const out={schemaVersion:1,updatedAt:raw.updatedAt||new Date().toISOString(),source:"DOT / 弱者の参謀 共有ボード",records};
await fs.writeFile(output,JSON.stringify(out,null,2)+"\n");
console.log(`validated ${records.length} market records -> ${output}`);