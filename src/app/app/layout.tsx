import Link from "next/link";
import { LayoutDashboard, FileStack, BarChart3, Network } from "lucide-react";
import { Logo } from "@/components/logo";
import { AccountMenu } from "@/components/account-menu";
import { getSession } from "@/lib/auth";
export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const demo = process.env.PILOTBRIDGE_AUTH !== "true";
  const session = demo ? null : await getSession();
  return <div className="shell"><a className="skip-link" href="#main">Skip to main content</a><header className="topbar"><Logo href="/app" compact /><nav className="main-nav" aria-label="Main navigation"><Link className="nav-link" href="/app"><LayoutDashboard size={15}/>Challenges</Link><Link className="nav-link" href="/app/marketplace"><Network size={15}/>Marketplace</Link><Link className="nav-link" href="/app/poc"><FileStack size={15}/>POC workspace</Link><Link className="nav-link" href="/app/outcomes"><BarChart3 size={15}/>Outcomes</Link></nav><div className="topbar-right"><span className="demo-label"><span className="demo-dot"/>Fictional demo data</span><AccountMenu name={session?.role === "Programme manager" ? "Aisha Rahman" : "PilotBridge user"} role={session?.role || "Demo"} demo={demo}/></div></header><main className="main" id="main">{children}</main></div>;
}
