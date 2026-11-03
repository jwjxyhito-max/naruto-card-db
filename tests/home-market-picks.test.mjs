import test from "node:test";
import assert from "node:assert/strict";
import {comparableSoldCount,selectHomeMarketPicks} from "../lib/homeMarketPicks.mjs";

test("Home prioritizes comparable SOLD evidence without altering source records",()=>{
  const picks=[
    {id:"one",rank:1,samples:"1件（¥4,000）",median:"条件一致SOLD1件のみ"},
    {id:"two",rank:2,samples:"2件（¥1,299／¥3,000）"},
    {id:"unknown",rank:3,samples:"不明",detail:"過去10件／¥5,000"},
    {id:"five",rank:4,samples:"5件"},
    {id:"sold",rank:5,samples:"9件",soldOut:true}
  ];
  const original=structuredClone(picks);
  assert.deepEqual(selectHomeMarketPicks(picks).map(p=>p.id),["five","two"]);
  assert.deepEqual(picks,original);
  assert.equal(selectHomeMarketPicks(picks)[0],picks[3]);
  assert.deepEqual(selectHomeMarketPicks([picks[0],picks[2]]).map(p=>[p.id,p.homeReference]),[["one",true],["unknown",true]]);
});

test("An empty eligible pool shows three references by SOLD count and preserves sold status",()=>{
  const picks=[
    {id:"one",rank:1,samples:"1件",soldOut:false},
    {id:"unknown",rank:2,samples:"不明"},
    {id:"sold-two",rank:3,samples:"2件",soldOut:true,displayJudge:"売り切れ確認済み"},
    {id:"sold-four",rank:4,samples:"4件",soldOut:true},
    {id:"another-one",rank:5,samples:"1件",soldOut:false}
  ];
  const original=structuredClone(picks);
  const result=selectHomeMarketPicks(picks);
  assert.deepEqual(result.map(p=>p.id),["sold-four","sold-two","one"]);
  assert.ok(result.every(p=>p.homeReference===true));
  assert.equal(result[1].soldOut,true);
  assert.equal(result[1].displayJudge,"売り切れ確認済み");
  assert.deepEqual(picks,original);
  assert.deepEqual(selectHomeMarketPicks(),[]);
});

test("Conflicting counts use the lower count; prices and excluded old samples never inflate evidence",()=>{
  assert.equal(comparableSoldCount({samples:"5件",median:"¥4,000（条件一致SOLD1件のみ）"}),1);
  assert.equal(comparableSoldCount({samples:"１件",median:"条件一致SOLD１件"}),1);
  assert.equal(comparableSoldCount({median:"¥2,149.5（条件一致SOLD2件）"}),2);
  assert.equal(comparableSoldCount({samples:"未確認（前回10件）",median:"¥4,000"}),0);
  assert.equal(comparableSoldCount({samples:"0件",median:"条件一致SOLD2件"}),0);
  assert.equal(comparableSoldCount({samples:"2枚セット1件"}),0);
});
