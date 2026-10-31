import { describe, expect, it } from "vitest";
import { calculateHealth } from "./health";
import { seedData } from "./seed";

const data = seedData();
const active = { ...data.pocs[0], status: "Active" as const, lastActivityAt: "2026-10-31T00:00:00.000Z" };
const milestone = { ...data.milestones[0], dueDate: "2026-11-06" };
describe("POC health precedence", () => {
  it("keeps future milestones on track", () => expect(calculateHealth(active, [milestone], new Date("2026-10-31T00:00:00Z"))).toBe("On Track"));
  it("marks an overdue critical milestone at risk", () => expect(calculateHealth(active, [{ ...milestone, dueDate: "2026-10-24" }], new Date("2026-10-31T00:00:00Z"))).toBe("At Risk"));
  it("gives severe critical delay stalled precedence", () => expect(calculateHealth(active, [{ ...milestone, dueDate: "2026-10-23" }], new Date("2026-10-31T00:00:00Z"))).toBe("Stalled"));
  it("gives inactivity stalled precedence", () => expect(calculateHealth(active, [milestone], new Date("2026-11-14T00:00:00Z"))).toBe("Stalled"));
  it("does not mark completed POCs as operational risks", () => expect(calculateHealth({ ...active, status: "Completed" }, [{ ...milestone, dueDate: "2026-10-01" }])).toBe("Completed"));
});
