"use client";
import { ArrowRight, Check } from "lucide-react";
import { useWorkflow } from "./use-workflow";
export function IntroductionButton({startupId,investorId,introduced}:{startupId:string;investorId:string;introduced:boolean}){const {busy,message,request}=useWorkflow();return <>{message&&<div className={`notice ${message.ok?"success":"error"}`} role="status">{message.message}</div>}<button className="button primary" disabled={busy||introduced} onClick={()=>request("introduce",{startupId,investorId})}>{introduced?<><Check size={14}/>Introduction requested</>:<>Request warm introduction<ArrowRight size={14}/></>}</button></>;}
