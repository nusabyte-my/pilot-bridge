import type { Metadata } from "next";
import Link from "next/link";
import { Waypoints, LayoutDashboard, FileStack, BarChart3, Network } from "lucide-react";
import "./globals.css";
import { AccountMenu } from "@/components/account-menu";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "PilotBridge — From introduction to outcome", description: "Cross-border POC execution and evidence-backed outcomes for Startup ASEAN." };
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const demo = process.env.PILOTBRIDGE_DEMO === "true";
  const session = demo ? null : await getSession();
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to main content</a><div className="shell"><header className="topbar"><Link href="/" className="brand"><span className="brand-mark"><Waypoints size={17}/></span>PilotBridge<span className="muted tiny" style={{ fontWeight:400 }}>/ ASEAN</span></Link><nav className="main-nav" aria-label="Main navigation"><Link className="nav-link" href="/"><LayoutDashboard size={15}/>Challenges</Link><Link className="nav-link" href="/marketplace"><Network size={15}/>Marketplace</Link><Link className="nav-link" href="/poc"><FileStack size={15}/>POC workspace</Link><Link className="nav-link" href="/outcomes"><BarChart3 size={15}/>Outcomes</Link></nav><div className="topbar-right"><span className="demo-label"><span className="demo-dot"/>Fictional demo data</span><AccountMenu name={session?.role === "Programme manager" ? "Aisha Rahman" : "PilotBridge user"} role={session?.role || "Demo"} demo={demo}/></div></header><main className="main" id="main">{children}</main></div></body></html>;
}
