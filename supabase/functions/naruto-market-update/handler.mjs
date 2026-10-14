// Database-issued, short-lived job tickets authenticate this server-only endpoint.
// The caller cannot submit arbitrary payloads or choose an INSERT target.
export function createHandler(env, send = fetch) {
  return async (req) => {
    const reply = (status, data) => new Response(JSON.stringify(data), {
      status, headers: {'Content-Type':'application/json','Cache-Control':'no-store'},
    });
    if (req.method !== 'POST') return reply(405,{error:'method_not_allowed'});
    if (!req.headers.get('content-type')?.startsWith('application/json')) return reply(415,{error:'json_required'});
    if (Number(req.headers.get('content-length')) > 2048) return reply(413,{error:'body_too_large'});
    let input;
    try {
      const raw = await req.text();
      if (new TextEncoder().encode(raw).length > 2048) return reply(413,{error:'body_too_large'});
      input = JSON.parse(raw);
    } catch { return reply(400,{error:'invalid_json'}); }
    if (!input || Object.keys(input).length !== 2
      || typeof input.jobId !== 'string' || !/^[0-9a-f-]{36}$/.test(input.jobId)
      || typeof input.ticket !== 'string' || !/^[0-9a-f]{64}$/.test(input.ticket)) {
      return reply(401,{error:'invalid_job_ticket'});
    }
    const url = env('SUPABASE_URL'), key = env('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return reply(503,{error:'worker_configuration'});
    try {
      const res = await send(`${url}/rest/v1/rpc/naruto_consume_market_job`, {
        method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
        body:JSON.stringify({p_job_id:input.jobId,p_ticket:input.ticket}),signal:AbortSignal.timeout(12000),
      });
      if (!res.ok) {
        console.error(JSON.stringify({event:'naruto_market_write_failed',jobId:input.jobId,httpStatus:res.status}));
        return reply(503,{error:'database_request_failed'});
      }
      const result = await res.json();
      console.log(JSON.stringify({event:'naruto_market_job',jobId:input.jobId,status:result.status,analysisId:result.analysis_id}));
      return reply(result.status === 'unauthorized' ? 401 : result.status === 'failed' ? 409 : 200,result);
    } catch {
      console.error(JSON.stringify({event:'naruto_market_transport_failed',jobId:input.jobId}));
      return reply(503,{error:'database_unavailable'});
    }
  };
}

