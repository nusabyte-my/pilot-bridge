import { describe, expect, it } from "vitest";
import { seedData } from "./seed";
import { commercialTransitions } from "./commercial";
describe("commercial progression independence",()=>{
  it("requires negotiation before signing",()=>{expect(commercialTransitions["No decision"]).not.toContain("Contract signed");expect(commercialTransitions["Commercial negotiation"]).toContain("Contract signed");});
  it("treats signed and not proceeding as terminal",()=>{expect(commercialTransitions["Contract signed"]).toHaveLength(0);expect(commercialTransitions["Not proceeding"]).toHaveLength(0);});
  it("does not infer commercial success from POC completion",()=>{const data=seedData();expect(data.pocs[0].status).not.toBe("Completed");expect(Object.keys(data.results)).toHaveLength(0);});
});
