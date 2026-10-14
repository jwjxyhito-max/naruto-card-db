-- Additive repair: no existing analysis rows, policies or card data are removed.
create table private.naruto_market_runs (
  id uuid primary key default gen_random_uuid(),
  slot text not null unique,
  base_analysis_id bigint,
  status text not null default 'researching',
  started_at timestamptz not null default now(),
  lease_until timestamptz not null default now() + interval '60 minutes',
  finished_at timestamptz,
  result jsonb
);
create table private.naruto_market_jobs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references private.naruto_market_runs(id),
  payload jsonb not null,
  evidence jsonb not null,
  ticket text not null default encode(extensions.gen_random_bytes(32),'hex'),
  expires_at timestamptz not null default now() + interval '60 minutes',
  status text not null default 'pending',
  attempts integer not null default 0,
  request_id bigint,
  dispatched_at timestamptz,
  finished_at timestamptz,
  result jsonb
);
create table private.naruto_market_publications (
  payload_hash bytea primary key,
  analysis_id bigint not null references public.naruto_market_analysis(id)
);
insert into private.naruto_market_publications(payload_hash,analysis_id)
select extensions.digest(payload::text,'sha256'),min(id)
from public.naruto_market_analysis group by payload
on conflict do nothing;
alter table private.naruto_market_runs enable row level security;
alter table private.naruto_market_jobs enable row level security;
alter table private.naruto_market_publications enable row level security;
revoke all on private.naruto_market_runs,private.naruto_market_jobs,private.naruto_market_publications from public,anon,authenticated;
grant usage on schema private to service_role;
grant select,insert,update on private.naruto_market_runs,private.naruto_market_jobs to service_role;
grant select,insert on private.naruto_market_publications to service_role;
grant select,insert on public.naruto_market_analysis to service_role;
do $grant$ begin
  execute format('grant usage,select on sequence %s to service_role',pg_get_serial_sequence('public.naruto_market_analysis','id'));
end $grant$;

create function private.naruto_market_payload_valid(p jsonb, strict boolean default true)
returns boolean language plpgsql immutable security invoker set search_path='' as $body$
declare k text; pick jsonb; c jsonb; i integer:=0; seen text[]:='{}';
begin
  if p is null or jsonb_typeof(p)<>'object' or octet_length(p::text)>262144 then return false; end if;
  if strict and (p - array['cadence','headline','lead','picks','overseasSummary','catalysts','strategy','disclaimer']) <> '{}'::jsonb then return false; end if;
  foreach k in array array['cadence','headline','lead','strategy','disclaimer'] loop
    if jsonb_typeof(p->k) is distinct from 'string' or length(btrim(p->>k))=0 or length(p->>k)>16000 then return false; end if;
  end loop;
  if strict and (p->>'cadence') ~ '[0-9０-９]|時間|毎朝|毎晩|毎日|朝夜|分ごと' then return false; end if;
  if jsonb_typeof(p->'picks') is distinct from 'array' then return false; end if;
  if jsonb_array_length(p->'picks')<>5 then return false; end if;
  for pick in select value from jsonb_array_elements(p->'picks') loop
    i:=i+1;
    if jsonb_typeof(pick)<>'object' or (pick->>'rank') is distinct from i::text or (pick->>'id')=any(seen) then return false; end if;
    foreach k in array array['id','name','judge','price','median','samples','discount','summary','detail','overseas','mercariUrl'] loop
      if jsonb_typeof(pick->k) is distinct from 'string' or length(btrim(pick->>k))=0 or length(pick->>k)>16000 then return false; end if;
    end loop;
    if (pick->>'id') !~ '^(PR|OP)?(忍|術|作|学)-[0-9]+(-R)?$' then return false; end if;
    if (pick->>'mercariUrl') !~ '^https://jp[.]mercari[.]com/item/m[0-9]+$' then return false; end if;
    if pick ? 'ebayUrl' and (pick->>'ebayUrl') !~ '^https://([a-z0-9-]+[.])*ebay[.][a-z.]+/' then return false; end if;
    seen:=array_append(seen,pick->>'id');
  end loop;
  if jsonb_typeof(p->'overseasSummary') is distinct from 'array' or jsonb_typeof(p->'catalysts') is distinct from 'array' then return false; end if;
  if jsonb_array_length(p->'overseasSummary') not between 1 and 20 or jsonb_array_length(p->'catalysts')>30 then return false; end if;
  for c in select value from jsonb_array_elements(p->'overseasSummary') loop
    if jsonb_typeof(c)<>'string' or length(btrim(c#>>'{}'))=0 or length(c#>>'{}')>16000 then return false; end if;
  end loop;
  for c in select value from jsonb_array_elements(p->'catalysts') loop
    if jsonb_typeof(c)<>'object' then return false; end if;
    foreach k in array array['date','text'] loop
      if jsonb_typeof(c->k) is distinct from 'string' or length(btrim(c->>k))=0 or length(c->>k)>16000 then return false; end if;
    end loop;
  end loop;
  return true;
end $body$;

create function private.naruto_yen(p text) returns numeric
language sql immutable security invoker set search_path='' as $body$
  select replace((regexp_match(p,'([0-9][0-9,]*([.][0-9]+)?)'))[1],',','')::numeric;
$body$;

-- Evidence is retained separately; the existing eight-field marketAnalysis stays intact.
create function private.naruto_market_change_valid(candidate jsonb, baseline jsonb, evidence jsonb)
returns boolean language plpgsql stable security invoker set search_path='' as $body$
declare e jsonb; a jsonb; b jsonb; stamp timestamptz; before_value numeric; after_value numeric; field text; sample jsonb; prices numeric[]; median numeric; official_changed boolean:=false; price_ids text[]:='{}'; median_ids text[]:='{}'; rank_ids text[]:='{}'; sold_ids text[]:='{}';
begin
  if jsonb_typeof(evidence) is distinct from 'array' or jsonb_array_length(evidence) not between 1 and 20 then return false; end if;
  for e in select value from jsonb_array_elements(evidence) loop
    if jsonb_typeof(e)<>'object' or e->'verified' is distinct from 'true'::jsonb or length(coalesce(e->>'summary',''))<10 then continue; end if;
    begin stamp:=(e->>'observedAt')::timestamptz; exception when others then continue; end;
    if stamp is null or stamp<now()-interval '24 hours' or stamp>now()+interval '5 minutes' then continue; end if;
    if (e->>'url') !~ '^https://[^/@[:space:]]+/' then continue; end if;
    if e->>'type'='official' then
      if (e->>'url') ~ '^https://(www[.])?(naruto-official[.]com|naruto-cardgame[.]com|boruto-official[.]com|vjump[.]shueisha[.]co[.]jp|www[.]shonenjump[.]com)/'
        and length(coalesce(e->>'excerpt','')) between 10 and 2000
        and position(e->>'url' in (candidate->'catalysts')::text)>0
        and position(e->>'url' in coalesce((baseline->'catalysts')::text,''))=0 then official_changed:=true; end if;
      continue;
    end if;
    select value into a from jsonb_array_elements(candidate->'picks') where value->>'id'=e->>'cardId';
    select value into b from jsonb_array_elements(baseline->'picks') where value->>'id'=e->>'cardId';
    if a is null then continue; end if;
    if e->>'type'='ranking' then
      if (candidate->'picks')<> (baseline->'picks') and
        (a->>'rank') is distinct from (b->>'rank') and (e->>'url')=a->>'mercariUrl'
        and e->'numberMatched'='true'::jsonb and e->'specMatched'='true'::jsonb
        and e->'conditionMatched'='true'::jsonb and e->'singleCard'='true'::jsonb then rank_ids:=array_append(rank_ids,a->>'id'); end if;
    elsif e->>'type'='sold_out' then
      if b is not null and (e->>'url')=b->>'mercariUrl' and e->'soldConfirmed'='true'::jsonb
        and a->>'judge' ~ '売り切れ|販売終了|^SOLD($|[ ・｜:：])|成約確認' and b->>'judge' !~ '売り切れ|販売終了|^SOLD($|[ ・｜:：])|成約確認' then sold_ids:=array_append(sold_ids,a->>'id'); end if;
    elsif e->>'type'='price' and b is not null then
      field:=case e->>'metric' when 'ask' then 'price' when 'sold_median' then 'median' else null end;
      if field is null then continue; end if;
      before_value:=private.naruto_yen(b->>field); after_value:=private.naruto_yen(a->>field);
      if before_value is null or after_value is null or before_value<=0 or abs(after_value-before_value)/before_value<0.20 then continue; end if;
      if e->'numberMatched' is distinct from 'true'::jsonb or e->'specMatched' is distinct from 'true'::jsonb
        or e->'conditionMatched' is distinct from 'true'::jsonb or e->'singleCard' is distinct from 'true'::jsonb then continue; end if;
      if field='price' and (e->>'url')=a->>'mercariUrl' and a->>'mercariUrl'=b->>'mercariUrl'
        and e->'available'='true'::jsonb then price_ids:=array_append(price_ids,a->>'id'); end if;
      if field='median' then
        if jsonb_typeof(e->'samples') is distinct from 'array' then continue; end if;
        prices:='{}';
        for sample in select value from jsonb_array_elements(e->'samples') loop
          if sample->'soldConfirmed'='true'::jsonb and sample->'numberMatched'='true'::jsonb
            and sample->'specMatched'='true'::jsonb and sample->'conditionMatched'='true'::jsonb
            and sample->'singleCard'='true'::jsonb and sample->>'url' ~ '^https://jp[.]mercari[.]com/item/m[0-9]+$'
            and jsonb_typeof(sample->'priceYen')='number' and (sample->>'priceYen')::numeric between 1 and 100000000 then prices:=array_append(prices,(sample->>'priceYen')::numeric); end if;
        end loop;
        if cardinality(prices)<>jsonb_array_length(e->'samples') or cardinality(prices)<3 then continue; end if;
        if (select count(distinct value->>'url') from jsonb_array_elements(e->'samples'))<>cardinality(prices) then continue; end if;
        select percentile_cont(0.5) within group (order by v) into median from unnest(prices) as v;
        if median=after_value and private.naruto_yen(a->>'samples')=cardinality(prices) then median_ids:=array_append(median_ids,a->>'id'); end if;
      end if;
    end if;
  end loop;
  -- Every numeric/ranking/status change needs its own validated evidence.
  for a in select value from jsonb_array_elements(candidate->'picks') loop
    select value into b from jsonb_array_elements(baseline->'picks') where value->>'id'=a->>'id';
    if b is null then
      if not (a->>'id'=any(rank_ids)) then return false; end if;
      continue;
    end if;
    if (a->>'rank') is distinct from (b->>'rank') and not (a->>'id'=any(rank_ids)) then return false; end if;
    if private.naruto_yen(a->>'price') is distinct from private.naruto_yen(b->>'price') and not (a->>'id'=any(price_ids)) then return false; end if;
    if (private.naruto_yen(a->>'median') is distinct from private.naruto_yen(b->>'median') or private.naruto_yen(a->>'samples') is distinct from private.naruto_yen(b->>'samples')) and not (a->>'id'=any(median_ids)) then return false; end if;
    if a->>'judge' ~ '売り切れ|販売終了|^SOLD($|[ ・｜:：])|成約確認' and b->>'judge' !~ '売り切れ|販売終了|^SOLD($|[ ・｜:：])|成約確認' and not (a->>'id'=any(sold_ids)) then return false; end if;
  end loop;
  return official_changed or cardinality(price_ids)>0 or cardinality(median_ids)>0 or cardinality(rank_ids)>0 or cardinality(sold_ids)>0;
exception when invalid_text_representation or numeric_value_out_of_range then return false;
end $body$;

create function private.begin_naruto_market_run() returns jsonb
language plpgsql security invoker set search_path='' as $body$
declare slot_name text; run private.naruto_market_runs; base_id bigint;
begin
  if current_user<>'postgres' then raise insufficient_privilege using message='Management authentication required'; end if;
  slot_name:=to_char(now() at time zone 'Asia/Tokyo','YYYY-MM-DD')||case when extract(hour from now() at time zone 'Asia/Tokyo')<15 then ':AM' else ':PM' end;
  perform pg_advisory_xact_lock(hashtextextended('naruto-market-run:'||slot_name,0));
  select * into run from private.naruto_market_runs where slot=slot_name for update;
  if run.id is not null and run.status in ('saved','unchanged','duplicate') then return jsonb_build_object('status','already_completed','run_id',run.id,'slot',slot_name); end if;
  if run.id is not null and run.lease_until>now() then return jsonb_build_object('status','already_running','run_id',run.id,'slot',slot_name); end if;
  select id into base_id from public.naruto_market_analysis where private.naruto_market_payload_valid(payload,false) order by analyzed_at desc,id desc limit 1;
  insert into private.naruto_market_runs(slot,base_analysis_id) values(slot_name,base_id)
  on conflict(slot) do update set base_analysis_id=excluded.base_analysis_id,status='researching',started_at=now(),lease_until=now()+interval '60 minutes',finished_at=null,result=null
  returning * into run;
  return jsonb_build_object('status','started','run_id',run.id,'slot',slot_name,'base_analysis_id',base_id);
end $body$;

create function private.dispatch_naruto_market_jobs() returns integer
language plpgsql security invoker set search_path='' as $body$
declare job private.naruto_market_jobs; sent integer:=0; request bigint;
begin
  if current_user<>'postgres' then raise insufficient_privilege; end if;
  update private.naruto_market_jobs set status='failed',finished_at=now(),result='{"status":"failed","reason":"worker_timeout"}'::jsonb
  where status in ('pending','dispatched') and (expires_at<=now() or (attempts>=5 and dispatched_at<now()-interval '5 minutes'));
  update private.naruto_market_runs r set status='failed',finished_at=now(),result=j.result
  from private.naruto_market_jobs j where j.run_id=r.id and j.status='failed' and r.status='queued';
  for job in select * from private.naruto_market_jobs where status in ('pending','dispatched')
    and expires_at>now() and attempts<5 and (dispatched_at is null or dispatched_at<now()-interval '5 minutes')
    order by expires_at for update skip locked limit 5 loop
    select net.http_post(
      url:='https://triyddjhfrmhyxxnilyq.supabase.co/functions/v1/naruto-market-update',
      body:=jsonb_build_object('jobId',job.id,'ticket',job.ticket),
      headers:='{"Content-Type":"application/json"}'::jsonb,timeout_milliseconds:=15000
    ) into request;
    update private.naruto_market_jobs set status='dispatched',request_id=request,dispatched_at=now(),attempts=attempts+1 where id=job.id;
    sent:=sent+1;
  end loop;
  return sent;
end $body$;

create function private.submit_naruto_market_run(p_run_id uuid,p_payload jsonb,p_evidence jsonb,p_error text default null) returns jsonb
language plpgsql security invoker set search_path='' as $body$
declare run private.naruto_market_runs; base jsonb; job_id uuid; outcome jsonb;
begin
  if current_user<>'postgres' then raise insufficient_privilege using message='Management authentication required'; end if;
  select * into run from private.naruto_market_runs where id=p_run_id for update;
  if run.id is null or run.lease_until<=now() then raise exception 'Run missing or expired'; end if;
  if run.status<>'researching' then return coalesce(run.result,jsonb_build_object('status',run.status)); end if;
  if p_error is not null then
    outcome:=jsonb_build_object('status','failed','reason',left(p_error,500));
  elsif p_payload is null and (p_evidence is null or p_evidence='[]'::jsonb) then
    outcome:='{"status":"unchanged"}'::jsonb;
  elsif not private.naruto_market_payload_valid(p_payload) then
    outcome:='{"status":"failed","reason":"invalid_payload"}'::jsonb;
  else
    select payload into base from public.naruto_market_analysis where id=run.base_analysis_id;
    if exists(select 1 from private.naruto_market_publications where payload_hash=extensions.digest(p_payload::text,'sha256')) then
      outcome:='{"status":"duplicate"}'::jsonb;
    elsif not private.naruto_market_change_valid(p_payload,base,p_evidence) then
      outcome:='{"status":"unchanged","reason":"no_verified_meaningful_change"}'::jsonb;
    else
      insert into private.naruto_market_jobs(run_id,payload,evidence) values(run.id,p_payload,p_evidence) returning id into job_id;
      outcome:=jsonb_build_object('status','queued','job_id',job_id);
    end if;
  end if;
  update private.naruto_market_runs set status=outcome->>'status',result=outcome,finished_at=case when outcome->>'status'='queued' then null else now() end where id=run.id;
  if outcome->>'status'='queued' then perform private.dispatch_naruto_market_jobs(); end if;
  return outcome;
end $body$;

-- Invoker privileges only. No public, anon or general authenticated execution.
create function public.naruto_consume_market_job(p_job_id uuid,p_ticket text) returns jsonb
language plpgsql security invoker set search_path='' as $body$
declare job private.naruto_market_jobs; run private.naruto_market_runs; base jsonb; latest_id bigint; row public.naruto_market_analysis; outcome jsonb;
begin
  if current_user not in ('service_role','postgres') then raise insufficient_privilege; end if;
  select * into job from private.naruto_market_jobs where id=p_job_id for update;
  if job.id is null or p_ticket is null or length(p_ticket)<>64 or extensions.digest(p_ticket,'sha256')<>extensions.digest(job.ticket,'sha256') then
    return '{"status":"unauthorized"}'::jsonb;
  end if;
  if job.status in ('saved','duplicate','unchanged','failed') then return job.result; end if;
  if job.expires_at<=now() then return '{"status":"unauthorized","reason":"expired_ticket"}'::jsonb; end if;
  perform pg_advisory_xact_lock(hashtextextended('naruto-market-publish',0));
  select * into run from private.naruto_market_runs where id=job.run_id for update;
  select id,payload into latest_id,base from public.naruto_market_analysis where private.naruto_market_payload_valid(payload,false) order by analyzed_at desc,id desc limit 1;
  if run.id is null or run.status<>'queued' or latest_id is distinct from run.base_analysis_id then
    outcome:='{"status":"failed","reason":"baseline_changed_or_run_invalid"}'::jsonb;
  elsif not private.naruto_market_payload_valid(job.payload) then
    outcome:='{"status":"failed","reason":"invalid_payload"}'::jsonb;
  elsif exists(select 1 from private.naruto_market_publications where payload_hash=extensions.digest(job.payload::text,'sha256')) then
    outcome:='{"status":"duplicate"}'::jsonb;
  elsif not private.naruto_market_change_valid(job.payload,base,job.evidence) then
    outcome:='{"status":"unchanged","reason":"no_verified_meaningful_change"}'::jsonb;
  else
    insert into public.naruto_market_analysis(payload) values(job.payload) returning * into row;
    insert into private.naruto_market_publications(payload_hash,analysis_id) values(extensions.digest(job.payload::text,'sha256'),row.id);
    outcome:=jsonb_build_object('status','saved','analysis_id',row.id,'analyzed_at',row.analyzed_at,'payload_hash',encode(extensions.digest(row.payload::text,'sha256'),'hex'));
  end if;
  update private.naruto_market_jobs set status=outcome->>'status',result=outcome,finished_at=now() where id=job.id;
  update private.naruto_market_runs set status=outcome->>'status',result=outcome,finished_at=now() where id=job.run_id;
  return outcome;
end $body$;

revoke all on function private.naruto_market_payload_valid(jsonb,boolean),private.naruto_yen(text),private.naruto_market_change_valid(jsonb,jsonb,jsonb),private.begin_naruto_market_run(),private.dispatch_naruto_market_jobs(),private.submit_naruto_market_run(uuid,jsonb,jsonb,text),public.naruto_consume_market_job(uuid,text) from public,anon,authenticated;
grant execute on function private.naruto_market_payload_valid(jsonb,boolean),private.naruto_yen(text),private.naruto_market_change_valid(jsonb,jsonb,jsonb),public.naruto_consume_market_job(uuid,text) to service_role;

-- Only retries pending transport; this never performs a second market research run.
select cron.schedule('naruto-market-job-retry','*/5 * * * *','select private.dispatch_naruto_market_jobs();');
