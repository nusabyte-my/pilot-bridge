import { createHash } from "node:crypto";
import { generateJson, providerStatus } from "./llm";
import { recordAiRun } from "./store";
import { promptVersions, schemaVersions, type PromptPurpose } from "./prompts";
import type { SourceFile } from "./ai";

export interface AiDraftResult<T> { draft: T; generatedBy: "Gemma 4" | "DeepSeek fallback" | "Deterministic fallback"; aiRunId: string | null; }
interface GenerateOptions<T> { purpose: PromptPurpose; prompt: string; schema: object; parse: (value: unknown) => T; files?: SourceFile[]; fallback: () => T; }
function digest(value: string) { return createHash("sha256").update(value).digest("hex"); }
function modelName() { return process.env.GEMMA_MODEL || process.env.GEMINI_MODEL || "gemma-4-31b-it"; }

export async function generateAudited<T>({ purpose, prompt, schema, parse, files = [], fallback }: GenerateOptions<T>): Promise<AiDraftResult<T>> {
  const started = Date.now();
  const inputDigest = digest(prompt);
  const providers = providerStatus();
  if (!providers.primary && !providers.fallback) {
    recordAiRun({ purpose, promptVersion: promptVersions[purpose], schemaVersion: schemaVersions[purpose], model: "unconfigured", inputDigest, status: "fallback", attempts: 0, errorCode: "no_api_key", latencyMs: 0 });
    return { draft: fallback(), generatedBy: "Deterministic fallback", aiRunId: null };
  }
  if (files.length) {
    if (!providers.primary) throw new Error("Document extraction requires the Gemma multimodal provider.");
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({ model: modelName(), contents: [{ role: "user", parts: [{ text: prompt }, ...files.map(file => ({ inlineData: { data: file.base64, mimeType: file.mimeType } }))] }], config: { responseMimeType: "application/json", responseJsonSchema: schema, maxOutputTokens: 4096 } });
    if (!response.text) throw new Error("GEMMA_EMPTY_RESPONSE");
    const draft = parse(JSON.parse(response.text));
    recordAiRun({ purpose, promptVersion: promptVersions[purpose], schemaVersion: schemaVersions[purpose], model: `gemma:${modelName()}`, inputDigest, status: "succeeded", attempts: 1, errorCode: null, latencyMs: Date.now() - started });
    return { draft, generatedBy: "Gemma 4", aiRunId: crypto.randomUUID() };
  }
  let attempts = 0; let lastError: unknown;
  while (attempts < 2) {
    attempts++;
    try {
      const result = await generateJson("You are PilotBridge's structured drafting assistant. Use only supplied evidence; unknown values are null. Return JSON only.", prompt, schema);
      const draft = parse(JSON.parse(result.content));
      recordAiRun({ purpose, promptVersion: promptVersions[purpose], schemaVersion: schemaVersions[purpose], model: `${result.provider}:${result.model}`, inputDigest, status: "succeeded", attempts, errorCode: null, latencyMs: Date.now() - started });
      return { draft, generatedBy: result.provider === "gemma" ? "Gemma 4" : "DeepSeek fallback", aiRunId: crypto.randomUUID() };
    } catch (error) { lastError = error; }
  }
  recordAiRun({ purpose, promptVersion: promptVersions[purpose], schemaVersion: schemaVersions[purpose], model: `${providers.primary?.model || "none"}|${providers.fallback?.model || "none"}`, inputDigest, status: "failed", attempts, errorCode: lastError instanceof Error ? lastError.message.slice(0, 120) : "UNKNOWN", latencyMs: Date.now() - started });
  throw new Error("Inference could not produce a valid draft. No workflow data was changed. Try again or use the demo draft.");
}
