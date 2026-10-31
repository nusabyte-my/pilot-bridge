"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/types";
export function useWorkflow() {
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState<ActionResult|null>(null);
  const router = useRouter();
  async function request(operation:string,body:object={}) {
    setBusy(true);setMessage(null);
    try {
      const response = await fetch(`/api/${operation}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const result = await response.json() as ActionResult;setMessage(result);if(result.ok)router.refresh();return result;
    } catch {const result = {ok:false,message:"Network error. Your saved workflow was not changed."};setMessage(result);return result;}
    finally {setBusy(false);}
  }
  return {busy,message,request};
}
