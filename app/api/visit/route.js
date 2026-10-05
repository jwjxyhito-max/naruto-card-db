import {cookies} from "next/headers";

export const dynamic="force-dynamic";

export async function POST(){
  const store=await cookies();
  let visitorId=store.get("naruto_visitor_id")?.value;

  if(!visitorId){
    visitorId=crypto.randomUUID();
    store.set("naruto_visitor_id",visitorId,{
      httpOnly:true,
      sameSite:"lax",
      secure:process.env.NODE_ENV==="production",
      path:"/",
      maxAge:60*60*24*365*2
    });
  }

  const url=process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_ANON_KEY;
  if(!url||!key){
    return Response.json({total:null},{status:200});
  }

  try{
    const res=await fetch(`${url}/rest/v1/rpc/register_site_visit`,{
      method:"POST",
      headers:{
        apikey:key,
        Authorization:`Bearer ${key}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({p_site_key:"naruto",p_visitor_id:visitorId}),
      cache:"no-store"
    });
    if(!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
    const total=await res.json();
    return Response.json({total:Number(total)||0});
  }catch(error){
    console.error("Naruto visit counter:",error);
    return Response.json({total:null},{status:200});
  }
}
