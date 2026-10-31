import { describe, expect, it } from "vitest";
import { seedData } from "./seed";
import { commercialTransitions } from "./commercial";

describe("commercial progression independence", () => {
  it("requires negotiation before signing", () => {
    expect(commercialTransitions["No decision"]).not.toContain("Contract signed");
    expect(commercialTransitions["Commercial negotiation"]).toContain("Contract signed");
  });

  it("treats signed and not proceeding as terminal", () => {
    expect(commercialTransitions["Contract signed"]).toHaveLength(0);
    expect(commercialTransitions["Not proceeding"]).toHaveLength(0);
  });

  it("never records a signed contract without value, currency and evidence", () => {
    for (const result of Object.values(seedData().results)) {
      if (result.commercialStage !== "Contract signed") continue;
      expect(result.commercialValue).toBeGreaterThan(0);
      expect(result.currency).toBeTruthy();
      expect(result.commercialEvidence).toBeTruthy();
      expect(result.commercialVerified).toBe(true);
    }
  });

  it("keeps a technically completed POC commercially undecided", () => {
    const data = seedData();
    const completed = data.pocs.filter(poc => poc.status === "Completed" && data.results[poc.id]);
    expect(completed.length).toBeGreaterThan(0);
    for (const poc of completed) {
      expect(data.results[poc.id].commercialStage).not.toBe("Contract signed");
    }
  });
});
