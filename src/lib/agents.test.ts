import { describe, expect, it } from "vitest";
import { z } from "zod";
const assessment=z.object({capabilityEvidence:z.array(z.string()).max(5),deliveryRisks:z.array(z.string()).max(5),missingEvidence:z.array(z.string()).max(5),firstMeetingQuestions:z.array(z.string()).min(2).max(5),recommendation:z.enum(["Advance","Clarify","Do not advance"])});
describe("multi-agent output contracts",()=>{
  it("rejects fabricated incomplete specialist output",()=>{expect(assessment.safeParse({capabilityEvidence:[],deliveryRisks:[],missingEvidence:[],firstMeetingQuestions:[],recommendation:"Advance"}).success).toBe(false);});
  it("requires at least two meeting questions",()=>{expect(assessment.safeParse({capabilityEvidence:["Profile evidence"],deliveryRisks:[],missingEvidence:[],firstMeetingQuestions:["Q1"],recommendation:"Clarify"}).success).toBe(false);});
  it("rejects an unsupported recommendation",()=>{expect(assessment.safeParse({capabilityEvidence:["Evidence"],deliveryRisks:[],missingEvidence:[],firstMeetingQuestions:["Q1","Q2"],recommendation:"Approved"}).success).toBe(false);});
});
