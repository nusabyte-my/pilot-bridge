import type { Challenge, Startup } from "./types";

/**
 * Capability overlap is scored against the challenge's own required capabilities, not a fixed
 * delivery capability list, so a traceability challenge cannot rank a route-optimisation startup first.
 */
export function matchCriteria(startup: Omit<Startup, "score">, challenge?: Pick<Challenge, "capabilities" | "country">) {
  const required = challenge?.capabilities?.length ? challenge.capabilities : [];
  const overlap = required.length
    ? required.filter(capability => startup.capabilities.some(owned => owned.toLowerCase() === capability.toLowerCase())).length
    : 0;
  const capability = required.length ? Math.min(40, Math.round((overlap / required.length) * 40)) : 0;
  const sector = challengeSector(required);
  const industry = sector ? (startup.sector === sector ? 20 : sectorAdjacent(startup.sector, sector) ? 12 : 4) : startup.sector === "Logistics intelligence" ? 20 : startup.sector === "Fleet operations" ? 17 : startup.sector === "Mobility systems" ? 15 : startup.sector === "Operations software" ? 8 : 2;
  const maturity = startup.maturity === "Production ready" ? 15 : 8;
  const deployment = challenge?.country ? (startup.markets.includes(challenge.country) || startup.country === challenge.country ? 15 : 8) : startup.country === "Malaysia" || startup.country === "Singapore" ? 15 : 8;
  const availability = startup.available ? 10 : 0;
  return { capability, industry, maturity, deployment, availability, total: capability + industry + maturity + deployment + availability };
}

const SECTOR_HINTS: { sector: string; capabilities: string[] }[] = [
  { sector: "Logistics intelligence", capabilities: ["Route optimisation", "Real-time dispatch", "Fleet analytics", "Order and GPS data integration", "Sensor telemetry", "Delivery tracking", "Cold-chain compliance reporting"] },
  { sector: "Operations software", capabilities: ["Supplier traceability", "Quality intake", "Document evidence capture", "Workflow automation", "Field support"] },
  { sector: "Computer vision", capabilities: ["Computer vision", "Anomaly detection"] },
  { sector: "Mobility systems", capabilities: ["Demand forecasting", "Route optimisation"] },
  { sector: "Fleet operations", capabilities: ["Fleet analytics", "Delivery tracking"] },
];

function challengeSector(capabilities: string[]) {
  let best: { sector: string; hits: number } | null = null;
  for (const hint of SECTOR_HINTS) {
    const hits = capabilities.filter(capability => hint.capabilities.some(known => known.toLowerCase() === capability.toLowerCase())).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { sector: hint.sector, hits };
  }
  return best?.sector ?? null;
}

const ADJACENT: Record<string, string[]> = {
  "Logistics intelligence": ["Fleet operations", "Mobility systems"],
  "Fleet operations": ["Logistics intelligence"],
  "Mobility systems": ["Logistics intelligence"],
  "Operations software": ["Logistics intelligence"],
  "Computer vision": ["Operations software"],
};

function sectorAdjacent(startupSector: string, challengeSectorValue: string) {
  return ADJACENT[startupSector]?.includes(challengeSectorValue) ?? false;
}

export const matchingExplanation = "Capability fit 40 · industry experience 20 · product maturity 15 · deployment support 15 · timeline capacity 10. Capability overlap is scored against this challenge's own required capabilities. Availability is separately enforced.";
