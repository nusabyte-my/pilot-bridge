import Image from "next/image";
import Link from "next/link";

export function Logo({ href = "/", compact = false, className = "" }: { href?: string; compact?: boolean; className?: string }) {
  return (
    <Link href={href} className={`logo ${className}`} aria-label="PilotBridge home">
      <Image
        src="/pilotbridge-logo.png"
        alt="PilotBridge — ASEAN cross-border POC execution"
        width={compact ? 150 : 200}
        height={compact ? 27 : 36}
        priority
        className="logo-image"
      />
    </Link>
  );
}
