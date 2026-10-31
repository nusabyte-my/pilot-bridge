import type { Investor, Startup } from "./types";

export interface MarketplaceMatch {
  score: number; tier: "Strong fit" | "Possible fit" | "Low fit"; eligible: boolean;
  reasons: string[]; gaps: string[];
  factors: { label: string; score: number; max: number; reason: string }[];
}
const sectorAdjacent:Record<string,string[]> = { "Logistics intelligence":["Fleet operations","Mobility systems"], "Fleet operations":["Logistics intelligence"], "Mobility systems":["Logistics intelligence"], "Operations software":["Logistics intelligence"], "Computer vision":[] };
export function matchInvestor(startup:Startup,investor:Investor):MarketplaceMatch {
  const sectorAligned=investor.sectors.includes(startup.sector);
  const adjacent=sectorAdjacent[startup.sector]?.some(s=>investor.sectors.includes(s));
  const stageAligned=investor.stages.includes(startup.stage);
  const markets=startup.markets.filter(m=>m===investor.country||m==="Singapore"&&investor.country==="Singapore");
  const ticket=startup.seeking.includes("100k")?175000:startup.seeking.includes("250k")?375000:750000;
  const ticketAligned=ticket>=investor.ticketMin&&ticket<=investor.ticketMax;
  const eligible=sectorAligned&&stageAligned&&ticketAligned;
  const factors=[
    {label:"Sector thesis",score:sectorAligned?30:adjacent?15:0,max:30,reason:sectorAligned?`${startup.sector} is in ${investor.name}’s stated thesis.`:adjacent?"Adjacent sector experience; direct fit needs validation.":"No direct sector alignment in the published thesis."},
    {label:"Stage & maturity",score:stageAligned?20:startup.stage==="Production ready"?12:5,max:20,reason:stageAligned?`${startup.stage} matches the investor’s preferred stage.`:`${startup.stage} falls outside the preferred stage.`},
    {label:"Geography",score:markets.length?15:5,max:15,reason:markets.length?`${markets.join(" and ")} aligns with the investor’s regional presence.`:"Cross-border support must be established."},
    {label:"Ticket fit",score:ticketAligned?20:0,max:20,reason:ticketAligned?`${startup.seeking} sits within the stated ticket range.`:`${startup.seeking} is outside the stated US$${investor.ticketMin/1000}k–${investor.ticketMax/1000000}m range.`},
    {label:"POC readiness",score:startup.available?15:5,max:15,reason:startup.available?"Startup has capacity for a structured pilot.":"Current delivery capacity may delay a pilot."},
  ];
  const trust=startup.verified&&investor.verified?1:startup.verified||investor.verified?.95:.9;
  const raw=factors.reduce((sum,f)=>sum+f.score,0);
  return {score:Math.round(raw*trust),tier:raw>=70?"Strong fit":raw>=50?"Possible fit":"Low fit",eligible,reasons:factors.filter(f=>f.score>=f.max*.75).map(f=>f.reason),gaps:factors.filter(f=>f.score<f.max*.75).map(f=>f.reason),factors};
}
export function createPocDraft(startup:Startup,investor:Investor){
  return {title:`${startup.name} × ${investor.country} market-entry pilot`,thesis:`Validate whether ${startup.name}’s ${startup.capabilities[0].toLowerCase()} capability can deliver a measurable operational improvement with an enterprise partner in ${startup.markets[0]}.`,scope:`One enterprise site, one operational workflow, and a defined baseline. No nationwide rollout or investment commitment.`,successMetric:startup.sector==="Computer vision"?"Reduce manual inspection time by 20% against a validated baseline":"Reduce late deliveries from 11% to below 7% over the pilot period",duration:"12 weeks",phases:[{phase:"Weeks 1–2 · Align",outcome:"Confirm enterprise sponsor, data access, baseline and pilot owner."},{phase:"Weeks 3–8 · Prove",outcome:"Deploy with a limited cohort; review operational evidence weekly."},{phase:"Weeks 9–12 · Decide",outcome:"Validate measured result and agree a commercial or learning next step."}]};
}
