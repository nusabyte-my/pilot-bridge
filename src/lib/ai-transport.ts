import { createHash } from "node:crypto";
import { GoogleGenAI } from "@google/genai";
import { recordAiRun } from "./store";
import { promptVersions, schemaVersions, type PromptPurpose } from "./prompts";
import type { SourceFile } from "./ai";

export interface AiDraftResult<T> { draft: T; generatedBy: "Gemma 4" | "Deterministic fallback"; aiRunId: string | null; }
interface GenerateOptions<T> { purpose: PromptPurpose; prompt: string; schema: object; parse: (value: unknown) => T; files?: SourceFile[]; fallback: () => T; }
function digest(value: string) { return createHash("sha256").update(value).digest("hex"); }
function modelName() { return process.env.GEMINI_MODEL || "gemma-4-27b-it"; }

export async function generateAudited<T>({ purpose, prompt, schema, parse, files = [], fallback }: GenerateOptions<T>): Promise<AiDraftResult<T>> {
  const started = Date.now();
  const inputDigest = digest(prompt);
  if (!process.env.GEMINI_API_KEY) {
    recordAiRun({ purpose, promptVersion: promptVersions[purpose], schemaVersion: schemaVersions[purpose], model: modelName(), inputDigest, status: "fallback", attempts: 0, errorCode: "no_api_key", latencyMs: 0 });
    return { draft: fallback(), generatedBy: "Deterministic fallback", aiRunId: null };
  }
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  let attempts = 0; let lastError: unknown;
  while (attempts < 2) {
    attempts++;
    try {
      const corrective = attempts === 2 ? "\n\nYour previous response was invalid. Return only JSON that exactly matches the supplied schema. Use null for unknowns; do not add prose." : "";
      const response = await ai.models.generateContent({ model: modelName(), contents: [{ role: "user", parts: [{ text: prompt + corrective }, ...files.map(file => ({ inlineData: { data: file.base64, mimeType: file.mimeType } }))] }], config: { responseMimeType: "application/json", responseJsonSchema: schema, maxOutputTokens: 4096 } });
      if (!response.text) throw new Error("EMPTY_RESPONSE");
      const parsed = parse(JSON.parse(response.text));
      const aiRunId = crypto.randomUUID();
      recordAiRun({ purpose, promptVersion: promptVersions[purpose], schemaVersion: schemaVersions[purpose], model: modelName(), inputDigest, status: "succeeded", attempts, errorCode: null, latencyMs: Date.now() - started });
      return { draft: parsed, generatedBy: "Gemma 4", aiRunId };
    } catch (error) { lastError = error; }
  }
  recordAiRun({ purpose, promptVersion: promptVersions[purpose], schemaVersion: schemaVersions[purpose], model: modelName(), inputDigest, status: "failed", attempts, errorCode: lastError instanceof Error ? lastError.message.slice(0, 120) : "UNKNOWN", latencyMs: Date.now() - started });
  throw new Error("Gemma could not produce a valid draft. No workflow data was changed. Try again or use the demo draft.");
}
