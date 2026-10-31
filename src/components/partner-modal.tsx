"use client";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, LockKeyhole, RotateCcw, X } from "lucide-react";
import type { Startup } from "@/lib/types";
export function PartnerModal({ startups, selected: initial, challengeTitle = "Last-Mile Delivery Optimisation", onClose, onConfirm }: { startups: Startup[]; selected: string|null; challengeTitle?: string; onClose:()=>void; onConfirm:(id:string)=>Promise<void> }) {
  const [selected,setSelected] = useState(initial);
  const [busy,setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.focus();
    function keydown(e:KeyboardEvent) {
      if(e.key === "Escape") onClose();
      if(e.key === "Tab" && ref.current) {
        const items = Array.from(ref.current.querySelectorAll<HTMLElement>("button:not(:disabled),input:not(:disabled)"));
        const first=items[0], last=items[items.length-1];
        if(e.shiftKey && document.activeElement === first){e.preventDefault();last?.focus();}
        else if(!e.shiftKey && document.activeElement === last){e.preventDefault();first?.focus();}
      }
    }
    document.addEventListener("keydown",keydown);
    return () => { document.removeEventListener("keydown",keydown); previous?.focus(); };
  },[onClose]);
  return <div className="modal-backdrop" onMouseDown={e => {if(e.target===e.currentTarget)onClose();}}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="partner-title" tabIndex={-1} ref={ref}><div className="modal-header"><div><h2 id="partner-title">Change POC Partner</h2><p className="subtitle">1 challenge · {challengeTitle}</p></div><button className="icon-button" onClick={onClose} aria-label="Close partner selection"><X size={19}/></button></div><div className="modal-body"><div className="form-field"><span className="label">Corporate challenge</span><div className="input" style={{background:"var(--paper)",display:"flex",alignItems:"center",gap:8}}><LockKeyhole size={14}/>Meridian Logistics · Singapore</div></div><h3 style={{margin:"22px 0 6px"}}>Eligible candidates</h3><p className="tiny muted" style={{marginBottom:5}}>Availability and critical fit checks are enforced on confirmation.</p>{startups.map(startup => <label key={startup.id} className={`candidate ${!startup.available ? "disabled" : ""}`}><input type="radio" name="startup" value={startup.id} checked={selected===startup.id} disabled={!startup.available} onChange={()=>setSelected(startup.id)}/><div className="startup-logo" style={{background:startup.color}}>{startup.initials}</div><div style={{flex:1}}><div className="startup-name">{startup.name} <span className="tiny muted">· {startup.country}</span></div><div className="tiny muted">{startup.available ? startup.reasons[0] : startup.unavailableReason}</div>{startup.available && startup.gaps.length > 0 && <div className="tiny" style={{color:"var(--amber)",marginTop:4}}><AlertTriangle size={11} style={{verticalAlign:"middle",marginRight:4}}/>{startup.gaps[0]}</div>}</div><span className={`badge ${startup.available ? "green":""}`}>{selected===startup.id ? <><Check size={11}/>Selected</> : startup.available ? "Available" : "Unavailable"}</span></label>)}</div><div className="modal-footer"><button className="button small" onClick={()=>setSelected(null)} disabled={!selected}><RotateCcw size={13}/>Reset selection</button><div style={{display:"flex",gap:8}}><button className="button" onClick={onClose}>Cancel</button><button className="button primary" disabled={!selected||busy} onClick={async()=>{if(selected){setBusy(true);await onConfirm(selected);setBusy(false);}}}>Confirm partner</button></div></div></div></div>;
}
