import test from "node:test";
import assert from "node:assert/strict";
import {cards} from "../lib/cards.js";
import {focusPromos,tournamentPromos,tournamentCategories,tournamentCounts} from "../lib/tournamentPromos.js";

test("Every tournament record has a distinct catalog card number and an explicit source",()=>{
 const ids=tournamentPromos.map(item=>item.id);
 assert.equal(new Set(ids).size,ids.length);
 const known=new Set(cards.map(card=>card.id));
 for(const item of tournamentPromos){
  assert.ok(known.has(item.id),item.id+" is missing in card catalog");
  assert.ok(item.source.startsWith("https://"),item.id);
  assert.ok(item.evidence && item.evidenceNote,item.id);
  assert.equal(item.verifiedOfficial,false,item.id+" must not falsely claim primary verification");
 }
});
test("Tournament class totals and priority are consistent",()=>{
 assert.deepEqual(tournamentCategories.map(cat=>cat.id),["winner","top","streak","participation"]);
 assert.equal(tournamentCategories.reduce((sum,cat)=>sum+tournamentCounts[cat.id],0),tournamentPromos.length);
 assert.deepEqual(focusPromos.map(item=>item.id),["PR忍伝-12","PR忍伝-13","PR作-28","PR作-29"]);
});
test("Displayed sales must be linked, positive and not conflated with active listings",()=>{
 for(const item of tournamentPromos)for(const sold of item.sales||[]){
  assert.ok(Number.isInteger(sold.price)&&sold.price>0,item.id);
  assert.match(sold.url,/^https:\/\//);
  assert.ok(sold.marketplace);
  if(sold.date)assert.match(sold.date,/^20\d\d-\d\d-\d\d$/);
 }
});

test("October 15 five-card refresh includes 11 distinct SOLD listings and two explicitly unpriced investigations",async()=>{
 const {getMarketData}=await import("../lib/market.js");
 const ids=["PR忍伝-12","PR忍伝-13","PR作-23","PR作-28","PR作-29"];
 const totals={"PR忍伝-12":0,"PR忍伝-13":0,"PR作-23":5,"PR作-28":2,"PR作-29":4};
 const matched=tournamentPromos.filter(card=>card.marketCheckedAt==="2026-10-15");
 assert.deepEqual(new Set(matched.map(card=>card.id)),new Set(ids));
 assert.equal(matched.reduce((total,card)=>total+(card.sales?.length||0),0),11);
 for(const card of matched){
  const sold=card.sales||[];
  assert.equal(sold.length,totals[card.id],card.id);
  assert.equal(new Set(sold.map(item=>item.url)).size,sold.length,card.id);
  assert.equal(getMarketData(card.id).soldCount,sold.length);
  assert.equal(getMarketData(card.id).checkedAt,"2026-10-15 JST");
  assert.ok(card.marketSummary);
  assert.deepEqual(sold.map(item=>item.price),sold.map(item=>item.price).sort((a,b)=>a-b),card.id);
 }
 for(const id of ids.slice(0,2)){
  assert.match(getMarketData(id).confidence,/未確認/);
  assert.ok(!/¥|[0-9],[0-9]{3}円/.test(getMarketData(id).market));
 }
});
