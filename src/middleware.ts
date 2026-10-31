import { NextResponse, type NextRequest } from "next/server";
import { verifyEdgeSession } from "@/lib/session-edge";
const startupAllowed = ["/marketplace", "/poc", "/login"];
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (process.env.PILOTBRIDGE_DEMO === "true") return NextResponse.next();
  const session = await verifyEdgeSession(request.cookies.get("pilotbridge_session")?.value);
  if (pathname === "/login") return session ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  if (!session) { const url = new URL("/login", request.url); url.searchParams.set("next", pathname); return NextResponse.redirect(url); }
  if (session.role === "Startup" && !startupAllowed.some(path => pathname === path || pathname.startsWith(`${path}/`))) return NextResponse.redirect(new URL("/marketplace", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|api/health).*)"] };
