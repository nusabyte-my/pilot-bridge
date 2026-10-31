import { createHash } from "node:crypto";
import { z } from "zod";
import { getLlmClient, llmModel } from "./llm";
import { recordAiRun } from "./store";
import type { Challenge, Poc, Startup } from "./types";

const stringList = (max: number) => z.array(z.string()).transform(items => items.slice(0, max));
const assessmentSchema = z.object({
  capabilityEvidence: stringList(5),
  deliveryRisks: stringList(5),
  missingEvidence: stringList(5),
  firstMeetingQuestions: stringList(5).refine(items => items.length >= 2, "At least two questions required"),
  recommendation: z.enum(["Advance", "Clarify", "Do not advance"]),
});
const pocPlanSchema = z.object({
  thesis: z.string().min(20),
  scope: z.string().min(20),
  outOfScope: z.array(z.string()).min(1).transform(items => items.slice(0, 5)),
  successMetric: z.string().min(5),
  milestones: z.array(z.object({ phase: z.string(), outcome: z.string(), owner: z.string(), dueInDays: z.number().int().positive() })).min(2).transform(items => items.slice(0, 6)),
  risks: stringList(5),
});
const synthesisSchema = z.object({
  summary: z.string().min(20),
  conditions: z.array(z.string()).min(1).transform(items => items.slice(0, 5)),
  questions: z.array(z.string()).min(2).transform(items => items.slice(0, 6)),
  nextAction: z.string().min(10),
  readiness: z.enum(["Ready for first meeting", "Needs clarification", "Not ready"]),
});
export type SpecialistAssessment = z.infer<typeof assessmentSchema>;
export type PocPlanDraft = z.infer<typeof pocPlanSchema>;
export type OrchestratorSynthesis = z.infer<typeof synthesisSchema>;
export interface AgentTrace { agent: string; role: string; status: "succeeded" | "failed" | "fallback"; durationMs: number; output?: unknown; error?: string; }
export interface OrchestrationResult { generatedBy: "deepseek-v4.1-flash" | "Deterministic fallback"; trace: AgentTrace[]; assessment: SpecialistAssessment; plan: PocPlanDraft; synthesis: OrchestratorSynthesis; }

const brief = (challenge: Challenge, startup: Startup, poc: Poc) => JSON.stringify({
  challenge: { title: challenge.title, outcome: challenge.rawProblem, capabilities: challenge.capabilities, constraints: challenge.constraints, baseline: challenge.baseline, target: challenge.target, unit: challenge.unit, duration: challenge.duration, country: challenge.country },
  startup: { name: startup.name, country: startup.country, sector: startup.sector, capabilities: startup.capabilities, maturity: startup.maturity, capacity: startup.capacity, traction: startup.traction, markets: startup.markets, knownGaps: startup.gaps },
  poc: { status: poc.status, readiness: poc.readiness },
});

async function callAgent<T>(agent: string, role: string, instruction: string, schema: z.ZodType<T>, jsonSchema: object, input: string): Promise<{ value: T | null; trace: AgentTrace }> {
  const started = Date.now(); const client = getLlmClient();
  const baseTrace = { agent, role };
  if (!client) {
    recordAiRun({ purpose: `agent:${agent}`, promptVersion: `${agent}-v1`, schemaVersion: `${agent}-v1`, model: llmModel(), inputDigest: createHash("sha256").update(input).digest("hex"), status: "fallback", attempts: 0, errorCode: "no_api_key", latencyMs: 0 });
    return { value: null as T, trace: { ...baseTrace, status: "fallback", durationMs: 0, error: "no_api_key" } };
  }
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: llmModel(), temperature: 0.1, max_tokens: 1400,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `You are the ${role} in a POC due-diligence team. Use ONLY supplied evidence. Never invent capabilities, customers, metrics, funding, or commitments. Return a single JSON object matching this schema exactly: ${JSON.stringify(jsonSchema)}. Unknown evidence belongs in missing fields, never fabricated.` },
          { role: "user", content: `${instruction}\n\nEVIDENCE\n${input}` },
        ],
      });
      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error("EMPTY_RESPONSE");
      const value = schema.parse(JSON.parse(content));
      const durationMs = Date.now() - started;
      recordAiRun({ purpose: `agent:${agent}`, promptVersion: `${agent}-v1`, schemaVersion: `${agent}-v1`, model: llmModel(), inputDigest: createHash("sha256").update(input).digest("hex"), status: "succeeded", attempts: attempt, errorCode: null, latencyMs: durationMs });
      return { value, trace: { ...baseTrace, status: "succeeded", durationMs, output: value } };
    } catch (error) {
      if (attempt === 2) {
        const durationMs = Date.now() - started;
        recordAiRun({ purpose: `agent:${agent}`, promptVersion: `${agent}-v1`, schemaVersion: `${agent}-v1`, model: llmModel(), inputDigest: createHash("sha256").update(input).digest("hex"), status: "failed", attempts: attempt, errorCode: error instanceof Error ? error.message.slice(0, 120) : "UNKNOWN", latencyMs: durationMs });
        return { value: null as T, trace: { ...baseTrace, status: "failed", durationMs, error: error instanceof Error ? error.message.slice(0, 200) : "UNKNOWN" } };
      }
    }
  }
  return { value: null as T, trace: { ...baseTrace, status: "failed", durationMs: Date.now() - started } };
}

const capabilityJson = { type: "object", required: ["capabilityEvidence", "deliveryRisks", "missingEvidence", "firstMeetingQuestions", "recommendation"], properties: { capabilityEvidence: { type: "array", items: { type: "string" } }, deliveryRisks: { type: "array", items: { type: "string" } }, missingEvidence: { type: "array", items: { type: "string" } }, firstMeetingQuestions: { type: "array", items: { type: "string" } }, recommendation: { type: "string", enum: ["Advance", "Clarify", "Do not advance"] } } };
const planJson = { type: "object", required: ["thesis", "scope", "outOfScope", "successMetric", "milestones", "risks"], properties: { thesis: { type: "string" }, scope: { type: "string" }, outOfScope: { type: "array", items: { type: "string" } }, successMetric: { type: "string" }, milestones: { type: "array", items: { type: "object", properties: { phase: { type: "string" }, outcome: { type: "string" }, owner: { type: "string" }, dueInDays: { type: "integer" } } } }, risks: { type: "array", items: { type: "string" } } } };
const synthesisJson = { type: "object", required: ["summary", "conditions", "questions", "nextAction", "readiness"], properties: { summary: { type: "string" }, conditions: { type: "array", items: { type: "string" } }, questions: { type: "array", items: { type: "string" } }, nextAction: { type: "string" }, readiness: { type: "string", enum: ["Ready for first meeting", "Needs clarification", "Not ready"] } } };

export async function orchestratePoc(challenge: Challenge, startup: Startup, poc: Poc): Promise<OrchestrationResult> {
  const input = brief(challenge, startup, poc);
  const [capability, delivery, commercial] = await Promise.all([
    callAgent("capability-scout", "capability evidence analyst", "Assess capability alignment. List only evidence present in the supplied profile. Identify missing proof and 2-5 first-meeting questions.", assessmentSchema, capabilityJson, input),
    callAgent("delivery-risk", "delivery and cross-border risk analyst", "Assess implementation feasibility, data integration, local ownership, timeline and cross-border risks. Do not make health or eligibility decisions.", assessmentSchema, capabilityJson, input),
    callAgent("poc-architect", "POC design specialist", "Draft a bounded 12-week proof-of-concept plan with measurable success criteria, out-of-scope boundaries, milestones with owners and risks.", pocPlanSchema, planJson, input),
  ]);
  const combined = JSON.stringify({ capability: capability.value, delivery: delivery.value, plan: commercial.value, failedAgents: [capability, delivery, commercial].filter(item => !item.value).map(item => item.trace.agent) });
  const synthesis = await callAgent("orchestrator", "orchestrator and sceptical programme manager", "Synthesise the specialist findings into a concise decision brief. Conditions and questions must address the most material evidence gaps. Do not approve a POC or infer commercial success.", synthesisSchema, synthesisJson, combined);
  const fallback = capability.trace.status === "fallback" && delivery.trace.status === "fallback" && commercial.trace.status === "fallback" && synthesis.trace.status === "fallback";
  return {
    generatedBy: fallback ? "Deterministic fallback" : "deepseek-v4.1-flash",
    trace: [capability.trace, delivery.trace, commercial.trace, synthesis.trace],
    assessment: capability.value?.capabilityEvidence?.length ? capability.value : { capabilityEvidence: startup.reasons, deliveryRisks: startup.gaps, missingEvidence: startup.gaps, firstMeetingQuestions: ["Which comparable deployments can you evidence?", "Who owns implementation and data integration?"], recommendation: "Clarify" },
    plan: commercial.value?.thesis ? commercial.value : { thesis: `Validate ${startup.name}’s ${startup.capabilities[0]} capability in a bounded enterprise pilot.`, scope: "One enterprise site, one workflow and a validated baseline.", outOfScope: ["Nationwide rollout", "Unvalidated production data access"], successMetric: challenge.target || "Measured improvement against an approved baseline", milestones: [{ phase: "Align", outcome: "Confirm sponsor, data owner and baseline", owner: "Programme manager", dueInDays: 14 }, { phase: "Prove", outcome: "Run limited-cohort pilot and review evidence weekly", owner: "Delivery owner", dueInDays: 56 }, { phase: "Decide", outcome: "Validate result and agree next step", owner: "Corporate sponsor", dueInDays: 84 }], risks: startup.gaps },
    synthesis: synthesis.value?.summary ? synthesis.value : { summary: "Evidence is sufficient to explore a bounded pilot, subject to confirming data access and delivery ownership.", conditions: ["Confirm data access and residency", "Name the local implementation owner"], questions: ["Which comparable deployments can you evidence?", "Who owns implementation and data integration?"], nextAction: "Schedule a fit and feasibility session before drafting the charter.", readiness: "Needs clarification" },
  };
}
