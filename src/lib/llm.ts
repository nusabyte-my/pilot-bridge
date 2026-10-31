import OpenAI from "openai";

export const llmModel = () => process.env.LITELLM_MODEL || "deepseek-v4.1-flash";
export const llmBaseUrl = () => process.env.LITELLM_BASE_URL || "https://litellm.rapidscreen.io/v1";
export function getLlmClient() {
  const apiKey = process.env.LITELLM_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey, baseURL: llmBaseUrl(), timeout: 45_000, maxRetries: 0 });
}
