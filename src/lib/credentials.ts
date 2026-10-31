import fs from "node:fs";
import path from "node:path";
import { hashPassword, verifyPassword, type Role } from "./auth";

export interface Credential { email: string; role: Role; userId: string; organisationId: string; salt: string; hash: string; sessionVersion: number; }
function file() { return path.join(path.dirname(process.env.PILOTBRIDGE_DB || path.join(process.cwd(), "data", "pilotbridge.db")), "auth-credentials.json"); }
export function loadCredentials(): Credential[] {
  try { const parsed = JSON.parse(fs.readFileSync(file(), "utf8")) as Credential[]; return Array.isArray(parsed) ? parsed : []; } catch { return []; }
}
export function saveCredentials(entries: Credential[]) {
  const target = file(); fs.mkdirSync(path.dirname(target), { recursive: true });
  const temp = `${target}.${process.pid}.tmp`; fs.writeFileSync(temp, JSON.stringify(entries), { mode: 0o600 }); fs.renameSync(temp, target);
}
export function bootstrapCredentials() {
  if (loadCredentials().length) return;
  const configured = process.env.AUTH_USERS;
  if (!configured) return;
  try {
    const entries = JSON.parse(configured) as Array<Omit<Credential, "sessionVersion">>;
    if (!Array.isArray(entries) || !entries.length) return;
    saveCredentials(entries.map(entry => ({ ...entry, sessionVersion: 1 })));
  } catch { /* invalid bootstrap config remains locked */ }
}
export function findCredential(email: string) { return loadCredentials().find(entry => entry.email.toLowerCase() === email.trim().toLowerCase()); }
export function changePassword(email: string, currentPassword: string, nextPassword: string) {
  const entries = loadCredentials(); const entry = entries.find(item => item.email.toLowerCase() === email.trim().toLowerCase());
  if (!entry || !verifyPassword(currentPassword, entry.salt, entry.hash)) return { ok: false, message: "Current password is incorrect." };
  if (nextPassword.length < 12) return { ok: false, message: "Use a password with at least 12 characters." };
  const { salt, hash } = hashPassword(nextPassword);
  entry.salt = salt; entry.hash = hash; entry.sessionVersion += 1;
  saveCredentials(entries);
  return { ok: true, message: "Password changed. All other sessions have been revoked." };
}
