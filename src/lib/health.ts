import type { Milestone, Poc } from "./types";

export function calculateHealth(poc: Poc, milestones: Milestone[], now = new Date()): "On Track" | "At Risk" | "Stalled" | "Completed" {
  if (poc.status === "Completed") return "Completed";
  if (poc.status !== "Active" && poc.status !== "ResultSubmitted") return "On Track";
  const today = now.toISOString().slice(0, 10);
  const overdue = milestones.filter(m => m.pocId === poc.id)
    .filter(m => m.status !== "Completed" && m.dueDate < today);
  const inactivityDays = (now.getTime() - new Date(poc.lastActivityAt).getTime()) / 86400000;
  if (inactivityDays >= 14 || overdue.some(m => m.critical && dateDifference(m.dueDate, today) > 7)) return "Stalled";
  if (overdue.some(m => m.critical)) return "At Risk";
  return "On Track";
}
function dateDifference(before: string, after: string) { return (Date.parse(after) - Date.parse(before)) / 86400000; }
export function nextBestAction(poc: Poc, milestones: Milestone[]): string {
  if (!poc.startupId) return "Compare eligible startups and confirm a POC partner.";
  if (poc.status === "PartnerSelected") return "Generate a shared POC charter for both parties to review.";
  if (poc.status === "CharterReview") return "Review and approve the charter from both organisations to activate the pilot.";
  if (!poc.readiness.dataAccess) return "Resolve data access and residency before the technical workshop.";
  const next = milestones.filter(m => m.status !== "Completed").sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  if (poc.status === "Active" && next) return `Prepare “${next.title}” with ${next.owner} by ${next.dueDate}.`;
  if (poc.status === "ResultSubmitted") return "Review the measured result and supporting evidence.";
  if (poc.status === "Completed") return "Record the commercial decision separately from the technical result.";
  return "Capture the measured outcome and commercial next step.";
}
