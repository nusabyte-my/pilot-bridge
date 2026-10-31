import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { generateAudited } from "./ai-transport";
describe("Gemma transport failure handling",()=>{
  const original=process.env.GEMINI_API_KEY;
  beforeEach(()=>{delete process.env.GEMINI_API_KEY;});
  afterEach(()=>{if(original)process.env.GEMINI_API_KEY=original;});
  it("returns an explicit fallback without a key",async()=>{const result=await generateAudited({purpose:"result",prompt:"test",schema:{type:"object"},parse:v=>v as {narrative:string},fallback:()=>({narrative:"fallback"})});expect(result.generatedBy).toBe("Deterministic fallback");expect(result.draft.narrative).toBe("fallback");expect(result.aiRunId).toBeNull();});
  it("never throws a partial draft when provider is absent",async()=>{const parse=vi.fn();await generateAudited({purpose:"result",prompt:"test",schema:{type:"object"},parse,fallback:()=>({narrative:"fallback"})});expect(parse).not.toHaveBeenCalled();});
});
