import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticate, clearSessionCookie, setSessionCookie } from "@/lib/auth";
import { allowRequest, requestIdentity } from "@/lib/rate-limit";
export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  if (action === "logout") { await clearSessionCookie(); return NextResponse.json({ ok: true }); }
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
