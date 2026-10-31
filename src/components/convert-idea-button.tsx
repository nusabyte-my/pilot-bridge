"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
export function ConvertIdeaButton({ideaId,convertedPocId}:{ideaId:string;convertedPocId?:string}){
  const [busy,setBusy]=useState(false);const [error,setError]=useState("");const router=useRouter();
  async function convert(){setBusy(true);setError("");try{const response=await fetch("/api/convert-idea",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ideaId})});const result=await response.json();if(!response.ok)throw new Error(result.message);router.push(`/app/poc?id=${result.pocId}`);}catch(e){setError(e instanceof Error?e.message:"Could not convert POC idea.");setBusy(false);}}
  return <>{error&&<div className="notice error">{error}</div>}<button className="button primary" disabled={busy} onClick={convert}><FileText size={14}/>{busy?"Creating draft…":convertedPocId?"Open draft POC charter":"Create draft POC charter"}<ArrowRight size={14}/></button></>;
}
