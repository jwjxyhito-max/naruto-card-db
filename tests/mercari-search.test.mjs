import test from "node:test";
import assert from "node:assert/strict";
import {MERCARI_AFFILIATE_ID,mercariSearchKeyword,mercariSearchUrl} from "../lib/mercariSearch.js";

test("Mercari search keeps the affiliate id first and encodes the card keyword",()=>{
 const url=new URL(mercariSearchUrl({id:"忍-203",name:"うちはイタチ"}));
 assert.equal(url.origin,"https://jp.mercari.com");
 assert.equal(url.pathname,"/search");
 assert.equal(url.searchParams.get("afid"),MERCARI_AFFILIATE_ID);
 assert.equal(url.searchParams.get("keyword"),"忍-203 うちはイタチ カードダス");
 assert.deepEqual([...url.searchParams.keys()],["afid","keyword"]);
 assert.match(url.search,/[?&]keyword=(?:%E5%BF%8D-203|\u5fcd-203)(?:\+|%20)/i);
});

test("Mercari keywords trim blank names and still name the card number",()=>{
 assert.equal(mercariSearchKeyword({id:" 忍-1 ",name:" うずまきナルト "}),"忍-1 うずまきナルト カードダス");
 assert.equal(mercariSearchKeyword({id:"忍-357",name:"  "}),"忍-357 カードダス");
});
