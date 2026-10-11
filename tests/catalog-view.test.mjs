import test from "node:test";
import assert from "node:assert/strict";
import {cards} from "../lib/cards.js";
import {sortCards} from "../lib/cardSort.js";
import {paginate,pageHref,queryValue} from "../lib/catalogView.js";

test("Every registered card is reachable exactly once across paginated results",()=>{
 const original=cards.map(c=>c.id);
 const sorted=sortCards(cards);
 const seen=[];
 for(let page=1;page<=paginate(sorted,"1").pages;page++)seen.push(...paginate(sorted,String(page)).items.map(c=>c.id));
 assert.deepEqual(seen,sorted.map(c=>c.id));
 assert.equal(new Set(seen).size,cards.length);
 assert.deepEqual(cards.map(c=>c.id),original);
});

test("Malformed and out-of-range URLs still return a usable catalog page",()=>{
 const list=cards.slice(0,31);
 for(const input of [undefined,"0","-1","1.5","abc",["2"],"Infinity"]){
  const result=paginate(list,input);
  assert.equal(result.page,1);
  assert.equal(result.items.length,30);
 }
 assert.equal(paginate(list,"99999").page,2);
 assert.equal(paginate(list,"99999").items.length,1);
 assert.deepEqual(paginate([],"99999"),{page:1,pages:1,items:[],total:0});
});

test("Pagination links retain Japanese search filters and sorting",()=>{
 const url=new URL(pageHref("/search",{q:"忍-204",character:"うずまきナルト",series:"巻ノ壱",sort:"series",rank:""},3),"https://naruto-card-db.vercel.app");
 assert.equal(url.searchParams.get("q"),"忍-204");
 assert.equal(url.searchParams.get("character"),"うずまきナルト");
 assert.equal(url.searchParams.get("series"),"巻ノ壱");
 assert.equal(url.searchParams.get("sort"),"series");
 assert.equal(url.searchParams.get("page"),"3");
 assert.equal(url.searchParams.has("rank"),false);
 assert.equal(pageHref("/cards",{},1),"/cards");
 assert.equal(queryValue(["忍-1","忍-2"]),"");
});
