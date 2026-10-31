export type ChallengeStatus = "Draft" | "Matching" | "Partner selected" | "Charter review" | "Active" | "Completed" | "Closed without POC";
export type PocStatus = "Draft" | "Matching" | "PartnerSelected" | "CharterReview" | "Active" | "ResultSubmitted" | "Completed";
export type CommercialStage = "No decision" | "Commercial negotiation" | "Contract signed" | "Not proceeding";
export interface Organisation { id: string; name: string; type: "Corporate" | "Startup" | "Investor" | "Programme"; country: string; sector: string; }
export interface User { id: string; organisationId: string; role: "Corporate" | "Startup" | "Programme manager"; name: string; }
export interface MatchRecord { id: string; challengeId: string; startupId: string; criteria: { label: string; score: number; max: number }[]; reasons: string[]; risks: string[]; rank: number; }
export type Health = "On Track" | "At Risk" | "Stalled" | "Completed";

export interface Startup {
  id: string; name: string; country: string; flag: string; sector: string; description: string;
  capabilities: string[]; maturity: string; capacity: string; available: boolean; unavailableReason?: string;
  reasons: string[]; gaps: string[]; initials: string; color: string;
  stage: string; seeking: string; markets: string[]; traction: string; verified: boolean;
}
export interface Investor {
  id: string; name: string; type: string; country: string; sectors: string[]; stages: string[];
  ticketMin: number; ticketMax: number; thesis: string; portfolioSupport: string[]; verified: boolean; initials: string;
}
export interface PocIdea {
  id: string; startupId: string; investorId: string; title: string; thesis: string; scope: string;
  successMetric: string; duration: string; convertedPocId?: string; phases: { phase: string; outcome: string }[]; status: "Idea" | "Shortlisted"; createdAt: string;
}
export interface Introduction { id: string; startupId: string; investorId: string; status: "Requested"; createdAt: string;
}
export interface Challenge {
  id: string; title: string; rawProblem: string; status: ChallengeStatus; country: string; site: string;
  baseline: string | null; target: string | null; unit: string | null; duration: string | null;
  budget: string | null; constraints: string[]; capabilities: string[]; missing: string[]; approved: boolean;
  createdAt: string; pocId: string | null; startupId: string | null; structuredBy: string | null;
}
export interface Milestone { id: string; pocId: string; title: string; owner: string; dueDate: string; critical: boolean; status: string; }
export interface PocAction { id: string; pocId: string; title: string; owner: string; dueDate: string; status: string; }
export interface Poc {
  id: string; challengeId: string; startupId: string | null; status: PocStatus; charter: string | null;
  corporateApproved: boolean; startupApproved: boolean; createdAt: string; partnerSelectedAt: string | null; charterReviewAt: string | null; activatedAt: string | null; resultSubmittedAt: string | null; completedAt: string | null; closedAt?: string | null; closedReason?: string | null; lastActivityAt: string;
  readiness: Record<string, boolean>;
}
export interface Evidence { id: string; pocId: string; reference: string; description: string; verified: boolean; }
export interface Result { baseline: string; target: string; actual: string; unit: string; period: string; testimonial: string; commercialStage: CommercialStage; commercialValue: number | null; currency: string | null; commercialEvidence: string | null; commercialVerified: boolean; narrative: string | null; }
export interface AiRun { id: string; purpose: string; promptVersion: string; schemaVersion: string; model: string; inputDigest: string; status: "succeeded" | "failed" | "fallback"; attempts: number; errorCode: string | null; latencyMs: number; createdAt: string; }
export interface MeetingRecord { id: string; pocId: string; notesDigest: string; decisions: string[]; requestedDocuments: string[]; unresolvedIssues: string[]; nextMilestone: string | null; reviewedAt: string; }
export interface Activity { id: string; pocId: string | null; text: string; timestamp: string; type: string; }
export interface AppData {
  challenges: Challenge[]; startups: Startup[]; pocs: Poc[]; milestones: Milestone[]; actions: PocAction[];
  evidence: Evidence[]; results: Record<string, Result>; activities: Activity[];
  investors: Investor[]; pocIdeas: PocIdea[]; introductions: Introduction[];
  organisations: Organisation[]; users: User[]; matches: MatchRecord[]; aiRuns: AiRun[]; meetings: MeetingRecord[];
}
export type ActionResult = { ok: boolean; message: string };
