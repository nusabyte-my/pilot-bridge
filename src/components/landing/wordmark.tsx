import { Logo } from "@/components/logo";
export function Wordmark({ className, compact = true }: { className?: string; compact?: boolean }) {
  return <Logo className={className} compact={compact} />;
}
