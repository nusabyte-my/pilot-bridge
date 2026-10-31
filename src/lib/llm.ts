import OpenAI from "openai";
import { createHash } from "node:crypto";

export type Provider = "gemma" | "deepseek";
export interface ProviderResult { content: string; provider: Provider; model: string; latencyMs: number; }
export const gemmaModel = () => process.env.GEMMA_MODEL || "gemma-4-31b-it";
export const deepseekModel = () => process.env.LITELLM_MODEL || "deepseek-v4.1-flash";
export const deepseekBaseUrl = () => process.env.LITELLM_BASE_URL || "https://litellm.rapidscreen.io/v1";
export function keyFingerprint(value: string | undefined) {
  if (!value) return "unset";
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}
export function providerStatus() {
  return {
    primary: process.env.GEMINI_API_KEY ? { provider: "gemma", model: gemmaModel(), key: keyFingerprint(process.env.GEMINI_API_KEY) } : null,
    fallback: process.env.LITELLM_API_KEY ? { provider: "deepseek", model: deepseekModel(), key: keyFingerprint(process.env.LITELLM_API_KEY) } : null,
  };
}
async function callGemma(system: string, user: string, schema: object): Promise<ProviderResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMMA_NOT_CONFIGURED");
  const started = Date.now();
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({ model: gemmaModel(), contents: [{ role: "user", parts: [{ text: `${system}\n\n${user}` }] }], config: { responseMimeType: "application/json", responseJsonSchema: schema, maxOutputTokens: 4096 } });
  if (!response.text) throw new Error("GEMMA_EMPTY_RESPONSE");
  return { content: response.text, provider: "gemma", model: gemmaModel(), latencyMs: Date.now() - started };
}
async function callDeepSeek(system: string, user: string, schema: object): Promise<ProviderResult> {
  const apiKey = process.env.LITELLM_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_NOT_CONFIGURED");
  const started = Date.now();
  const client = new OpenAI({ apiKey, baseURL: deepseekBaseUrl(), timeout: 45_000, maxRetries: 0 });
  const completion = await client.chat.completions.create({ model: deepseekModel(), temperature: 0.1, max_tokens: 1400, response_format: { type: "json_object" }, messages: [{ role: "system", content: `${system}\n\nReturn a single JSON object matching this schema exactly: ${JSON.stringify(schema)}` }, { role: "user", content: user }] });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("DEEPSEEK_EMPTY_RESPONSE");
  return { content, provider: "deepseek", model: deepseekModel(), latencyMs: Date.now() - started };
}
export async function generateJson(system: string, user: string, schema: object): Promise<ProviderResult> {
  try {
    return await callGemma(system, user, schema);
  } catch (primaryError) {
    try {
      return await callDeepSeek(system, user, schema);
    } catch (fallbackError) {
      const primary = primaryError instanceof Error ? primaryError.message.slice(0, 80) : "GEMMA_FAILED";
      const fallback = fallbackError instanceof Error ? fallbackError.message.slice(0, 80) : "DEEPSEEK_FAILED";
      throw new Error(`All inference providers failed (${primary}; ${fallback}).`);
    }
  }
}
