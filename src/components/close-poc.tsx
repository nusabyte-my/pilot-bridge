"use client";
import { useState } from "react";
import { XCircle } from "lucide-react";
import type { ActionResult, Poc } from "@/lib/types";
export function ClosePoc({poc,request,busy}:{poc:Poc;request:(operation:string,body?:object)=>Promise<ActionResult>;busy:boolean}){
  const [open,setOpen]=useState(false);const [reason,setReason]=useState("");
  if(poc.status==="Completed"||poc.closedAt)return null;
  return <section className="card sidebar-card"><div className="eyebrow">Close without POC</div>{!open?<><p className="tiny muted" style={{marginBottom:12}}>Use when the parties explicitly decide not to proceed. The reason becomes part of activity history.</p><button className="button small" onClick={()=>setOpen(true)}><XCircle size={13}/>Close POC</button></>:<><label className="label" htmlFor="close-reason">Closure reason</label><textarea id="close-reason" className="textarea" style={{minHeight:80}} value={reason} onChange={e=>setReason(e.target.value)}/><div style={{display:"flex",gap:8,marginTop:10}}><button className="button small" disabled={busy||reason.trim().length<5} onClick={async()=>{const result=await request("close",{reason,pocId:poc.id});if(result.ok){setOpen(false);setReason("");}}}>Record closure</button><button className="button small" onClick={()=>setOpen(false)}>Cancel</button></div></>}</section>;
}
