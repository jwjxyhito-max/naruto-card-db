import test from 'node:test';
import assert from 'node:assert/strict';
import {isMarketAnalysis,parseYen} from '../lib/marketAnalysisValidation.mjs';
import {marketAnalysis} from '../lib/marketAnalysis.js';
import {createHandler} from '../supabase/functions/naruto-market-update/handler.mjs';
import {getMarketAnalysis} from '../lib/getMarketAnalysis.js';

const clean = () => { const {updatedAt,analysisId,...p}=structuredClone(marketAnalysis); return p; };
const jobId='aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',ticket='a'.repeat(64);
const request = body => new Request('https://worker.test',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});

test('confirmed snapshot is readable and the eight-field update is strict', () => {
  assert.equal(isMarketAnalysis(marketAnalysis),true);
  assert.equal(isMarketAnalysis(clean(),{strict:true}),true);
  const malformed=clean();malformed.picks[1].id=malformed.picks[0].id;
  assert.equal(isMarketAnalysis(malformed,{strict:true}),false);
  assert.equal(isMarketAnalysis({...clean(),analyzed_at:'2030-01-01'},{strict:true}),false);
  assert.equal(isMarketAnalysis({...clean(),cadence:'12時間更新'},{strict:true}),false);
  const missing=clean();delete missing.picks[0].median;
  assert.equal(isMarketAnalysis(missing),false);
});

test('money parser preserves fractional SOLD medians without folding sample counts or percentages', () => {
  assert.equal(parseYen('¥2,149.5（SOLD2件）'),2149.5);
  assert.equal(parseYen('¥1,390（26.8%値下げ）'),1390);
  assert.equal(parseYen('未確認'),null);
});

test('unauthenticated and arbitrary-payload requests never contact the database', async () => {
  let called=false;
  const handler=createHandler(()=> 'server-only',async()=>{called=true;throw Error('unexpected');});
  assert.equal((await handler(request({payload:clean()}))).status,413);
  assert.equal((await handler(new Request('https://worker.test'))).status,405);
  assert.equal((await handler(request({jobId,ticket,payload:clean()}))).status,413);
  assert.equal(called,false);
});

test('job credentials are verified by the DB before a save and secrets stay out of responses', async () => {
  let calls=0;
  const handler=createHandler(key=>key==='SUPABASE_URL'?'https://db.test':'PRIVATE_SERVICE_KEY',async(url,init)=>{
    calls++;
    assert.equal(url,'https://db.test/rest/v1/rpc/naruto_consume_market_job');
    assert.equal(init.headers.apikey,'PRIVATE_SERVICE_KEY');
    assert.deepEqual(JSON.parse(init.body),{p_job_id:jobId,p_ticket:ticket});
    return Response.json({status:'unauthorized'});
  });
  const response=await handler(request({jobId,ticket}));
  assert.equal(response.status,401);assert.equal(calls,1);
  assert.equal((await response.text()).includes('PRIVATE_SERVICE_KEY'),false);
});

test('database and transport failures are retryable, without exposing backend errors', async () => {
  for (const send of [async()=>new Response('secret-error',{status:500}),async()=>{throw Error('secret-error');}]) {
    const response=await createHandler(()=> 'server-only',send)(request({jobId,ticket}));
    assert.equal(response.status,503);
    assert.equal((await response.text()).includes('secret-error'),false);
  }
});

test('invalid newest rows are skipped and a failed fetch retains the last normal analysis', async () => {
  const originalFetch=globalThis.fetch, originalUrl=process.env.SUPABASE_URL, originalKey=process.env.SUPABASE_ANON_KEY;
  process.env.SUPABASE_URL='https://db.test';process.env.SUPABASE_ANON_KEY='public-test-key';
  try {
    globalThis.fetch=async(url,init)=>{
      assert.equal(init.cache,'no-store');
      return Response.json([
        {id:32,analyzed_at:'2026-10-14T00:00:00Z',payload:{headline:'bad'}},
        {id:31,analyzed_at:'2026-10-13T12:00:00Z',payload:clean()},
        {id:29,analyzed_at:'2026-10-11T12:05:40Z',payload:clean()},
      ]);
    };
    const latest=await getMarketAnalysis();assert.equal(latest.analysisId,31);
    assert.equal(latest.picks[0].previousPrice,clean().picks[0].price);
    globalThis.fetch=async()=>new Response('unavailable',{status:503});
    assert.equal((await getMarketAnalysis()).analysisId,31);
  } finally {
    globalThis.fetch=originalFetch;
    if (originalUrl===undefined) delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=originalUrl;
    if (originalKey===undefined) delete process.env.SUPABASE_ANON_KEY;else process.env.SUPABASE_ANON_KEY=originalKey;
  }
});

test('verified SOLD persists across later analysis snapshots and recently checked available listings remain distinct', async () => {
 const oldFetch=globalThis.fetch, oldUrl=process.env.SUPABASE_URL, oldKey=process.env.SUPABASE_ANON_KEY;
 process.env.SUPABASE_URL='https://db.test';process.env.SUPABASE_ANON_KEY='test-anon-key';
 const now=Date.now(), analyzedAt=new Date(now-5*3600000).toISOString();
 const recent=new Date(now-30*60000).toISOString(),oldSold=new Date(now-6*3600000).toISOString();
 const statuses=[
  {item_id:'m38023486906',status:'sold_confirmed',checked_at:oldSold},
  {item_id:'m56088153394',status:'sold_confirmed',checked_at:recent},
  {item_id:'m18746104685',status:'available',checked_at:recent},
  {item_id:'m54013916520',status:'available',checked_at:recent},
  {item_id:'m96880070399',status:'sold_confirmed',checked_at:recent}
 ];
 const payload=clean();
 try{
  globalThis.fetch=async(url)=>url.includes('naruto_listing_status')
   ? Response.json(statuses)
   : Response.json([{id:31,analyzed_at:analyzedAt,payload}]);
  const result=await getMarketAnalysis();
  assert.deepEqual(result.picks.map(p=>p.listingStatus),[
   'sold_confirmed','sold_confirmed','available','available','sold_confirmed'
  ]);
  assert.equal(result.picks[0].soldOut,true);
  assert.equal(result.picks[0].displayJudge,'売り切れ確認済み');
  assert.match(result.picks[0].displaySummary,/購入候補ではありません/);
  assert.equal(result.picks[2].displayJudge,'販売中を確認');
  assert.equal(result.picks[4].displayPrice,'¥7,777');
 } finally {
  globalThis.fetch=oldFetch;
  if(oldUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldUrl;
  if(oldKey===undefined)delete process.env.SUPABASE_ANON_KEY;else process.env.SUPABASE_ANON_KEY=oldKey;
 }
});
