"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileStack, LayoutDashboard, Network } from "lucide-react";
import { Logo } from "./logo";

const NAV = [
  { href: "/app", label: "Challenges", icon: LayoutDashboard, match: (path: string) => path === "/app" || path.startsWith("/app/challenges") },
  { href: "/app/marketplace", label: "Marketplace", icon: Network, match: (path: string) => path.startsWith("/app/marketplace") },
  { href: "/app/poc", label: "POC workspace", icon: FileStack, match: (path: string) => path.startsWith("/app/poc") },
  { href: "/app/outcomes", label: "Outcomes", icon: BarChart3, match: (path: string) => path.startsWith("/app/outcomes") },
] as const;

export function AppHeader() {
  const pathname = usePathname();
  return (
    <header className="topbar">
      <Logo href="/app" compact />
      <nav className="main-nav" aria-label="Main navigation">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname);
          return (
            <Link key={item.href} className={`nav-link${active ? " active" : ""}`} href={item.href} aria-current={active ? "page" : undefined}>
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="topbar-right">
        <span className="demo-label"><span className="demo-dot" />Fictional demo data</span>
        <button className="avatar" aria-label="Current user: Programme manager">PM</button>
      </div>
    </header>
  );
}
