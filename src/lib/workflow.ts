import { createHash } from "node:crypto";
import { getData, recordActivity, syncChallenge, updateData } from "./store";
import type { ActionResult, AppData } from "./types";
import { resultSchema } from "./schemas";
import { matchCriteria } from "./matching";
import { commercialTransitions } from "./commercial";

function failure(message: string): ActionResult { return { ok: false, message }; }
function scopedPoc(data: AppData, pocId: string) {
  const poc = data.pocs.find(item => item.id === pocId);
  if (!poc) throw new Error("POC not found.");
  return poc;
}
export function saveChallenge(input: { title: string; capabilities: string[]; constraints: string[]; country: string; site: string | null; baseline: string | null; target: string | null; unit: string | null; duration: string | null; budget: string | null; missing: string[] }, rawProblem: string, structuredBy: string): ActionResult {
  return updateData(data => {
    const challenge = data.challenges[0];
    Object.assign(challenge, input, { rawProblem, structuredBy, approved: true });
    const poc = data.pocs[0]; poc.status = "Matching"; syncChallenge(data, poc);
    data.matches = [...data.startups].sort((x,y)=>matchCriteria(y,challenge).total-matchCriteria(x,challenge).total).slice(0,3).map((startup,index)=>{const criteria=matchCriteria(startup,challenge);return {id:crypto.randomUUID(),challengeId:challenge.id,startupId:startup.id,criteria:Object.entries(criteria).filter(([key])=>key!=="total").map(([label,score])=>({label,score:score as number,max:({capability:40,industry:20,maturity:15,deployment:15,availability:10} as Record<string,number>)[label]})),reasons:startup.reasons,risks:startup.gaps,rank:index+1};});
    recordActivity(data, poc.id, "Structured challenge requirements approved for matching");
    return { ok: true, message: "Challenge approved. Explainable matches are ready." };
  });
}
export function selectPartner(startupId: string, pocId = "poc-delivery"): ActionResult {
  return updateData(data => {
    const poc = scopedPoc(data, pocId);
    const challenge = data.challenges.find(item => item.id === poc.challengeId);
    if (!challenge?.approved) return failure("Approve the structured challenge before matching.");
    const startup = data.startups.find(s => s.id === startupId);
    if (!startup || !startup.available) return failure("This startup is not eligible for the proposed timeline.");
    if (["Active", "ResultSubmitted", "Completed"].includes(poc.status)) return failure("The partner is locked after activation.");
    poc.startupId = startupId; poc.status = "PartnerSelected"; poc.partnerSelectedAt = new Date().toISOString(); poc.charter = null; poc.corporateApproved = false; poc.startupApproved = false;
    syncChallenge(data, poc); recordActivity(data, poc.id, `${startup.name} confirmed as POC partner`);
    return { ok: true, message: `${startup.name} confirmed. Your introduction pack is ready.` };
  });
}
export function generateCharter(pocId = "poc-delivery"): ActionResult {
  return updateData(data => {
    const poc = scopedPoc(data, pocId);
    const startup = data.startups.find(s => s.id === poc.startupId);
    const challenge = data.challenges.find(item => item.id === poc.challengeId)!;
    if (!startup || poc.status !== "PartnerSelected") return failure("Confirm a partner before generating the charter.");
    poc.charter = `POC CHARTER · ${challenge.title}\n\nPARTICIPANTS\nMeridian Logistics (Singapore) and ${startup.name} (${startup.country}). Corporate sponsor: Daniel Tan. Delivery owners: Aisha Rahman and ${startup.name} implementation lead.\n\nPILOT OBJECTIVE\nReduce late deliveries at the Singapore Distribution Centre from an 11% baseline to below 7% during a 12-week pilot, using existing order and vehicle-location data.\n\nSCOPE\nRoute optimisation for the Singapore distribution fleet; baseline validation; integration with order and GPS data; weekly performance review.\n\nOUT OF SCOPE\nNationwide rollout, vehicle procurement, consumer-facing applications and automated commercial commitments.\n\nCROSS-BORDER RESPONSIBILITIES\nMeridian provides anonymised data, systems access and local operational ownership. ${startup.name} provides configuration, training, implementation support and weekly progress reporting.\n\nMEASUREMENT & EXIT\nCompare late-delivery percentage against the validated baseline over the agreed 12-week period. Stop if data access, security or operational safety requirements cannot be met.\n\nPOST-POC DECISION\nCommercial decision review within 10 business days of the final measurement.`;
    poc.status = "CharterReview"; poc.charterReviewAt = new Date().toISOString(); syncChallenge(data, poc); recordActivity(data, poc.id, "POC charter revision 1 generated for joint review");
    return { ok: true, message: "Charter generated. Both parties can now review it." };
  });
}
export function approveCharter(party: "corporate" | "startup", pocId = "poc-delivery"): ActionResult {
  return updateData(data => {
    const poc = scopedPoc(data, pocId);
    if (poc.status !== "CharterReview" || !poc.charter) return failure("There is no charter awaiting approval.");
    if (party === "corporate") poc.corporateApproved = true; else poc.startupApproved = true;
    recordActivity(data, poc.id, `${party === "corporate" ? "Meridian Logistics" : "Startup partner"} approved charter revision 1`);
    return { ok: true, message: "Approval recorded. The other party must also approve." };
  });
}
export function editCharter(content: string, pocId = "poc-delivery"): ActionResult {
  return updateData(data => {
    const poc = scopedPoc(data, pocId);
    if (poc.status !== "CharterReview" || content.trim().length < 100 || content.length > 20000) return failure("Only a charter in review with valid content can be edited.");
    poc.charter = content; poc.corporateApproved = false; poc.startupApproved = false;
    recordActivity(data, poc.id, "Charter revision 1 edited; previous approvals reset");
    return { ok: true, message: "Charter changes saved. Both parties must approve the updated content." };
  });
}
export function activatePoc(pocId = "poc-delivery"): ActionResult {
  return updateData(data => {
    const poc = scopedPoc(data, pocId);
    if (poc.status !== "CharterReview" || !poc.corporateApproved || !poc.startupApproved) return failure("Both parties must approve the current charter first.");
    poc.status = "Active"; poc.activatedAt = new Date().toISOString(); syncChallenge(data, poc); recordActivity(data, poc.id, "POC activated with joint charter approval");
    return { ok: true, message: "POC activated. Execution tracking is now live." };
  });
}
export function saveMeetingActions(actions: { title: string; owner: string | null; dueDate: string | null }[], pocId = "poc-delivery", review?: { decisions: string[]; requestedDocuments: string[]; unresolvedIssues: string[]; nextMilestone: string | null; notes: string }): ActionResult {
  return updateData(data => {
    const poc = scopedPoc(data, pocId);
    if (!["Active", "CharterReview", "ResultSubmitted"].includes(poc.status)) return failure("Activate the POC before saving execution actions.");
    data.actions = [...data.actions.filter(action => action.pocId !== pocId), ...actions.map(action => ({ id: crypto.randomUUID(), pocId, title: action.title, owner: action.owner || "Unassigned", dueDate: action.dueDate || "Unscheduled", status: "Open" }))];
    if (review) data.meetings.unshift({ id: crypto.randomUUID(), pocId, notesDigest: createHash("sha256").update(review.notes).digest("hex"), decisions: review.decisions, requestedDocuments: review.requestedDocuments, unresolvedIssues: review.unresolvedIssues, nextMilestone: review.nextMilestone, reviewedAt: new Date().toISOString() });
    recordActivity(data, poc.id, `${actions.length} reviewed meeting actions saved`);
    return { ok: true, message: `${actions.length} reviewed actions and meeting decisions saved to the workspace.` };
  });
}
export function toggleReadiness(key: string, pocId = "poc-delivery") { updateData(data => { const poc = scopedPoc(data, pocId); poc.readiness[key] = !poc.readiness[key]; recordActivity(data, poc.id, "Cross-border readiness checklist updated"); }); }
export function toggleAction(id: string) { updateData(data => { const action = data.actions.find(a => a.id === id); if (action) { action.status = action.status === "Completed" ? "Open" : "Completed"; recordActivity(data, action.pocId, `Action marked ${action.status.toLowerCase()}: ${action.title}`); } }); }
export function makeOverdue(pocId = "poc-delivery") { updateData(data => { const milestone = data.milestones.find(item => item.pocId === pocId); if (milestone) { milestone.dueDate = "2026-10-30"; milestone.status = "In progress"; } recordActivity(data, pocId, "Critical workshop deadline updated for health-rule demonstration", "system"); }); }
export function submitResult(input: unknown, pocId = "poc-delivery"): ActionResult {
  const parsed = resultSchema.safeParse(input);
  if (!parsed.success) return failure("Baseline, target, actual result, unit, measurement period and evidence are required.");
  return updateData(data => {
    const poc = scopedPoc(data, pocId);
    if (poc.status !== "Active") return failure("Only an active POC can submit a result.");
    const value = parsed.data;
    data.evidence.push({ id: crypto.randomUUID(), pocId, reference: value.evidence, description: "POC measurement report and supporting calculation", verified: false });
    data.results[poc.id] = { ...value, commercialStage: "No decision", commercialValue: null, currency: null, commercialEvidence: null, commercialVerified: false, narrative: null };
    poc.status = "ResultSubmitted"; poc.resultSubmittedAt = new Date().toISOString(); syncChallenge(data, poc); recordActivity(data, poc.id, "Measured result and evidence submitted for review");
    return { ok: true, message: "Result submitted for evidence review." };
  });
}
export function reviewResult(pocId = "poc-delivery"): ActionResult {
  return updateData(data => {
    const poc = scopedPoc(data, pocId);
    const evidence = data.evidence.filter(item => item.pocId === pocId);
    if (poc.status !== "ResultSubmitted" || !data.results[poc.id] || !evidence.length) return failure("A measured result and evidence are required.");
    evidence.forEach(e => { e.verified = true; }); poc.status = "Completed"; poc.completedAt = new Date().toISOString(); syncChallenge(data, poc); recordActivity(data, poc.id, "Result evidence reviewed; POC marked completed");
    return { ok: true, message: "Evidence verified. POC completed and dashboard updated." };
  });
}
export function rejectResult(pocId = "poc-delivery"): ActionResult {
  return updateData(data => {
    const poc = scopedPoc(data, pocId);
    if (poc.status !== "ResultSubmitted") return failure("Only a submitted result can be returned for changes.");
    poc.status = "Active"; poc.resultSubmittedAt = null; delete data.results[poc.id];
    data.evidence = data.evidence.filter(item => item.pocId !== pocId);
    syncChallenge(data, poc); recordActivity(data, poc.id, "Result review requested changes; POC returned to Active");
    return { ok: true, message: "Result returned for changes. Commercial progression remains undecided." };
  });
}
export function closePoc(reason: string, pocId = "poc-delivery"): ActionResult {
  return updateData(data => {
    const poc = scopedPoc(data, pocId);
    if (!reason.trim() || reason.trim().length < 5) return failure("Record a closure reason before closing the POC.");
    if (["Completed"].includes(poc.status)) return failure("A completed POC cannot be closed without a POC.");
    poc.status = "Draft"; poc.completedAt = null; poc.closedReason = reason.trim(); poc.closedAt = new Date().toISOString();
    const challenge = data.challenges.find(item => item.id === poc.challengeId);
    if (challenge) challenge.status = "Closed without POC";
    recordActivity(data, poc.id, `POC closed without POC: ${reason.trim()}`);
    return { ok: true, message: "POC closed without POC. The reason is recorded in activity history." };
  });
}
export function saveNarrative(narrative: string, pocId = "poc-delivery"): ActionResult {
  return updateData(data => {
    const result = data.results[pocId];
    if (!result || narrative.length < 10 || narrative.length > 2000) return failure("No valid result narrative can be saved.");
    result.narrative = narrative;
    return { ok: true, message: "Reviewed result narrative saved." };
  });
}
export function advanceCommercial(stage: string, pocId = "poc-delivery", details?: { value: number | null; currency: string | null; evidence: string | null }): ActionResult {
  return updateData(data => {
    const poc = scopedPoc(data, pocId); const result = data.results[poc.id];
    if (poc.status !== "Completed" || !result) return failure("Complete the POC before recording a commercial decision.");
    if (!commercialTransitions[result.commercialStage]?.includes(stage as never)) return failure(`Cannot move from ${result.commercialStage} to ${stage}.`);
    if (stage === "Contract signed" && (!details?.evidence || details.value === null || details.value <= 0 || !details.currency)) return failure("Contract signing requires a value, currency and supporting evidence reference.");
    result.commercialStage = stage as typeof result.commercialStage;
    if (stage === "Contract signed" && details) { result.commercialValue = details.value; result.currency = details.currency; result.commercialEvidence = details.evidence; result.commercialVerified = true; }
    recordActivity(data, poc.id, `Commercial progression updated: ${stage}${result.commercialVerified ? " with verified evidence" : ""}`);
    return { ok: true, message: stage === "Contract signed" ? "Contract recorded with verified evidence. This is independent of technical POC success." : "Commercial progression recorded separately from the POC result." };
  });
}
export function getPocMilestones() { const data = getData(); return data.milestones.filter(m => m.pocId === data.pocs[0].id); }
