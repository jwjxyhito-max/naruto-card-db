import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {getCardResearchIndex} from "../lib/getCardResearch.js";

test("Homepage research index keeps the latest version per card and reads past a full page",async()=>{
 const originalFetch=global.fetch;
 const originalUrl=process.env.SUPABASE_URL;
 const originalKey=process.env.SUPABASE_ANON_KEY;
 process.env.SUPABASE_URL="https://example.invalid";
 process.env.SUPABASE_ANON_KEY="public-test-key";
 const latest={id:1000,card_id:"忍-11",snapshot_date:"2026-10-14",name:"はたけカカシ",status:"research_incomplete"};
 const older={...latest,id:1,snapshot_date:"2026-10-13"};
 const offsets=[];
 global.fetch=async(endpoint,options)=>{
  const url=new URL(endpoint);
  offsets.push(url.searchParams.get("offset"));
  assert.equal(url.searchParams.get("published"),"eq.true");
  assert.equal(options.next.revalidate,1800);
  const rows=offsets.length===1
   ? [latest,...Array.from({length:499},(_,i)=>({id:999-i,card_id:"忍-"+(i+20),snapshot_date:"2026-10-14",name:"カード"+i,status:"complete"}))]
   : [older,{id:2,card_id:"忍-12",snapshot_date:"2026-10-13",name:"猿飛アスマ",status:"research_incomplete"}];
  return {ok:true,json:async()=>rows};
 };
 try{
  const result=await getCardResearchIndex();
  assert.deepEqual(offsets,["0","500"]);
  assert.equal(result.length,501);
  assert.deepEqual(result.find(x=>x.card_id==="忍-11"),latest);
 }finally{
  global.fetch=originalFetch;
  if(originalUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=originalUrl;
  if(originalKey===undefined)delete process.env.SUPABASE_ANON_KEY;else process.env.SUPABASE_ANON_KEY=originalKey;
 }
});

test("A failed later page does not display a partial research count",async()=>{
 const originalFetch=global.fetch;
 const originalUrl=process.env.SUPABASE_URL;
 const originalKey=process.env.SUPABASE_ANON_KEY;
 process.env.SUPABASE_URL="https://example.invalid";
 process.env.SUPABASE_ANON_KEY="public-test-key";
 let calls=0;
 global.fetch=async()=>++calls===1
  ? {ok:true,json:async()=>Array.from({length:500},(_,i)=>({id:i,card_id:"忍-"+i,snapshot_date:"2026-10-14",name:"カード"+i,status:"complete"}))}
  : {ok:false,status:503};
 try{assert.equal(await getCardResearchIndex(),null);}
 finally{
  global.fetch=originalFetch;
  if(originalUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=originalUrl;
  if(originalKey===undefined)delete process.env.SUPABASE_ANON_KEY;else process.env.SUPABASE_ANON_KEY=originalKey;
 }
});

test("Added research separates SOLD from ASK and leaves uncertain prices unset",async()=>{
 const data=JSON.parse(await readFile(new URL("../data/research-20261014-5-maki1.json",import.meta.url),"utf8"));
 assert.equal(new Set(data.cards.map(x=>x.id)).size,5);
 for(const card of data.cards){
  assert.equal(card.status,"research_incomplete");
  assert.equal(card.strictSameSpecSoldMedianJPY,null);
  assert.equal(card.additionalSoldCount,card.additionalSoldDisplayCandidates.length);
  assert.ok(card.buyDecision&&card.sellDecision&&card.pendingVerification.length);
  const soldUrls=new Set(card.additionalSoldDisplayCandidates.map(x=>x.url));
  for(const ask of card.currentAskObservations)assert.equal(soldUrls.has(ask.url),false);
  for(const sold of card.additionalSoldDisplayCandidates)assert.match(sold.url,/^https:\/\/jp\.mercari\.com\/item\/m\d+$/);
 }
 assert.equal(data.cards.find(x=>x.id==="忍-14").additionalSoldCount,0);
 assert.equal(data.cards.find(x=>x.id==="忍-15").additionalSoldCount,1);
});
