"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileStack, LayoutDashboard, Network, Waypoints } from "lucide-react";

const NAV = [
  { href: "/challenges", label: "Challenges", icon: LayoutDashboard, match: (path: string) => path.startsWith("/challenges") },
  { href: "/marketplace", label: "Marketplace", icon: Network, match: (path: string) => path.startsWith("/marketplace") },
  { href: "/poc", label: "POC workspace", icon: FileStack, match: (path: string) => path.startsWith("/poc") },
  { href: "/outcomes", label: "Outcomes", icon: BarChart3, match: (path: string) => path.startsWith("/outcomes") },
] as const;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-mark">
          <Waypoints size={17} />
        </span>
        PilotBridge
        <span className="muted tiny" style={{ fontWeight: 400 }}>
          / ASEAN
        </span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} className={`nav-link${item.match(pathname) ? " active" : ""}`} href={item.href} aria-current={item.match(pathname) ? "page" : undefined}>
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="topbar-right">
        <span className="demo-label">
          <span className="demo-dot" />
          Fictional demo data
        </span>
        <button className="avatar" aria-label="Current user: Programme manager">
          PM
        </button>
      </div>
    </header>
  );
}
