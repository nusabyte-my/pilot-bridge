import { describe, expect, it } from "vitest";
import { matchCriteria } from "./matching";
import { seedData } from "./seed";

describe("challenge-aware capability matching", () => {
  it("ranks the traceability startup first for the traceability challenge", () => {
    const data = seedData();
    const challenge = data.challenges.find(item => item.id === "challenge-traceability")!;
    const ranked = [...data.startups].sort((a, b) => matchCriteria(b, challenge).total - matchCriteria(a, challenge).total);
    expect(ranked[0].id).toBe("startup-harvest");
    const top = matchCriteria(ranked[0], challenge).capability;
    expect(top).toBeGreaterThan(0);
    for (const other of data.startups) expect(matchCriteria(other, challenge).capability).toBeLessThanOrEqual(top);
  });

  it("scores zero capability overlap for a startup with none of the required capabilities", () => {
    const data = seedData();
    const challenge = data.challenges.find(item => item.id === "challenge-traceability")!;
    const routify = data.startups.find(item => item.id === "startup-routify")!;
    expect(matchCriteria(routify, challenge).capability).toBe(0);
  });

  it("still ranks the route-optimisation startup first for the delivery challenge", () => {
    const data = seedData();
    const challenge = data.challenges.find(item => item.id === "challenge-delivery")!;
    const ranked = [...data.startups].sort((a, b) => matchCriteria(b, challenge).total - matchCriteria(a, challenge).total);
    expect(ranked[0].id).toBe("startup-routify");
  });
});
