"use client";

import {useEffect,useState} from "react";

export default function VisitCounter(){
  const [total,setTotal]=useState(null);

  useEffect(()=>{
    let active=true;
    fetch("/api/visit",{method:"POST"})
      .then(r=>r.json())
      .then(data=>{if(active&&Number.isFinite(Number(data.total))) setTotal(Number(data.total));})
      .catch(()=>{});
    return ()=>{active=false;};
  },[]);

  if(total===null) return null;

  return <div className="visitCounter" aria-label={`累計訪問者 ${total.toLocaleString("ja-JP")}人`}>
    <span className="visitCounterLabel">VISITORS</span>
    <strong>{total.toLocaleString("ja-JP")}</strong>
    <span>累計訪問者</span>
  </div>;
}
