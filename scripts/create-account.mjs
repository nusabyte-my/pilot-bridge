import fs from "node:fs";
import path from "node:path";
import { randomBytes, scryptSync } from "node:crypto";

const [email, password, role = "Programme manager"] = process.argv.slice(2);
if (!email || !password || password.length < 12) {
  console.error("Usage: node scripts/create-account.mjs <email> <password (12+)> [role] [name]");
  process.exit(1);
}
const allowed = ["Programme manager", "Corporate", "Startup"];
if (!allowed.includes(role)) { console.error(`Role must be one of: ${allowed.join(", ")}`); process.exit(1); }
const dataDir = path.dirname(process.env.PILOTBRIDGE_DB || path.join(process.cwd(), "data", "pilotbridge.db"));
const authFile = path.join(dataDir, "auth-credentials.json");
const database = path.join(dataDir, "pilotbridge.db");
let users = [];
try {
  const Database = (await import("better-sqlite3")).default;
  const db = new Database(database, { readonly: true });
  users = JSON.parse(db.prepare("SELECT data FROM app_state WHERE id = 1").get().data).users;
  db.close();
} catch { console.error("Could not read application users. Start the app once to seed the database."); process.exit(1); }
const user = users.find(item => item.role === role);
if (!user) { console.error(`No seeded user with role ${role}.`); process.exit(1); }
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
let credentials = [];
try { credentials = JSON.parse(fs.readFileSync(authFile, "utf8")); } catch {}
const existing = credentials.findIndex(item => item.email.toLowerCase() === email.toLowerCase());
const entry = { email: email.toLowerCase(), role, userId: user.id, organisationId: user.organisationId, salt, hash, sessionVersion: (existing >= 0 ? credentials[existing].sessionVersion : 0) + 1 };
if (existing >= 0) credentials[existing] = entry; else credentials.push(entry);
fs.mkdirSync(dataDir, { recursive: true });
const temp = `${authFile}.${process.pid}.tmp`;
fs.writeFileSync(temp, JSON.stringify(credentials), { mode: 0o600 });
fs.renameSync(temp, authFile);
console.log(JSON.stringify({ created: existing < 0, email: entry.email, role: entry.role, userId: entry.userId, name: user.name }));
