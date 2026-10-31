import { describe, expect, it } from "vitest";
import { promptVersions, schemaVersions } from "./prompts";
describe("AI audit contracts",()=>{
  it("versions every prompt and schema",()=>{for(const purpose of Object.keys(promptVersions) as Array<keyof typeof promptVersions>){expect(promptVersions[purpose]).toMatch(/-v\d+$/);expect(schemaVersions[purpose]).toMatch(/-v\d+$/);}});
  it("uses distinct prompt versions",()=>{const values=Object.values(promptVersions);expect(new Set(values).size).toBe(values.length);});
});
