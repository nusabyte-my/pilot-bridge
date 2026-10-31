"use client";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export function ResetDemo(){const [busy,setBusy]=useState(false);const router=useRouter();return <button className="button" disabled={busy} onClick={async()=>{if(!window.confirm("Reset all fictional demo progress?"))return;setBusy(true);await fetch("/api/reset",{method:"POST"});router.push("/app");router.refresh();}}><RotateCcw size={14}/>{busy?"Resetting…":"Reset demo"}</button>;}
