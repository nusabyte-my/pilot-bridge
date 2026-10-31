import { describe, expect, it } from "vitest";
import { seedData } from "./seed";
import { calculateHealth } from "./health";

describe("multi-POC workspace invariants", () => {
  it("calculates health only from milestones belonging to the selected POC", () => {
    const data = seedData();
    const active = { ...data.pocs[0], status: "Active" as const, lastActivityAt: "2026-10-31T00:00:00.000Z" };
    const foreignOverdue = { ...data.milestones[0], pocId: "another-poc", dueDate: "2026-01-01" };
    expect(calculateHealth(active, [foreignOverdue], new Date("2026-10-31"))).toBe("On Track");
  });
});
