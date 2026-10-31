import { NextResponse, type NextRequest } from "next/server";
import { verifyEdgeSession } from "@/lib/session-edge";
const startupAllowed = ["/app/marketplace", "/app/poc"];
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (process.env.PILOTBRIDGE_DEMO === "true") return NextResponse.next();
  const protectedRoute = pathname === "/app" || pathname.startsWith("/app/") || pathname === "/login";
  if (!protectedRoute) return NextResponse.next();
  const session = await verifyEdgeSession(request.cookies.get("pilotbridge_session")?.value);
  if (pathname === "/login") return session ? NextResponse.redirect(new URL("/app", request.url)) : NextResponse.next();
  if (!session) { const url = new URL("/login", request.url); url.searchParams.set("next", pathname); return NextResponse.redirect(url); }
  if (session.role === "Startup" && !startupAllowed.some(path => pathname === path || pathname.startsWith(`${path}/`))) return NextResponse.redirect(new URL("/app/marketplace", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/app/:path*", "/app", "/login"] };
