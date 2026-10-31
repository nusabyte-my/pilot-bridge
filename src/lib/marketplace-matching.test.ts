import { describe, expect, it } from "vitest";
import { matchInvestor } from "./marketplace-matching";
import { marketplaceInvestors, seedData } from "./seed";
const startup=seedData().startups[0];
describe("ALAND-adapted marketplace matching",()=>{
  it("explains a fully weighted strong fit",()=>{const match=matchInvestor(startup,marketplaceInvestors[0]);expect(match.score).toBe(100);expect(match.eligible).toBe(true);expect(match.factors.reduce((sum,f)=>sum+f.score,0)).toBe(100);expect(match.tier).toBe("Strong fit");});
  it("enforces the stage gate",()=>{const match=matchInvestor(startup,marketplaceInvestors[1]);expect(match.eligible).toBe(false);expect(match.factors.find(f=>f.label==="Stage & maturity")?.score).toBeLessThan(20);});
  it("enforces sector eligibility independently of a high score",()=>{const sight=seedData().startups.find(s=>s.id==="startup-sight")!;expect(matchInvestor(sight,marketplaceInvestors[0]).eligible).toBe(false);});
  it("does not claim an investment probability",()=>{const match=matchInvestor(startup,marketplaceInvestors[0]);expect(match.factors.every(f=>f.max>0&&f.reason.length>10)).toBe(true);});
});
