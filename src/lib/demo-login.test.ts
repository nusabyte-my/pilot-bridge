import { describe, expect, it } from "vitest";
const enabled = (flag: string | undefined) => flag === "true";
describe("demo login guard",()=>{
  it("is disabled unless explicitly enabled",()=>{expect(enabled(undefined)).toBe(false);expect(enabled("false")).toBe(false);expect(enabled("1")).toBe(false);});
  it("enables only the exact true flag",()=>{expect(enabled("true")).toBe(true);});
});
