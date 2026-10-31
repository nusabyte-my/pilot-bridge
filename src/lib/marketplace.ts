import { z } from "zod";
import { recordActivity, updateData } from "./store";
import { createPocDraft, matchInvestor } from "./marketplace-matching";
export const startupProfileSchema=z.object({id:z.string(),name:z.string().min(2).max(80),country:z.string().min(2),sector:z.string().min(2),description:z.string().min(20).max(1000),stage:z.enum(["Early production","Production ready"]),seeking:z.string(),capabilities:z.array(z.string()).min(1).max(8)});
export function saveStartupProfile(input:unknown){
  const parsed=startupProfileSchema.safeParse(input);if(!parsed.success)return {ok:false,message:"Complete the startup name, sector, description and at least one capability."};
  return updateData(data=>{const startup=data.startups.find(s=>s.id===parsed.data.id);if(!startup)return {ok:false,message:"Startup profile not found."};Object.assign(startup,parsed.data);recordActivity(data,null,`${startup.name} marketplace profile updated`);return {ok:true,message:"Startup profile updated. Match scores refreshed from the new evidence."};});
}
export function savePocIdea(startupId:string,investorId:string){
  return updateData(data=>{
    const startup=data.startups.find(s=>s.id===startupId);const investor=data.investors.find(i=>i.id===investorId);
    if(!startup||!investor)return {ok:false,message:"Select a valid startup and investor."};
    if(!matchInvestor(startup,investor).eligible)return {ok:false,message:"This pair does not meet sector, stage and ticket alignment gates."};
    const existing=data.pocIdeas.find(p=>p.startupId===startupId&&p.investorId===investorId);if(existing)return {ok:true,message:"POC ideation already exists for this match.",id:existing.id};
    const idea={id:crypto.randomUUID(),startupId,investorId,...createPocDraft(startup,investor),status:"Idea" as const,createdAt:new Date().toISOString()};data.pocIdeas.unshift(idea);recordActivity(data,null,`POC ideation created for ${startup.name} and ${investor.name}`);return {ok:true,message:"POC ideation created with scope, success metric and 12-week plan.",id:idea.id};
  });
}
export function convertPocIdea(ideaId: string) {
  return updateData(data => {
    const idea = data.pocIdeas.find(item => item.id === ideaId);
    if (!idea) return { ok: false, message: "POC ideation not found." };
    if (idea.convertedPocId) return { ok: true, message: "Draft charter already created.", pocId: idea.convertedPocId };
    const startup = data.startups.find(item => item.id === idea.startupId);
    const investor = data.investors.find(item => item.id === idea.investorId);
    if (!startup || !investor || !matchInvestor(startup, investor).eligible) return { ok: false, message: "The current profile no longer meets matching eligibility." };
    const pocId = crypto.randomUUID(); const challengeId = crypto.randomUUID();
    data.challenges.push({ id: challengeId, title: idea.title, rawProblem: idea.thesis, status: "Charter review", country: startup.markets[0], site: `${startup.markets[0]} enterprise pilot site`, baseline: "11%", target: idea.successMetric, unit: "Late deliveries", duration: idea.duration, budget: null, constraints: [idea.scope], capabilities: startup.capabilities, missing: ["Confirm corporate sponsor and data owner", "Validate baseline at kick-off"], approved: true, createdAt: new Date().toISOString(), pocId, startupId: startup.id, structuredBy: "Marketplace POC ideation" });
    data.pocs.push({ id: pocId, challengeId, startupId: startup.id, status: "CharterReview", charter: `POC CHARTER · ${idea.title}\n\nPARTICIPANTS\nMeridian Logistics (Singapore), ${startup.name} (${startup.country}), with ecosystem support from ${investor.name}.\n\nPILOT THESIS\n${idea.thesis}\n\nSCOPE\n${idea.scope}\n\nSUCCESS MEASURE\n${idea.successMetric}\n\nDURATION\n${idea.duration}\n\nPHASE PLAN\n${idea.phases.map(phase => `${phase.phase}: ${phase.outcome}`).join("\n")}\n\nRESPONSIBILITIES\nCorporate sponsor and data owner to be confirmed at kick-off. ${startup.name} provides implementation and weekly measurement. ${investor.name} supports enterprise introductions and pilot design without any funding commitment.\n\nOUT OF SCOPE\nNationwide rollout, investment commitment and unvalidated production data access.\n\nPOST-POC DECISION\nReview measured evidence and agree a commercial or learning next step within 10 business days.`, corporateApproved: false, startupApproved: false, createdAt: new Date().toISOString(), partnerSelectedAt: new Date().toISOString(), charterReviewAt: new Date().toISOString(), activatedAt: null, resultSubmittedAt: null, completedAt: null, lastActivityAt: new Date().toISOString(), readiness: { decisionMaker: false, localOwner: false, dataAccess: false, procurement: false, language: true, regulatory: false } });
    idea.phases.forEach((phase, index) => data.milestones.push({ id: crypto.randomUUID(), pocId, title: phase.phase, owner: index === 0 ? "Programme manager" : `${startup.name} implementation lead`, dueDate: ["2026-11-13", "2026-12-25", "2027-01-22"][index], critical: index === 0, status: "Not started" }));
    idea.convertedPocId = pocId; recordActivity(data, pocId, `POC ideation converted into draft challenge and charter for ${startup.name}`);
    return { ok: true, message: "Draft challenge and charter created. Review both before activation.", pocId };
  });
}
export function requestIntroduction(startupId:string,investorId:string){
  return updateData(data=>{
    if(!data.startups.some(s=>s.id===startupId)||!data.investors.some(i=>i.id===investorId))return {ok:false,message:"Select a valid startup and investor."};
    if(data.introductions.some(i=>i.startupId===startupId&&i.investorId===investorId))return {ok:false,message:"An introduction has already been requested for this match."};
    data.introductions.push({id:crypto.randomUUID(),startupId,investorId,status:"Requested",createdAt:new Date().toISOString()});return {ok:true,message:"Introduction requested. POC ideation is ready to shape the first meeting."};
  });
}
