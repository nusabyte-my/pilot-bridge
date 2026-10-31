import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticate, clearSessionCookie, setSessionCookie, sessionFromRequest, findCredentialForUser } from "@/lib/auth";
import { changePassword } from "@/lib/credentials";
import { allowRequest, requestIdentity } from "@/lib/rate-limit";
export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  if (action === "logout") { await clearSessionCookie(); return NextResponse.json({ ok: true }); }
  if (action === "password") {
    const session = sessionFromRequest(request);
    if (!session) return NextResponse.json({ ok: false, message: "Authentication required." }, { status: 401 });
    if (!allowRequest(`password:${requestIdentity(request)}`, 5, 60_000)) return NextResponse.json({ ok: false, message: "Too many attempts. Try again later." }, { status: 429 });
    try {
      const body = z.object({ currentPassword: z.string().min(8).max(200), nextPassword: z.string().min(12).max(200) }).parse(await request.json());
      const credential = findCredentialForUser(session.userId);
      if (!credential) return NextResponse.json({ ok: false, message: "Account not found." }, { status: 404 });
      const result = changePassword(credential.email, body.currentPassword, body.nextPassword);
      if (!result.ok) return NextResponse.json(result, { status: 400 });
      const updated = findCredentialForUser(session.userId)!;
      await setSessionCookie({ ...session, sessionVersion: updated.sessionVersion, expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
      return NextResponse.json(result);
    } catch { return NextResponse.json({ ok: false, message: "Enter a valid current and new password." }, { status: 400 }); }
  }
  if (action !== "login") return NextResponse.json({ ok: false, message: "Unknown action." }, { status: 404 });
  if (!allowRequest(`login:${requestIdentity(request)}`, 6, 60_000)) return NextResponse.json({ ok: false, message: "Too many sign-in attempts. Try again later." }, { status: 429 });
  try {
    const body = z.object({ email: z.string().email(), password: z.string().min(8).max(200) }).parse(await request.json());
    const session = authenticate(body.email, body.password);
    if (!session) return NextResponse.json({ ok: false, message: "Email or password is incorrect." }, { status: 401 });
    await setSessionCookie(session);
    return NextResponse.json({ ok: true, role: session.role });
  } catch { return NextResponse.json({ ok: false, message: "Enter a valid email and password." }, { status: 400 }); }
}
