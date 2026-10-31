import { z } from "zod";

export const structuredChallengeSchema = z.object({
  title: z.string().min(5).max(100),
  outcome: z.string().min(10),
  capabilities: z.array(z.string()).max(8),
  constraints: z.array(z.string()).max(8),
  country: z.string().default("Singapore"),
  site: z.string().nullable(),
  baseline: z.string().nullable(),
  target: z.string().nullable(),
  unit: z.string().nullable(),
  duration: z.string().nullable(),
  budget: z.string().nullable(),
  missing: z.array(z.string()),
  sourceReferences: z.array(z.string()),
});
export const meetingDraftSchema = z.object({
  decisions: z.array(z.string()),
  actions: z.array(z.object({ title: z.string().min(3), owner: z.string().nullable(), dueDate: z.string().nullable() })),
  requestedDocuments: z.array(z.string()),
  unresolvedIssues: z.array(z.string()),
  nextMilestone: z.string().nullable(),
});
export const matchExplanationSchema = z.object({
  startupId: z.string(),
  reasons: z.array(z.string()).min(1).max(4),
  risks: z.array(z.string()).max(4),
  questions: z.array(z.string()).min(1).max(4),
  evidenceGaps: z.array(z.string()).max(4),
});
export const matchExplanationsSchema = z.object({ matches: z.array(matchExplanationSchema).max(3) });
export const introductionPackSchema = z.object({
  subject: z.string().min(3).max(120),
  email: z.string().min(40).max(3000),
  startupSummary: z.string().min(20).max(1200),
  challengeBrief: z.string().min(20).max(1200),
  meetingObjective: z.string().min(10).max(400),
  questions: z.array(z.string()).min(1).max(5),
  nextStep: z.string().min(10).max(400),
});
export const inputSchema = z.object({ problem: z.string().trim().min(20).max(10000) });
export const resultSchema = z.object({ baseline: z.string().min(1), target: z.string().min(1), actual: z.string().min(1), unit: z.string().min(1), period: z.string().min(1), testimonial: z.string().max(1000), evidence: z.string().min(3) });
