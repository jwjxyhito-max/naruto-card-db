import data from "../data/dot-market.json";
export const dotMarket=data;
export function marketRecord(id){return data.records.find(r=>r.id===id)}
export function formatSold(values=[]){return values.length?values.map(v=>v.toLocaleString("ja-JP")+"円").join(" / "):"SOLD調査中"}