import { AppHeader } from "@/components/app-header";
import { getSession } from "@/lib/auth";

export default async function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const demo = process.env.PILOTBRIDGE_DEMO === "true";
  const session = demo ? null : await getSession();

  return (
    <div className="shell">
      <AppHeader name={session?.role === "Programme manager" ? "Aisha Rahman" : "PilotBridge user"} role={session?.role || "Demo"} demo={demo} />
      <main className="main" id="main">
        {children}
      </main>
    </div>
  );
}
