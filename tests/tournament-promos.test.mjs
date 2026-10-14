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
