import { describe, expect, it } from "vitest";
import { introductionPackSchema, matchExplanationsSchema, structuredChallengeSchema } from "./schemas";
describe("AI draft contracts",()=>{
  it("preserves unknown challenge values as null",()=>{const draft=structuredChallengeSchema.parse({title:"Measured pilot",outcome:"Reduce delays from an approved baseline.",capabilities:["Routing"],constraints:[],country:"Singapore",site:null,baseline:null,target:null,unit:null,duration:null,budget:null,missing:["Baseline"],sourceReferences:["Problem statement"]});expect(draft.baseline).toBeNull();expect(draft.target).toBeNull();});
  it("requires grounded match evidence and questions",()=>{const parsed=matchExplanationsSchema.safeParse({matches:[{startupId:"startup-routify",reasons:["Direct routing evidence"],risks:[],questions:["Which deployment is comparable?"],evidenceGaps:[]}]});expect(parsed.success).toBe(true);expect(matchExplanationsSchema.safeParse({matches:[{startupId:"x",reasons:[],risks:[],questions:[],evidenceGaps:[]}]}).success).toBe(false);});
  it("rejects an empty introduction pack",()=>{expect(introductionPackSchema.safeParse({subject:"x"}).success).toBe(false);});
});
