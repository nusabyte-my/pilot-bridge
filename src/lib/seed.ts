import type { AppData, Challenge } from "./types";

const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
const daysAgoDate = (days: number) => new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
const daysAhead = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
const sha = (seed: string) => seed.repeat(64).slice(0, 64);

export const demoChallenge: Challenge = {
  id: "challenge-delivery", title: "Last-Mile Delivery Optimisation", rawProblem: "We want to reduce late deliveries from an 11% baseline to below 7% during a 12-week pilot at our Singapore distribution centre, using existing order and vehicle-location data.",
  status: "Matching", country: "Singapore", site: "Singapore Distribution Centre", baseline: "11%", target: "Below 7%", unit: "Late deliveries (%)", duration: "12 weeks", budget: null,
  constraints: ["Use existing order management systems", "Deploy at Singapore distribution centre"], capabilities: ["Route optimisation", "Real-time dispatch", "Order and GPS data integration"], missing: ["Indicative budget", "Data access and residency owner", "Final measurement method"], approved: true, createdAt: daysAgo(38), pocId: "poc-delivery", startupId: null, structuredBy: "Demo challenge",
};

export const marketplaceInvestors = [
  { id: "investor-archipelago", name: "Archipelago Ventures", type: "Early-stage VC", country: "Singapore", sectors: ["Logistics intelligence", "Fleet operations", "Mobility systems"], stages: ["Early production", "Production ready"], ticketMin: 250000, ticketMax: 1000000, thesis: "B2B infrastructure that makes ASEAN supply chains more efficient.", portfolioSupport: ["Corporate introductions", "Singapore market entry", "Pilot design"], verified: true, initials: "AV" },
  { id: "investor-southern", name: "Southern Cross Capital", type: "Corporate venture", country: "Malaysia", sectors: ["Logistics intelligence", "Fleet operations", "Operations software"], stages: ["Production ready"], ticketMin: 500000, ticketMax: 2000000, thesis: "Enterprise operations platforms with validated regional demand.", portfolioSupport: ["Enterprise procurement", "Regional distribution"], verified: true, initials: "SC" },
  { id: "investor-impact", name: "Southeast Impact Fund", type: "Impact investor", country: "Indonesia", sectors: ["Mobility systems", "Computer vision", "Logistics intelligence"], stages: ["Early production"], ticketMin: 100000, ticketMax: 500000, thesis: "Measurable efficiency and safer industrial operations across emerging ASEAN.", portfolioSupport: ["Impact measurement", "Local implementation partners"], verified: false, initials: "SI" },
];

export const demoStartups = [
  { id: "startup-routify", name: "Routify AI", country: "Malaysia", flag: "🇲🇾", sector: "Logistics intelligence", description: "Dynamic route planning for urban delivery fleets.", capabilities: ["Route optimisation", "Real-time dispatch", "Fleet analytics"], maturity: "Production ready", capacity: "Available for 12-week pilot", available: true, reasons: ["Direct route-optimisation capability", "Dedicated Singapore implementation team", "Supports order and GPS data ingestion"], gaps: ["Confirm vehicle-location API compatibility"], initials: "RO", color: "#e8e6ff", stage: "Early production", seeking: "US$250k–500k", markets: ["Singapore", "Malaysia"], traction: "3 logistics pilots · 2 production deployments", verified: true },
  { id: "startup-fleetly", name: "Fleetly", country: "Malaysia", flag: "🇲🇾", sector: "Fleet operations", description: "Fleet visibility and delivery intelligence for ASEAN operators.", capabilities: ["Fleet analytics", "Delivery tracking"], maturity: "Production ready", capacity: "Committed to an active POC", available: false, unavailableReason: "In active POC until December 2026", reasons: ["Strong regional fleet experience"], gaps: ["No capacity for this timeline"], initials: "FL", color: "#fff0d9", stage: "Production ready", seeking: "US$500k–1m", markets: ["Malaysia", "Singapore"], traction: "12 fleet operators · 4,000 connected vehicles", verified: true },
  { id: "startup-nexus", name: "Nexus Mobility", country: "Indonesia", flag: "🇮🇩", sector: "Mobility systems", description: "Enterprise transport and demand prediction platform.", capabilities: ["Demand forecasting", "Route optimisation"], maturity: "Early production", capacity: "Available from November", available: true, reasons: ["Relevant optimisation engine", "Bahasa and English implementation support"], gaps: ["No demonstrated order-system integration", "Limited Singapore deployments"], initials: "NM", color: "#dff5eb", stage: "Early production", seeking: "US$100k–250k", markets: ["Indonesia", "Singapore"], traction: "2 paid pilots · 18% route efficiency gain", verified: false },
  { id: "startup-locus", name: "LocusWorks", country: "Vietnam", flag: "🇻🇳", sector: "Operations software", description: "Regional workflow automation and field operations.", capabilities: ["Workflow automation", "Field support"], maturity: "Production ready", capacity: "Regional team available", available: true, reasons: ["Strong cross-border support"], gaps: ["Limited logistics case studies"], initials: "LW", color: "#e2efff", stage: "Production ready", seeking: "US$500k–1m", markets: ["Vietnam", "Singapore"], traction: "8 enterprise customers · 3 ASEAN markets", verified: true },
  { id: "startup-sight", name: "Sightline", country: "Thailand", flag: "🇹🇭", sector: "Computer vision", description: "Visual inspection for industrial environments.", capabilities: ["Computer vision", "Anomaly detection"], maturity: "Early production", capacity: "Available", available: true, reasons: ["Relevant real-time AI capability"], gaps: ["Poor capability fit for route optimisation"], initials: "SL", color: "#ffe9e8", stage: "Early production", seeking: "US$100k–250k", markets: ["Thailand"], traction: "2 manufacturing pilots · early revenue", verified: false },
  { id: "startup-coldchain", name: "ColdChain IQ", country: "Singapore", flag: "🇸🇬", sector: "Logistics intelligence", description: "Cold-chain telemetry and excursion prevention for pharmaceutical logistics.", capabilities: ["Sensor telemetry", "Anomaly detection", "Fleet analytics"], maturity: "Production ready", capacity: "Available for 10-week pilot", available: true, reasons: ["Direct cold-chain excursion capability", "Singapore-based engineering team", "Existing pharmaceutical compliance evidence"], gaps: ["No integration with the warehouse management system yet"], initials: "CC", color: "#dff0f7", stage: "Production ready", seeking: "US$500k–1m", markets: ["Singapore", "Malaysia", "Thailand"], traction: "6 pharma distributors · 1,200 temperature-controlled shipments", verified: true },
  { id: "startup-harvest", name: "HarvestLink", country: "Vietnam", flag: "🇻🇳", sector: "Operations software", description: "Supplier traceability and quality intake for food manufacturing.", capabilities: ["Supplier traceability", "Quality intake", "Workflow automation"], maturity: "Early production", capacity: "Available from January", available: true, reasons: ["Direct supplier traceability capability", "Two Vietnamese food manufacturers live"], gaps: ["No Halal certification workflow yet", "Limited Bahasa Indonesia support"], initials: "HL", color: "#eef7e2", stage: "Early production", seeking: "US$250k–500k", markets: ["Vietnam", "Malaysia"], traction: "2 food manufacturers · 340 suppliers onboarded", verified: false },
];

const charter = (startupName: string, country: string, objective: string, scope: string) => `POC CHARTER · ${startupName}

PARTICIPANTS
Meridian Logistics (Singapore) and ${startupName} (${country}). Corporate sponsor: Daniel Tan. Delivery owners: Aisha Rahman and the ${startupName} implementation lead.

PILOT OBJECTIVE
${objective}

SCOPE
${scope}

OUT OF SCOPE
Nationwide rollout, hardware procurement, consumer-facing applications and automated commercial commitments.

CROSS-BORDER RESPONSIBILITIES
Meridian provides anonymised operational data and named delivery owners. ${startupName} provides implementation engineers, weekly reporting and evidence of comparable deployments. Both parties review evidence weekly.

MEASUREMENT
Baseline is validated in the first two weeks and cannot be revised after week four. Reported results require a supporting measurement reference.

COMMERCIAL BOUNDARY
This charter creates no commercial commitment. Contract signing is recorded separately and requires an explicit value, currency and evidence reference.

APPROVALS
Corporate sponsor: Daniel Tan
Startup lead: ${startupName} founder`;

export function seedData(): AppData {
  return {
    challenges: [
      demoChallenge,
      {
        id: "challenge-coldchain", title: "Cold-Chain Excursion Reduction", rawProblem: "Temperature excursions on pharmaceutical shipments from our Singapore hub reached 4.2% of consignments last quarter. We need to get below 1.5% within a 10-week pilot without replacing existing sensor hardware.",
        status: "Completed", country: "Singapore", site: "Singapore Cold-Chain Hub", baseline: "4.2%", target: "Below 1.5%", unit: "Excursion rate (%)", duration: "10 weeks", budget: "US$120,000", approved: true, createdAt: daysAgo(126), pocId: "poc-coldchain", startupId: "startup-coldchain", structuredBy: "Gemma 4 (gemma-4-31b-it)",
        constraints: ["Use existing sensor hardware", "Malaysian consignments must stay in-country for processing"], capabilities: ["Sensor telemetry", "Anomaly detection", "Cold-chain compliance reporting"], missing: [],
      },
      {
        id: "challenge-traceability", title: "Supplier Traceability for Food Manufacturing", rawProblem: "We cannot trace raw ingredient batches across 340 suppliers in under 48 hours, which blocks our Halal recertification. Target is full traceability within 6 hours across a 14-week pilot.",
        status: "Charter review", country: "Malaysia", site: "Johor Food Manufacturing Plant", baseline: "48 hours", target: "Under 6 hours", unit: "Batch trace time (hours)", duration: "14 weeks", budget: "US$85,000", approved: true, createdAt: daysAgo(61), pocId: "poc-traceability", startupId: "startup-harvest", structuredBy: "Gemma 4 (gemma-4-31b-it)",
        constraints: ["Halal certification evidence required", "Suppliers cannot be forced onto new hardware"], capabilities: ["Supplier traceability", "Quality intake", "Document evidence capture"], missing: ["Halal certification workflow owner"],
      },
      {
        id: "challenge-demand", title: "Predictive Demand Forecasting", rawProblem: "Forecast error on our Indonesian distribution network sits at 23%, driving both stockouts and excess holding cost. We want a 12-week pilot targeting error below 15% using three years of historical order data.",
        status: "Active", country: "Indonesia", site: "Jakarta Distribution Network", baseline: "23%", target: "Below 15%", unit: "Forecast error (MAPE %)", duration: "12 weeks", budget: "US$95,000", approved: true, createdAt: daysAgo(88), pocId: "poc-demand", startupId: "startup-nexus", structuredBy: "Gemma 4 (gemma-4-31b-it)",
        constraints: ["Historical data stays within Indonesia", "No change to the ERP system"], capabilities: ["Demand forecasting", "Route optimisation"], missing: [],
      },
      {
        id: "challenge-inspection", title: "Packaging Defect Detection", rawProblem: "Manual packaging inspection lets through 5.4% defective cartons, causing downstream returns and rework across our Thai contract manufacturer.",
        status: "Active", country: "Thailand", site: "Bangkok contract packaging line", baseline: "5.4%", target: "Below 2.0%", unit: "Defective cartons (%)", duration: "8 weeks", budget: "US$60,000", approved: true, createdAt: daysAgo(74), pocId: "poc-inspection", startupId: "startup-sight", structuredBy: "Gemma 4 (gemma-4-31b-it)",
        constraints: ["Camera hardware must be supplied by the startup", "Line cannot stop for more than 30 minutes per change"], capabilities: ["Computer vision", "Anomaly detection"], missing: [],
      },
      {
        id: "challenge-warehouse", title: "Warehouse Receiving Accuracy", rawProblem: "Manual goods-receipt checks miss roughly 3.1% of mislabelled pallets, creating downstream inventory variance across three Malaysian warehouses.",
        status: "Closed without POC", country: "Malaysia", site: "Penang and Johor warehouses", baseline: "3.1%", target: "Below 0.8%", unit: "Mislabelled pallets (%)", duration: null, budget: null, approved: true, createdAt: daysAgo(150), pocId: "poc-warehouse", startupId: null, structuredBy: "Gemma 4 (gemma-4-31b-it)",
        constraints: ["No new hardware in year one"], capabilities: ["Computer vision", "Anomaly detection"], missing: ["Site owner", "Hardware funding decision"],
      },
      {
        id: "challenge-returns", title: "Reverse Logistics Cost Reduction", rawProblem: "We want to cut the cost of processing returned goods from S$18.40 to below S$12.00 per unit within a 16-week pilot covering Singapore and Johor Bahru.",
        status: "Draft", country: "Singapore", site: "Singapore returns centre", baseline: "S$18.40", target: "Below S$12.00", unit: "Cost per returned unit (S$)", duration: "16 weeks", budget: null, approved: false, createdAt: daysAgo(6), pocId: "poc-returns", startupId: null, structuredBy: null,
        constraints: [], capabilities: [], missing: ["Problem statement", "Baseline owner", "Measurement method"],
      },
    ],
    investors: marketplaceInvestors,
    pocIdeas: [
      {
        id: "idea-routify-archipelago", startupId: "startup-routify", investorId: "investor-archipelago", title: "Routify AI × Singapore market-entry pilot", thesis: "Validate whether Routify AI’s route optimisation capability can deliver a measurable operational improvement with an enterprise partner in Singapore.",
        scope: "One enterprise site, one operational workflow, and a defined baseline. No nationwide rollout or investment commitment.", successMetric: "Reduce late deliveries from 11% to below 7% over the pilot period", duration: "12 weeks",
        phases: [{ phase: "Weeks 1–2 · Align", outcome: "Confirm enterprise sponsor, data access, baseline and pilot owner." }, { phase: "Weeks 3–8 · Prove", outcome: "Deploy with a limited fleet cohort and review evidence weekly." }, { phase: "Weeks 9–12 · Decide", outcome: "Validate the measured result and agree the commercial next step." }],
        status: "Shortlisted", createdAt: daysAgo(24),
      },
      {
        id: "idea-coldchain-southern", startupId: "startup-coldchain", investorId: "investor-southern", title: "ColdChain IQ × Malaysia expansion pilot", thesis: "Validate whether ColdChain IQ’s excursion prevention telemetry can reduce pharmaceutical cold-chain losses for a Malaysian distributor.",
        scope: "One distribution hub, existing sensors only, with a validated excursion baseline.", successMetric: "Reduce excursion rate from 4.2% to below 1.5%", duration: "10 weeks",
        phases: [{ phase: "Weeks 1–2 · Align", outcome: "Confirm sensor compatibility and data residency boundary." }, { phase: "Weeks 3–7 · Prove", outcome: "Run parallel monitoring against the existing process." }, { phase: "Weeks 8–10 · Decide", outcome: "Review excursion evidence and commercial terms." }],
        status: "Idea", createdAt: daysAgo(11),
      },
    ],
    introductions: [
      { id: "intro-routify-archipelago", startupId: "startup-routify", investorId: "investor-archipelago", status: "Requested", createdAt: daysAgo(9) },
      { id: "intro-coldchain-southern", startupId: "startup-coldchain", investorId: "investor-southern", status: "Requested", createdAt: daysAgo(4) },
    ],
    aiRuns: [
      { id: "run-1", purpose: "structure", promptVersion: "structure-v3", schemaVersion: "structured-challenge-v2", model: "gemma:gemma-4-31b-it", inputDigest: sha("a1"), status: "succeeded", attempts: 1, errorCode: null, latencyMs: 2140, createdAt: daysAgo(126) },
      { id: "run-2", purpose: "agent:capability-scout", promptVersion: "capability-scout-v1", schemaVersion: "capability-scout-v1", model: "gemma:gemma-4-31b-it", inputDigest: sha("b2"), status: "succeeded", attempts: 1, errorCode: null, latencyMs: 1620, createdAt: daysAgo(125) },
      { id: "run-3", purpose: "agent:delivery-risk", promptVersion: "delivery-risk-v1", schemaVersion: "delivery-risk-v1", model: "deepseek:deepseek-v4.1-flash", inputDigest: sha("c3"), status: "succeeded", attempts: 2, errorCode: null, latencyMs: 3410, createdAt: daysAgo(125) },
      { id: "run-4", purpose: "agent:poc-architect", promptVersion: "poc-architect-v1", schemaVersion: "poc-architect-v1", model: "gemma:gemma-4-31b-it", inputDigest: sha("d4"), status: "succeeded", attempts: 1, errorCode: null, latencyMs: 2880, createdAt: daysAgo(125) },
      { id: "run-5", purpose: "agent:orchestrator", promptVersion: "orchestrator-v1", schemaVersion: "orchestrator-v1", model: "gemma:gemma-4-31b-it", inputDigest: sha("e5"), status: "succeeded", attempts: 1, errorCode: null, latencyMs: 1975, createdAt: daysAgo(125) },
      { id: "run-6", purpose: "explain-matches", promptVersion: "explain-matches-v2", schemaVersion: "match-explanation-v2", model: "deepseek:deepseek-v4.1-flash", inputDigest: sha("f6"), status: "succeeded", attempts: 1, errorCode: null, latencyMs: 1290, createdAt: daysAgo(88) },
      { id: "run-7", purpose: "meeting", promptVersion: "meeting-v2", schemaVersion: "meeting-actions-v2", model: "gemma:gemma-4-31b-it", inputDigest: sha("g7"), status: "succeeded", attempts: 1, errorCode: null, latencyMs: 1760, createdAt: daysAgo(104) },
      { id: "run-8", purpose: "structure", promptVersion: "structure-v3", schemaVersion: "structured-challenge-v2", model: "gemma:gemma-4-31b-it", inputDigest: sha("h8"), status: "failed", attempts: 2, errorCode: "provider returned HTTP 500", latencyMs: 15400, createdAt: daysAgo(74) },
      { id: "run-9", purpose: "structure", promptVersion: "structure-v3", schemaVersion: "structured-challenge-v2", model: "deepseek:deepseek-v4.1-flash", inputDigest: sha("i9"), status: "succeeded", attempts: 1, errorCode: null, latencyMs: 2380, createdAt: daysAgo(74) },
      { id: "run-10", purpose: "narrative", promptVersion: "narrative-v1", schemaVersion: "result-narrative-v1", model: "gemma:gemma-4-31b-it", inputDigest: sha("j0"), status: "succeeded", attempts: 1, errorCode: null, latencyMs: 1490, createdAt: daysAgo(18) },
      { id: "run-11", purpose: "introduction", promptVersion: "introduction-v1", schemaVersion: "introduction-pack-v1", model: "gemma:gemma-4-31b-it", inputDigest: sha("k1"), status: "succeeded", attempts: 1, errorCode: null, latencyMs: 1310, createdAt: daysAgo(9) },
      { id: "run-12", purpose: "explain-matches", promptVersion: "explain-matches-v2", schemaVersion: "match-explanation-v2", model: "gemma:gemma-4-31b-it", inputDigest: sha("l2"), status: "fallback", attempts: 0, errorCode: "no_api_key", latencyMs: 0, createdAt: daysAgo(6) },
    ],
    meetings: [
      { id: "meeting-1", pocId: "poc-coldchain", notesDigest: sha("m1"), decisions: ["Keep existing sensor hardware for the pilot", "Malaysian consignment data stays in-country", "Weekly excursion review every Tuesday"], requestedDocuments: ["Sensor calibration certificates", "Q3 excursion incident log"], unresolvedIssues: ["Which team owns the compliance evidence pack?"], nextMilestone: "Baseline validation", reviewedAt: daysAgo(104) },
      { id: "meeting-2", pocId: "poc-coldchain", notesDigest: sha("m2"), decisions: ["Baseline confirmed at 4.2% across 1,180 consignments", "Excursion definition aligned to the pharmaceutical SLA"], requestedDocuments: ["Week 4 excursion report"], unresolvedIssues: ["Cold-room door sensor drift on two units"], nextMilestone: "Mid-pilot performance review", reviewedAt: daysAgo(88) },
      { id: "meeting-3", pocId: "poc-demand", notesDigest: sha("m3"), decisions: ["Historical data remains inside Indonesia", "Forecast error measured weekly on a fixed SKU set"], requestedDocuments: ["Three-year order history extract"], unresolvedIssues: ["No agreed treatment for promotional spikes"], nextMilestone: "Baseline validation", reviewedAt: daysAgo(52) },
      { id: "meeting-4", pocId: "poc-traceability", notesDigest: sha("m4"), decisions: ["Trace target confirmed at 6 hours", "Supplier onboarding limited to the 40 highest-risk suppliers"], requestedDocuments: ["Supplier master list", "Halal certification register"], unresolvedIssues: ["No named owner for the Halal evidence workflow"], nextMilestone: "Charter approval", reviewedAt: daysAgo(28) },
    ],
    agentBriefs: [
      {
        id: "brief-1", pocId: "poc-coldchain", startupId: "startup-coldchain", challengeId: "challenge-coldchain", generatedBy: "Gemma 4 (gemma-4-31b-it)", reviewStatus: "Approved", reviewedBy: "Aisha Rahman", reviewedAt: daysAgo(124), createdAt: daysAgo(125),
        trace: [
          { agent: "capability-scout", role: "capability evidence analyst", status: "succeeded", durationMs: 1620 },
          { agent: "delivery-risk", role: "delivery and cross-border risk analyst", status: "succeeded", durationMs: 3410 },
          { agent: "poc-architect", role: "POC design specialist", status: "succeeded", durationMs: 2880 },
          { agent: "orchestrator", role: "orchestrator and sceptical programme manager", status: "succeeded", durationMs: 1975 },
        ],
        assessment: { capabilityEvidence: ["Six pharmaceutical distributors already use the excursion telemetry product", "1,200 temperature-controlled shipments monitored in production", "Existing compliance reporting covers pharmaceutical SLAs"], deliveryRisks: ["Two cold-room sensors show drift that could distort the baseline", "Malaysian consignment data must remain in-country for processing"], missingEvidence: ["No documented integration with the current warehouse management system"], firstMeetingQuestions: ["Which comparable pharmaceutical deployments can you evidence with measured excursion reductions?", "Who owns sensor calibration on your engineering team during the pilot?", "How is Malaysian consignment data kept in-country while still reporting to the Singapore hub?"], recommendation: "Advance" },
        plan: { thesis: "Prove that existing ColdChain IQ telemetry can cut pharmaceutical excursions below 1.5% without new hardware.", scope: "One Singapore cold-chain hub, existing sensors, 10-week parallel monitoring against the current process.", outOfScope: ["Hardware replacement", "Nationwide rollout", "Automated commercial commitments"], successMetric: "Excursion rate below 1.5% across the pilot period", milestones: [{ phase: "Align", outcome: "Confirm sensor compatibility, residency boundary and baseline", owner: "Aisha Rahman", dueInDays: 14 }, { phase: "Prove", outcome: "Run parallel monitoring and weekly excursion review", owner: "Delivery owner", dueInDays: 49 }, { phase: "Decide", outcome: "Validate measured excursion evidence and commercial terms", owner: "Daniel Tan", dueInDays: 70 }], risks: ["Sensor drift on two cold-room units", "Residency review could delay data processing"] },
        synthesis: { summary: "Capability evidence is strong and the pilot is bounded, but sensor drift and Malaysian data residency must be resolved before the baseline is frozen.", conditions: ["Confirm in-country processing for Malaysian consignments", "Recalibrate the two drifting cold-room sensors before baseline validation"], questions: ["What is the fallback if a sensor goes offline mid-consignment?", "Which evidence pack will support the final commercial decision?"], nextAction: "Freeze the baseline only after sensor recalibration is signed off.", readiness: "Ready for first meeting" },
      },
      {
        id: "brief-2", pocId: "poc-traceability", startupId: "startup-harvest", challengeId: "challenge-traceability", generatedBy: "DeepSeek fallback (deepseek-v4.1-flash)", reviewStatus: "Draft", reviewedBy: null, reviewedAt: null, createdAt: daysAgo(29),
        trace: [
          { agent: "capability-scout", role: "capability evidence analyst", status: "succeeded", durationMs: 2210 },
          { agent: "delivery-risk", role: "delivery and cross-border risk analyst", status: "succeeded", durationMs: 3050 },
          { agent: "poc-architect", role: "POC design specialist", status: "succeeded", durationMs: 2760 },
          { agent: "orchestrator", role: "orchestrator and sceptical programme manager", status: "succeeded", durationMs: 1880 },
        ],
        assessment: { capabilityEvidence: ["340 suppliers already onboarded on the traceability product", "Two Vietnamese food manufacturers in production"], deliveryRisks: ["Suppliers cannot be forced onto new hardware, so intake must stay document-based", "No Halal certification workflow exists in the product today"], missingEvidence: ["No evidence of a Halal-compliant audit trail", "No Bahasa Indonesia supplier support"], firstMeetingQuestions: ["Can you evidence a Halal-compliant audit trail from an existing deployment?", "How do suppliers without smartphones submit batch documents?"], recommendation: "Clarify" },
        plan: { thesis: "Test whether document-based supplier intake can reach 6-hour batch traceability across the highest-risk supplier cohort.", scope: "One Johor plant, 40 highest-risk suppliers, document-based intake only.", outOfScope: ["Supplier hardware rollout", "Halal certification itself", "Full 340-supplier coverage"], successMetric: "Batch trace time under 6 hours for the pilot cohort", milestones: [{ phase: "Align", outcome: "Confirm supplier cohort and evidence format", owner: "Aisha Rahman", dueInDays: 14 }, { phase: "Prove", outcome: "Run trace drills on 40 suppliers", owner: "Delivery owner", dueInDays: 63 }, { phase: "Decide", outcome: "Review trace evidence and Halal readiness", owner: "Daniel Tan", dueInDays: 98 }], risks: ["Halal evidence gap could block recertification", "Low supplier digital literacy"] },
        synthesis: { summary: "The traceability mechanism is credible, but Halal evidence ownership is unresolved and could invalidate the pilot's purpose.", conditions: ["Name a Halal evidence workflow owner before activation", "Confirm suppliers can submit documents without new hardware"], questions: ["Who signs off Halal compliance evidence in the pilot?", "What happens when a supplier submits a scanned document with no metadata?"], nextAction: "Resolve Halal evidence ownership before charter approval.", readiness: "Needs clarification" },
      },
      {
        id: "brief-3", pocId: "poc-demand", startupId: "startup-nexus", challengeId: "challenge-demand", generatedBy: "Gemma 4 (gemma-4-31b-it)", reviewStatus: "Rejected", reviewedBy: "Aisha Rahman", reviewedAt: daysAgo(70), createdAt: daysAgo(71),
        trace: [
          { agent: "capability-scout", role: "capability evidence analyst", status: "succeeded", durationMs: 1740 },
          { agent: "delivery-risk", role: "delivery and cross-border risk analyst", status: "failed", durationMs: 9000, error: "Inference could not produce a valid draft. No workflow data was changed." },
          { agent: "poc-architect", role: "POC design specialist", status: "succeeded", durationMs: 2610 },
          { agent: "orchestrator", role: "orchestrator and sceptical programme manager", status: "succeeded", durationMs: 1830 },
        ],
        assessment: { capabilityEvidence: ["Two paid pilots with measured route efficiency gains", "Demand forecasting engine in production in Indonesia"], deliveryRisks: ["No demonstrated order-system integration"], missingEvidence: ["Delivery-risk agent failed; integration risk is unassessed"], firstMeetingQuestions: ["Which Indonesian distributors can you name as forecasting references?"], recommendation: "Clarify" },
        plan: { thesis: "Test forecast accuracy improvement on three years of historical Indonesian order data.", scope: "One Jakarta distribution network, fixed SKU set, weekly error measurement.", outOfScope: ["ERP replacement", "Nationwide rollout"], successMetric: "Forecast error below 15% MAPE", milestones: [{ phase: "Align", outcome: "Confirm SKU set and data extract", owner: "Aisha Rahman", dueInDays: 14 }, { phase: "Prove", outcome: "Run weekly forecast comparison", owner: "Delivery owner", dueInDays: 56 }, { phase: "Decide", outcome: "Review measured error and commercial terms", owner: "Daniel Tan", dueInDays: 84 }], risks: ["Promotional spikes are unmodelled"] },
        synthesis: { summary: "The delivery-risk agent did not return a valid assessment, so integration risk is unassessed. The brief is incomplete.", conditions: ["Re-run delivery-risk assessment before relying on this brief"], questions: ["How will promotional spikes be handled in the forecast?"], nextAction: "Re-generate the brief; do not rely on an incomplete assessment.", readiness: "Not ready" },
      },
    ],
    organisations: [
      { id: "org-meridian", name: "Meridian Logistics", type: "Corporate", country: "Singapore", sector: "Logistics" },
      { id: "org-coldchain", name: "ColdChain IQ", type: "Startup", country: "Singapore", sector: "Logistics intelligence" },
      { id: "org-harvest", name: "HarvestLink", type: "Startup", country: "Vietnam", sector: "Operations software" },
      { id: "org-nexus", name: "Nexus Mobility", type: "Startup", country: "Indonesia", sector: "Mobility systems" },
      { id: "org-sight", name: "Sightline", type: "Startup", country: "Thailand", sector: "Computer vision" },
      ...marketplaceInvestors.map(investor => ({ id: investor.id, name: investor.name, type: "Investor" as const, country: investor.country, sector: "Investment" })),
    ],
    users: [
      { id: "user-aisha", organisationId: "org-meridian", role: "Programme manager", name: "Aisha Rahman" },
      { id: "user-daniel", organisationId: "org-meridian", role: "Corporate", name: "Daniel Tan" },
      { id: "user-mei", organisationId: "org-coldchain", role: "Startup", name: "Mei Lin Chua" },
      { id: "user-trung", organisationId: "org-harvest", role: "Startup", name: "Trung Nguyen" },
      { id: "user-putri", organisationId: "org-nexus", role: "Startup", name: "Putri Wijaya" },
      { id: "user-niran", organisationId: "org-sight", role: "Startup", name: "Niran Chaiyaporn" },
    ],
    matches: [
      { id: "match-1", challengeId: "challenge-delivery", startupId: "startup-routify", criteria: [{ label: "capability", score: 40, max: 40 }, { label: "industry", score: 20, max: 20 }, { label: "maturity", score: 15, max: 15 }, { label: "deployment", score: 15, max: 15 }, { label: "availability", score: 10, max: 10 }], reasons: ["Direct route-optimisation capability", "Dedicated Singapore implementation team"], risks: ["Confirm vehicle-location API compatibility"], rank: 1 },
      { id: "match-2", challengeId: "challenge-delivery", startupId: "startup-fleetly", criteria: [{ label: "capability", score: 30, max: 40 }, { label: "industry", score: 17, max: 20 }, { label: "maturity", score: 15, max: 15 }, { label: "deployment", score: 15, max: 15 }, { label: "availability", score: 0, max: 10 }], reasons: ["Strong regional fleet experience"], risks: ["In active POC until December 2026"], rank: 2 },
      { id: "match-3", challengeId: "challenge-delivery", startupId: "startup-nexus", criteria: [{ label: "capability", score: 30, max: 40 }, { label: "industry", score: 15, max: 20 }, { label: "maturity", score: 8, max: 15 }, { label: "deployment", score: 15, max: 15 }, { label: "availability", score: 10, max: 10 }], reasons: ["Relevant optimisation engine", "Bahasa and English implementation support"], risks: ["No demonstrated order-system integration"], rank: 3 },
      { id: "match-4", challengeId: "challenge-coldchain", startupId: "startup-coldchain", criteria: [{ label: "capability", score: 40, max: 40 }, { label: "industry", score: 20, max: 20 }, { label: "maturity", score: 15, max: 15 }, { label: "deployment", score: 15, max: 15 }, { label: "availability", score: 10, max: 10 }], reasons: ["Direct cold-chain excursion capability", "Existing pharmaceutical compliance reporting"], risks: ["No warehouse management system integration yet"], rank: 1 },
      { id: "match-5", challengeId: "challenge-coldchain", startupId: "startup-routify", criteria: [{ label: "capability", score: 15, max: 40 }, { label: "industry", score: 20, max: 20 }, { label: "maturity", score: 15, max: 15 }, { label: "deployment", score: 15, max: 15 }, { label: "availability", score: 10, max: 10 }], reasons: ["Strong Singapore logistics presence"], risks: ["No sensor telemetry capability"], rank: 2 },
      { id: "match-6", challengeId: "challenge-coldchain", startupId: "startup-fleetly", criteria: [{ label: "capability", score: 15, max: 40 }, { label: "industry", score: 17, max: 20 }, { label: "maturity", score: 15, max: 15 }, { label: "deployment", score: 15, max: 15 }, { label: "availability", score: 0, max: 10 }], reasons: ["Fleet visibility across Malaysia"], risks: ["No capacity for this timeline"], rank: 3 },
      { id: "match-7", challengeId: "challenge-traceability", startupId: "startup-harvest", criteria: [{ label: "capability", score: 40, max: 40 }, { label: "industry", score: 20, max: 20 }, { label: "maturity", score: 8, max: 15 }, { label: "deployment", score: 8, max: 15 }, { label: "availability", score: 10, max: 10 }], reasons: ["Direct supplier traceability capability", "Two Vietnamese food manufacturers live"], risks: ["No Halal certification workflow", "Limited Bahasa Indonesia support"], rank: 1 },
      { id: "match-8", challengeId: "challenge-traceability", startupId: "startup-locus", criteria: [{ label: "capability", score: 30, max: 40 }, { label: "industry", score: 8, max: 20 }, { label: "maturity", score: 15, max: 15 }, { label: "deployment", score: 8, max: 15 }, { label: "availability", score: 10, max: 10 }], reasons: ["Workflow automation across ASEAN"], risks: ["No food traceability case studies"], rank: 2 },
      { id: "match-9", challengeId: "challenge-traceability", startupId: "startup-sight", criteria: [{ label: "capability", score: 15, max: 40 }, { label: "industry", score: 2, max: 20 }, { label: "maturity", score: 8, max: 15 }, { label: "deployment", score: 8, max: 15 }, { label: "availability", score: 10, max: 10 }], reasons: ["Anomaly detection on intake images"], risks: ["No supplier traceability capability"], rank: 3 },
      { id: "match-10", challengeId: "challenge-demand", startupId: "startup-nexus", criteria: [{ label: "capability", score: 40, max: 40 }, { label: "industry", score: 15, max: 20 }, { label: "maturity", score: 8, max: 15 }, { label: "deployment", score: 8, max: 15 }, { label: "availability", score: 10, max: 10 }], reasons: ["Demand forecasting engine in production", "Bahasa implementation support"], risks: ["No demonstrated order-system integration"], rank: 1 },
      { id: "match-11", challengeId: "challenge-demand", startupId: "startup-routify", criteria: [{ label: "capability", score: 15, max: 40 }, { label: "industry", score: 20, max: 20 }, { label: "maturity", score: 15, max: 15 }, { label: "deployment", score: 8, max: 15 }, { label: "availability", score: 10, max: 10 }], reasons: ["Fleet analytics adjacent to demand planning"], risks: ["No demand forecasting capability"], rank: 2 },
      { id: "match-12", challengeId: "challenge-demand", startupId: "startup-locus", criteria: [{ label: "capability", score: 15, max: 40 }, { label: "industry", score: 8, max: 20 }, { label: "maturity", score: 15, max: 15 }, { label: "deployment", score: 8, max: 15 }, { label: "availability", score: 10, max: 10 }], reasons: ["Field operations workflow support"], risks: ["No forecasting capability"], rank: 3 },
      { id: "match-13", challengeId: "challenge-inspection", startupId: "startup-sight", criteria: [{ label: "capability", score: 40, max: 40 }, { label: "industry", score: 20, max: 20 }, { label: "maturity", score: 8, max: 15 }, { label: "deployment", score: 8, max: 15 }, { label: "availability", score: 10, max: 10 }], reasons: ["Direct computer vision inspection capability", "Two manufacturing pilots live"], risks: ["No Thai packaging line reference"], rank: 1 },
      { id: "match-14", challengeId: "challenge-inspection", startupId: "startup-coldchain", criteria: [{ label: "capability", score: 15, max: 40 }, { label: "industry", score: 20, max: 20 }, { label: "maturity", score: 15, max: 15 }, { label: "deployment", score: 8, max: 15 }, { label: "availability", score: 10, max: 10 }], reasons: ["Anomaly detection on sensor telemetry"], risks: ["No camera-based inspection capability"], rank: 2 },
      { id: "match-15", challengeId: "challenge-inspection", startupId: "startup-nexus", criteria: [{ label: "capability", score: 15, max: 40 }, { label: "industry", score: 2, max: 20 }, { label: "maturity", score: 8, max: 15 }, { label: "deployment", score: 8, max: 15 }, { label: "availability", score: 10, max: 10 }], reasons: ["Regional implementation presence"], risks: ["No inspection capability"], rank: 3 },
    ],
    startups: demoStartups,
    pocs: [
      { id: "poc-delivery", challengeId: "challenge-delivery", startupId: null, status: "Matching", charter: null, corporateApproved: false, startupApproved: false, createdAt: daysAgo(38), partnerSelectedAt: null, charterReviewAt: null, activatedAt: null, resultSubmittedAt: null, completedAt: null, closedAt: null, closedReason: null, lastActivityAt: daysAgo(38), readiness: { decisionMaker: true, localOwner: true, dataAccess: false, procurement: false, language: true, regulatory: false } },
      { id: "poc-coldchain", challengeId: "challenge-coldchain", startupId: "startup-coldchain", status: "Completed", charter: charter("ColdChain IQ", "Singapore", "Reduce temperature excursions on pharmaceutical shipments from a 4.2% baseline to below 1.5% during a 10-week pilot, without replacing existing sensor hardware.", "Excursion monitoring across the Singapore cold-chain hub; baseline validation; weekly excursion review; in-country processing for Malaysian consignments."), corporateApproved: true, startupApproved: true, createdAt: daysAgo(126), partnerSelectedAt: daysAgo(120), charterReviewAt: daysAgo(112), activatedAt: daysAgo(104), resultSubmittedAt: daysAgo(18), completedAt: daysAgo(14), closedAt: null, closedReason: null, lastActivityAt: daysAgo(8), readiness: { decisionMaker: true, localOwner: true, dataAccess: true, procurement: true, language: true, regulatory: true } },
      { id: "poc-traceability", challengeId: "challenge-traceability", startupId: "startup-harvest", status: "CharterReview", charter: charter("HarvestLink", "Vietnam", "Trace raw ingredient batches across the 40 highest-risk suppliers in under 6 hours, supporting Halal recertification within a 14-week pilot.", "Document-based supplier intake at the Johor plant; trace drills on 40 suppliers; weekly evidence review."), corporateApproved: true, startupApproved: false, createdAt: daysAgo(61), partnerSelectedAt: daysAgo(35), charterReviewAt: daysAgo(30), activatedAt: null, resultSubmittedAt: null, completedAt: null, closedAt: null, closedReason: null, lastActivityAt: daysAgo(4), readiness: { decisionMaker: true, localOwner: true, dataAccess: true, procurement: false, language: false, regulatory: false } },
      { id: "poc-demand", challengeId: "challenge-demand", startupId: "startup-nexus", status: "Active", charter: charter("Nexus Mobility", "Indonesia", "Reduce forecast error on the Jakarta distribution network from 23% MAPE to below 15% during a 12-week pilot, using three years of historical order data.", "Forecast accuracy testing on a fixed SKU set; weekly MAPE measurement; historical data processed within Indonesia."), corporateApproved: true, startupApproved: true, createdAt: daysAgo(88), partnerSelectedAt: daysAgo(80), charterReviewAt: daysAgo(74), activatedAt: daysAgo(66), resultSubmittedAt: null, completedAt: null, closedAt: null, closedReason: null, lastActivityAt: daysAgo(2), readiness: { decisionMaker: true, localOwner: true, dataAccess: true, procurement: true, language: true, regulatory: false } },
      { id: "poc-inspection", challengeId: "challenge-inspection", startupId: "startup-sight", status: "ResultSubmitted", charter: charter("Sightline", "Thailand", "Reduce defective cartons escaping manual inspection from a 5.4% baseline to below 2.0% over an 8-week pilot on the Bangkok contract packaging line.", "Camera-based defect detection on one packaging line; baseline validation; weekly defect escape review."), corporateApproved: true, startupApproved: true, createdAt: daysAgo(74), partnerSelectedAt: daysAgo(66), charterReviewAt: daysAgo(58), activatedAt: daysAgo(50), resultSubmittedAt: daysAgo(5), completedAt: null, closedAt: null, closedReason: null, lastActivityAt: daysAgo(5), readiness: { decisionMaker: true, localOwner: true, dataAccess: true, procurement: true, language: false, regulatory: true } },
      { id: "poc-warehouse", challengeId: "challenge-warehouse", startupId: null, status: "Draft", charter: null, corporateApproved: false, startupApproved: false, createdAt: daysAgo(150), partnerSelectedAt: null, charterReviewAt: null, activatedAt: null, resultSubmittedAt: null, completedAt: null, closedAt: daysAgo(112), closedReason: "No site owner and no hardware funding approved for year one.", lastActivityAt: daysAgo(112), readiness: { decisionMaker: false, localOwner: false, dataAccess: false, procurement: false, language: true, regulatory: false } },
      { id: "poc-returns", challengeId: "challenge-returns", startupId: null, status: "Draft", charter: null, corporateApproved: false, startupApproved: false, createdAt: daysAgo(6), partnerSelectedAt: null, charterReviewAt: null, activatedAt: null, resultSubmittedAt: null, completedAt: null, closedAt: null, closedReason: null, lastActivityAt: daysAgo(6), readiness: { decisionMaker: false, localOwner: false, dataAccess: false, procurement: false, language: true, regulatory: false } },
    ],
    milestones: [
      { pocId: "poc-delivery", id: "ms-1", title: "Data & systems workshop", owner: "Aisha Rahman", dueDate: daysAhead(6), critical: true, status: "Scheduled" },
      { pocId: "poc-delivery", id: "ms-2", title: "Baseline validation", owner: "Daniel Tan", dueDate: daysAhead(20), critical: true, status: "Not started" },
      { pocId: "poc-delivery", id: "ms-3", title: "Mid-pilot performance review", owner: "Aisha Rahman", dueDate: daysAhead(48), critical: false, status: "Not started" },
      { pocId: "poc-coldchain", id: "ms-4", title: "Sensor recalibration sign-off", owner: "Mei Lin Chua", dueDate: daysAgoDate(96), critical: true, status: "Completed" },
      { pocId: "poc-coldchain", id: "ms-5", title: "Baseline validation", owner: "Daniel Tan", dueDate: daysAgoDate(76), critical: true, status: "Completed" },
      { pocId: "poc-coldchain", id: "ms-6", title: "Mid-pilot performance review", owner: "Aisha Rahman", dueDate: daysAgoDate(46), critical: true, status: "Completed" },
      { pocId: "poc-coldchain", id: "ms-7", title: "Final excursion evidence review", owner: "Daniel Tan", dueDate: daysAgoDate(16), critical: true, status: "Completed" },
      { pocId: "poc-coldchain", id: "ms-8", title: "Commercial decision pack", owner: "Aisha Rahman", dueDate: daysAhead(4), critical: false, status: "In progress" },
      { pocId: "poc-traceability", id: "ms-9", title: "Supplier cohort confirmation", owner: "Aisha Rahman", dueDate: daysAhead(9), critical: true, status: "Scheduled" },
      { pocId: "poc-traceability", id: "ms-10", title: "Trace drill round 1", owner: "Trung Nguyen", dueDate: daysAhead(34), critical: true, status: "Not started" },
      { pocId: "poc-demand", id: "ms-11", title: "Historical data extract validated", owner: "Putri Wijaya", dueDate: daysAgoDate(42), critical: true, status: "Completed" },
      { pocId: "poc-demand", id: "ms-12", title: "Baseline forecast error confirmed", owner: "Daniel Tan", dueDate: daysAgoDate(20), critical: true, status: "Completed" },
      { pocId: "poc-demand", id: "ms-13", title: "Week 6 forecast comparison", owner: "Aisha Rahman", dueDate: daysAhead(8), critical: true, status: "In progress" },
      { pocId: "poc-demand", id: "ms-14", title: "Final forecast error review", owner: "Daniel Tan", dueDate: daysAhead(36), critical: true, status: "Not started" },
      { pocId: "poc-inspection", id: "ms-15", title: "Camera rig installation", owner: "Niran Chaiyaporn", dueDate: daysAgoDate(34), critical: true, status: "Completed" },
      { pocId: "poc-inspection", id: "ms-16", title: "Baseline defect escape validation", owner: "Daniel Tan", dueDate: daysAgoDate(18), critical: true, status: "Completed" },
      { pocId: "poc-inspection", id: "ms-17", title: "Final defect escape review", owner: "Aisha Rahman", dueDate: daysAhead(3), critical: true, status: "In progress" },
    ],
    actions: [
      { id: "action-1", pocId: "poc-delivery", title: "Share anonymised order and GPS data schema", owner: "Daniel Tan", dueDate: daysAhead(4), status: "Open" },
      { id: "action-2", pocId: "poc-coldchain", title: "Publish the in-country processing attestation for Malaysian consignments", owner: "Mei Lin Chua", dueDate: daysAgoDate(70), status: "Completed" },
      { id: "action-3", pocId: "poc-coldchain", title: "Recalibrate cold-room sensors 3 and 7", owner: "Mei Lin Chua", dueDate: daysAgoDate(96), status: "Completed" },
      { id: "action-4", pocId: "poc-coldchain", title: "Assemble the commercial decision pack", owner: "Aisha Rahman", dueDate: daysAhead(4), status: "Open" },
      { id: "action-5", pocId: "poc-coldchain", title: "Confirm Q3 excursion incident log is complete", owner: "Daniel Tan", dueDate: daysAgoDate(110), status: "Completed" },
      { id: "action-6", pocId: "poc-traceability", title: "Name the Halal evidence workflow owner", owner: "Daniel Tan", dueDate: daysAhead(7), status: "Open" },
      { id: "action-7", pocId: "poc-traceability", title: "Confirm the 40 highest-risk supplier list", owner: "Trung Nguyen", dueDate: daysAhead(12), status: "Open" },
      { id: "action-8", pocId: "poc-demand", title: "Agree promotional-spike treatment with the demand planning team", owner: "Putri Wijaya", dueDate: daysAhead(6), status: "Open" },
      { id: "action-9", pocId: "poc-demand", title: "Deliver three-year order history extract", owner: "Daniel Tan", dueDate: daysAgoDate(44), status: "Completed" },
      { id: "action-10", pocId: "poc-inspection", title: "Submit the final defect escape measurement pack", owner: "Niran Chaiyaporn", dueDate: daysAhead(2), status: "Open" },
      { id: "action-11", pocId: "poc-inspection", title: "Confirm camera rig calibration record", owner: "Niran Chaiyaporn", dueDate: daysAgoDate(30), status: "Completed" },
    ],
    evidence: [
      { id: "ev-1", pocId: "poc-coldchain", reference: "evidence.demo/coldchain-baseline-validation.pdf", description: "Validated 4.2% baseline across 1,180 consignments", verified: true },
      { id: "ev-2", pocId: "poc-coldchain", reference: "evidence.demo/coldchain-sensor-calibration.pdf", description: "Sensor calibration certificates for units 3 and 7", verified: true },
      { id: "ev-3", pocId: "poc-coldchain", reference: "evidence.demo/coldchain-residency-attestation.pdf", description: "Malaysian consignment data processed in-country", verified: true },
      { id: "ev-4", pocId: "poc-coldchain", reference: "evidence.demo/coldchain-excursion-measurement.pdf", description: "Pilot measurement report showing 1.3% excursion rate", verified: true },
      { id: "ev-5", pocId: "poc-inspection", reference: "evidence.demo/sightline-baseline-validation.pdf", description: "Validated 5.4% baseline across 8,400 inspected cartons", verified: true },
      { id: "ev-6", pocId: "poc-inspection", reference: "evidence.demo/sightline-defect-measurement.pdf", description: "Week 7 defect escape measurement, awaiting review", verified: false },
      { id: "ev-7", pocId: "poc-traceability", reference: "evidence.demo/harvest-supplier-master.xlsx", description: "Supplier master list covering 340 suppliers", verified: false },
    ],
    results: {
      "poc-coldchain": {
        baseline: "4.2%", target: "Below 1.5%", actual: "1.3%", unit: "Excursion rate (%)", period: "10 weeks",
        testimonial: "The pilot gave our cold-chain team a defensible excursion baseline and a measurable reduction without new hardware.",
        commercialStage: "Commercial negotiation", commercialValue: null, currency: null, commercialEvidence: null, commercialVerified: false,
        narrative: "Excursion rate fell from a validated 4.2% baseline to 1.3% across the pilot period. Sensor recalibration in week 2 removed two known drift sources before the baseline was frozen. Malaysian consignments were processed in-country throughout.",
      },
      "poc-inspection": {
        baseline: "5.4%", target: "Below 2.0%", actual: "1.9%", unit: "Defective cartons (%)", period: "8 weeks",
        testimonial: "Line operators stopped relying on manual sampling within the first month.",
        commercialStage: "No decision", commercialValue: null, currency: null, commercialEvidence: null, commercialVerified: false,
        narrative: null,
      },
    },
    activities: [
      { id: "activity-1", pocId: null, text: "Fictional ASEAN demo workspace initialised", timestamp: daysAgo(150), type: "system" },
      { id: "activity-2", pocId: "poc-warehouse", text: "POC closed without POC: No site owner and no hardware funding approved for year one.", timestamp: daysAgo(112), type: "workflow" },
      { id: "activity-3", pocId: "poc-coldchain", text: "Structured challenge requirements approved for matching", timestamp: daysAgo(126), type: "workflow" },
      { id: "activity-4", pocId: "poc-coldchain", text: "Multi-agent POC brief generated for review", timestamp: daysAgo(125), type: "ai" },
      { id: "activity-5", pocId: "poc-coldchain", text: "Multi-agent brief approved by Aisha Rahman", timestamp: daysAgo(124), type: "ai" },
      { id: "activity-6", pocId: "poc-coldchain", text: "ColdChain IQ confirmed as POC partner", timestamp: daysAgo(120), type: "workflow" },
      { id: "activity-7", pocId: "poc-coldchain", text: "POC charter revision 1 generated for joint review", timestamp: daysAgo(112), type: "workflow" },
      { id: "activity-8", pocId: "poc-coldchain", text: "Meridian Logistics approved charter revision 1", timestamp: daysAgo(108), type: "workflow" },
      { id: "activity-9", pocId: "poc-coldchain", text: "Startup partner approved charter revision 1", timestamp: daysAgo(106), type: "workflow" },
      { id: "activity-10", pocId: "poc-coldchain", text: "POC activated with joint charter approval", timestamp: daysAgo(104), type: "workflow" },
      { id: "activity-11", pocId: "poc-coldchain", text: "3 reviewed meeting actions saved", timestamp: daysAgo(104), type: "workflow" },
      { id: "activity-12", pocId: "poc-coldchain", text: "Measured result and evidence submitted for review", timestamp: daysAgo(18), type: "workflow" },
      { id: "activity-13", pocId: "poc-coldchain", text: "Result evidence reviewed; POC marked completed", timestamp: daysAgo(14), type: "workflow" },
      { id: "activity-14", pocId: "poc-coldchain", text: "Commercial progression updated: Commercial negotiation", timestamp: daysAgo(8), type: "commercial" },
      { id: "activity-15", pocId: "poc-demand", text: "Structured challenge requirements approved for matching", timestamp: daysAgo(88), type: "workflow" },
      { id: "activity-16", pocId: "poc-demand", text: "Multi-agent POC brief generated for review", timestamp: daysAgo(71), type: "ai" },
      { id: "activity-17", pocId: "poc-demand", text: "Multi-agent brief rejected by Aisha Rahman", timestamp: daysAgo(70), type: "ai" },
      { id: "activity-18", pocId: "poc-demand", text: "Nexus Mobility confirmed as POC partner", timestamp: daysAgo(80), type: "workflow" },
      { id: "activity-19", pocId: "poc-demand", text: "POC charter revision 1 generated for joint review", timestamp: daysAgo(74), type: "workflow" },
      { id: "activity-20", pocId: "poc-demand", text: "POC activated with joint charter approval", timestamp: daysAgo(66), type: "workflow" },
      { id: "activity-21", pocId: "poc-demand", text: "3 reviewed meeting actions saved", timestamp: daysAgo(52), type: "workflow" },
      { id: "activity-22", pocId: "poc-inspection", text: "Sightline confirmed as POC partner", timestamp: daysAgo(66), type: "workflow" },
      { id: "activity-23", pocId: "poc-inspection", text: "POC activated with joint charter approval", timestamp: daysAgo(50), type: "workflow" },
      { id: "activity-24", pocId: "poc-inspection", text: "Measured result and evidence submitted for review", timestamp: daysAgo(5), type: "workflow" },
      { id: "activity-25", pocId: "poc-traceability", text: "Structured challenge requirements approved for matching", timestamp: daysAgo(61), type: "workflow" },
      { id: "activity-26", pocId: "poc-traceability", text: "HarvestLink confirmed as POC partner", timestamp: daysAgo(35), type: "workflow" },
      { id: "activity-27", pocId: "poc-traceability", text: "POC charter revision 1 generated for joint review", timestamp: daysAgo(30), type: "workflow" },
      { id: "activity-28", pocId: "poc-traceability", text: "Meridian Logistics approved charter revision 1", timestamp: daysAgo(29), type: "workflow" },
      { id: "activity-29", pocId: "poc-traceability", text: "Multi-agent POC brief generated for review", timestamp: daysAgo(29), type: "ai" },
      { id: "activity-30", pocId: "poc-traceability", text: "Cross-border readiness checklist updated", timestamp: daysAgo(4), type: "workflow" },
      { id: "activity-31", pocId: null, text: "Introduction requested: Routify AI × Archipelago Ventures", timestamp: daysAgo(9), type: "marketplace" },
      { id: "activity-32", pocId: null, text: "Introduction requested: ColdChain IQ × Southern Cross Capital", timestamp: daysAgo(4), type: "marketplace" },
    ],
  };
}
