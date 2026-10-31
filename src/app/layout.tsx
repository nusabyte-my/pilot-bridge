import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "PilotBridge — From connection to verified outcome", description: "Turn corporate challenges into explainable startup matches, structured cross-border POCs, and evidence-backed outcomes." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
