import { AppHeader } from "@/components/app-header";

export default function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="shell">
      <AppHeader />
      <main className="main" id="main">
        {children}
      </main>
    </div>
  );
}
