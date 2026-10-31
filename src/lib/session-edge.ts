export interface EdgeSession { userId: string; organisationId: string; role: "Corporate" | "Startup" | "Programme manager"; expiresAt: number; }
function decode(value: string) { const normalized = value.replace(/-/g, "+").replace(/_/g, "/"); return Uint8Array.from(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")), c => c.charCodeAt(0)); }
export async function verifyEdgeSession(token: string | undefined): Promise<EdgeSession | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  const secret = process.env.AUTH_SECRET;
  if (!payload || !signature || !secret || secret.length < 32) return null;
  try {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const valid = await crypto.subtle.verify("HMAC", key, decode(signature), new TextEncoder().encode(payload));
    if (!valid) return null;
    const session = JSON.parse(new TextDecoder().decode(decode(payload))) as EdgeSession;
    if (!session.userId || !session.organisationId || !session.role || session.expiresAt < Date.now()) return null;
    return session;
  } catch { return null; }
}
