import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { seedData } from "./seed";
import type { AppData, Challenge, Poc, PocStatus } from "./types";

const globalStore = globalThis as unknown as { pilotBridgeDb?: Database.Database };
function getDb() {
  if (globalStore.pilotBridgeDb) return globalStore.pilotBridgeDb;
  const filename = process.env.PILOTBRIDGE_DB || path.join(process.cwd(), "data", "pilotbridge.db");
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const db = new Database(filename);
  db.pragma("journal_mode = WAL");
  db.exec("CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY CHECK(id = 1), data TEXT NOT NULL, updated_at TEXT NOT NULL)");
  if (!db.prepare("SELECT id FROM app_state WHERE id = 1").get()) {
    db.prepare("INSERT INTO app_state(id, data, updated_at) VALUES(1, ?, ?)").run(JSON.stringify(seedData()), new Date().toISOString());
  }
  globalStore.pilotBridgeDb = db;
  return db;
}
export function getData(): AppData {
  const row = getDb().prepare("SELECT data FROM app_state WHERE id = 1").get() as { data: string };
  const data = JSON.parse(row.data) as AppData;
  const defaults = seedData();
  data.investors ??= defaults.investors; data.pocIdeas ??= []; data.introductions ??= [];
  data.organisations ??= defaults.organisations; data.users ??= defaults.users; data.matches ??= [];
  data.pocs.forEach(poc => { poc.createdAt ??= poc.lastActivityAt; poc.partnerSelectedAt ??= null; poc.charterReviewAt ??= null; poc.resultSubmittedAt ??= null; poc.completedAt ??= null; });
  Object.values(data.results).forEach(result => { result.commercialValue ??= null; result.currency ??= null; result.commercialEvidence ??= null; result.commercialVerified ??= false; });
  data.actions.forEach(action => { action.pocId ??= data.pocs[0].id; }); data.evidence.forEach(item => { item.pocId ??= data.pocs[0].id; });
  data.startups.forEach(startup => { const seed = defaults.startups.find(s => s.id === startup.id); if (seed) { startup.stage ??= seed.stage; startup.seeking ??= seed.seeking; startup.markets ??= seed.markets; startup.traction ??= seed.traction; startup.verified ??= seed.verified; } });
  return data;
}
export function updateData<T>(mutate: (data: AppData) => T): T {
  const db = getDb();
  return db.transaction(() => {
    const data = getData();
    const value = mutate(data);
    db.prepare("UPDATE app_state SET data = ?, updated_at = ? WHERE id = 1").run(JSON.stringify(data), new Date().toISOString());
    return value;
  })();
}
export function recordActivity(data: AppData, pocId: string | null, text: string, type = "workflow") {
  data.activities.unshift({ id: crypto.randomUUID(), pocId, text, timestamp: new Date().toISOString(), type });
  if (pocId) { const poc = data.pocs.find(p => p.id === pocId); if (poc) poc.lastActivityAt = new Date().toISOString(); }
}
export function syncChallenge(data: AppData, poc: Poc) {
  const challenge = data.challenges.find(c => c.id === poc.challengeId);
  if (!challenge) return;
  const status: Record<PocStatus, Challenge["status"]> = { Draft: "Draft", Matching: "Matching", PartnerSelected: "Partner selected", CharterReview: "Charter review", Active: "Active", ResultSubmitted: "Active", Completed: "Completed" };
  challenge.status = status[poc.status]; challenge.startupId = poc.startupId;
}
export function resetData() { updateData(data => { Object.assign(data, seedData()); }); }
