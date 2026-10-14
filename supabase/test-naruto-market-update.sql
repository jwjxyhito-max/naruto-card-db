-- All test writes occur in a subtransaction that is always rolled back.
-- Nothing here commits a synthetic market analysis.
create function pg_temp.verify_naruto_market_update() returns jsonb
language plpgsql security invoker set search_path='' as $body$
declare baseline jsonb; base_id bigint; candidate jsonb; evidence jsonb; run_id uuid; job_id uuid; ticket text; saved jsonb; replay jsonb; result jsonb; before_count bigint; after_count bigint; observed jsonb; ts timestamptz;
begin
  select count(*) into before_count from public.naruto_market_analysis;
  select id,payload into base_id,baseline from public.naruto_market_analysis order by analyzed_at desc,id desc limit 1;
  if not private.naruto_market_payload_valid(baseline) then raise exception 'Latest payload shape invalid'; end if;
  if private.naruto_market_payload_valid(baseline||'{"analyzed_at":"2030-01-01"}'::jsonb) then raise exception 'Client timestamp accepted'; end if;
  if private.naruto_market_payload_valid(jsonb_set(baseline,'{picks}', '[]'::jsonb)) then raise exception 'Invalid picks accepted'; end if;
  if private.naruto_market_change_valid(baseline,baseline,'[]'::jsonb) then raise exception 'No change accepted'; end if;
  if has_function_privilege('anon','public.naruto_consume_market_job(uuid,text)','EXECUTE') or has_function_privilege('authenticated','public.naruto_consume_market_job(uuid,text)','EXECUTE') then raise exception 'Public writer exposed'; end if;
  if not has_function_privilege('service_role','public.naruto_consume_market_job(uuid,text)','EXECUTE') then raise exception 'Worker role cannot execute'; end if;
  begin
    insert into private.naruto_market_runs(slot,base_analysis_id) values('qa-invalid-'||gen_random_uuid(),base_id) returning id into run_id;
    result:=private.submit_naruto_market_run(run_id,'{}'::jsonb,'[]'::jsonb);
    if result->>'reason'<>'invalid_payload' then raise exception 'Bad shape not rejected'; end if;
    insert into private.naruto_market_runs(slot,base_analysis_id) values('qa-nochange-'||gen_random_uuid(),base_id) returning id into run_id;
    result:=private.submit_naruto_market_run(run_id,null,'[]'::jsonb);
    if result->>'status'<>'unchanged' then raise exception 'No change not skipped'; end if;
    insert into private.naruto_market_runs(slot,base_analysis_id) values('qa-duplicate-'||gen_random_uuid(),base_id) returning id into run_id;
    result:=private.submit_naruto_market_run(run_id,baseline,'[]'::jsonb);
    if result->>'status'<>'duplicate' then raise exception 'Existing payload not skipped'; end if;
    candidate:=jsonb_set(baseline,'{headline}',to_jsonb('ROLLBACK QA - never public'::text));
    candidate:=jsonb_set(candidate,'{catalysts}',(baseline->'catalysts')||jsonb_build_array(jsonb_build_object('date','ROLLBACK QA','text','Synthetic test within a rolled-back transaction only. https://naruto-official.com/qa-rollback')));
    evidence:=jsonb_build_array(jsonb_build_object('type','official','verified',true,'url','https://naruto-official.com/qa-rollback','observedAt',now(),'excerpt','Synthetic test: this never commits.','summary','Synthetic test isolated within rollback.'));
    insert into private.naruto_market_runs(slot,base_analysis_id,status) values('qa-save-'||gen_random_uuid(),base_id,'queued') returning id into run_id;
    insert into private.naruto_market_jobs(run_id,payload,evidence) values(run_id,candidate,evidence) returning id,private.naruto_market_jobs.ticket into job_id,ticket;
    result:=public.naruto_consume_market_job(job_id,repeat('0',64));
    if result->>'status'<>'unauthorized' then raise exception 'Bad ticket accepted'; end if;
    saved:=public.naruto_consume_market_job(job_id,ticket);
    if saved->>'status'<>'saved' then raise exception 'QA save failed: %',saved; end if;
    select payload,analyzed_at into observed,ts from public.naruto_market_analysis where id=(saved->>'analysis_id')::bigint;
    if observed is distinct from candidate or ts is distinct from now() then raise exception 'Readback or DB timestamp failed'; end if;
    replay:=public.naruto_consume_market_job(job_id,ticket);
    if replay is distinct from saved then raise exception 'Replay result changed'; end if;
    select count(*) into after_count from public.naruto_market_analysis;
    if after_count<>before_count+1 then raise exception 'Duplicate INSERT detected'; end if;
    result:=jsonb_build_object('auth_denial','passed','worker_grant','passed','payload_validation','passed','no_change_skip','passed','existing_payload_dedup','passed','insert_and_readback','passed','db_timestamp','passed','ticket_replay_dedup','passed','inserted_test_id',saved->'analysis_id');
    raise exception using errcode='Z0001',message='Roll back every QA write';
  exception when sqlstate 'Z0001' then null;
  end;
  select count(*) into after_count from public.naruto_market_analysis;
  if after_count<>before_count then raise exception 'QA rollback failed'; end if;
  return result||jsonb_build_object('all_test_writes_rolled_back',true,'public_rows',after_count);
end $body$;
select pg_temp.verify_naruto_market_update();
