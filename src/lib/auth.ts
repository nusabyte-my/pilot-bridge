import { createHmac, randomBytes, timingSafeEqual, scryptSync } from "node:crypto";
import { cookies } from "next/headers";
import { getData } from "./store";
import type { User } from "./types";

const COOKIE = "pilotbridge_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
export type Role = User["role"];
export interface Session { userId: string; organisationId: string; role: Role; expiresAt: number; }
function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be at least 32 characters.");
  return value;
}
function sign(payload: string) { return createHmac("sha256", secret()).update(payload).digest("base64url"); }
export function createSessionToken(session: Session) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
export function verifySessionToken(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const a = Buffer.from(signature); const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    if (!session.userId || !session.organisationId || !session.role || session.expiresAt < Date.now()) return null;
    return session;
  } catch { return null; }
}
export function sessionFromRequest(request: Request): Session | null {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.split(/;\s*/).find(part => part.startsWith(`${COOKIE}=`));
  return verifySessionToken(match ? decodeURIComponent(match.slice(COOKIE.length + 1)) : undefined);
}
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE)?.value);
}
export async function setSessionCookie(session: Session) {
  const store = await cookies();
  store.set(COOKIE, createSessionToken(session), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(session.expiresAt) });
}
export async function clearSessionCookie() { (await cookies()).delete(COOKIE); }
export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  return { salt, hash: scryptSync(password, salt, 64).toString("hex") };
}
export function verifyPassword(password: string, salt: string, hash: string) {
  const actual = Buffer.from(scryptSync(password, salt, 64).toString("hex")); const expected = Buffer.from(hash);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function authenticate(email: string, password: string): Session | null {
  const configured = process.env.AUTH_USERS;
  if (!configured) return null;
  let entries: { email: string; role: Role; userId: string; organisationId: string; salt: string; hash: string }[];
  try { entries = JSON.parse(configured); } catch { return null; }
  const entry = entries.find(item => item.email.toLowerCase() === email.trim().toLowerCase());
  if (!entry || !verifyPassword(password, entry.salt, entry.hash)) return null;
  const user = getData().users.find(item => item.id === entry.userId);
  if (!user) return null;
  return { userId: user.id, organisationId: user.organisationId, role: user.role, expiresAt: Date.now() + SESSION_TTL_MS };
}
export function isProduction() { return process.env.NODE_ENV === "production" && process.env.PILOTBRIDGE_DEMO !== "true"; }
