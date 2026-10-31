import type { Startup } from "./types";

export function matchCriteria(startup: Omit<Startup, "score">) {
  const capability = Math.min(40, startup.capabilities.filter(c => ["Route optimisation", "Real-time dispatch", "Fleet analytics", "Delivery tracking", "Order and GPS data integration"].includes(c)).length * 15);
  const industry = startup.sector === "Logistics intelligence" ? 20 : startup.sector === "Fleet operations" ? 17 : startup.sector === "Mobility systems" ? 15 : startup.sector === "Operations software" ? 8 : 2;
  const maturity = startup.maturity === "Production ready" ? 15 : 8;
  const deployment = startup.country === "Malaysia" || startup.country === "Singapore" ? 15 : 8;
  const availability = startup.available ? 10 : 0;
  return { capability, industry, maturity, deployment, availability, total: capability + industry + maturity + deployment + availability };
}
export const matchingExplanation = "Capability fit 40 · industry experience 20 · product maturity 15 · deployment support 15 · timeline capacity 10. Availability is separately enforced.";
