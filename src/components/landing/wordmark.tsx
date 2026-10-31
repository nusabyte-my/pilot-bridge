export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <svg viewBox="0 0 72 48" className="h-9 w-[54px]" aria-hidden="true">
        <defs>
          <linearGradient id="pb-mark" x1="16" y1="0" x2="56" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0E7C86" />
            <stop offset="100%" stopColor="#E8893A" />
          </linearGradient>
        </defs>
        <path d="M16 36 C24 10 48 10 56 36" fill="none" stroke="url(#pb-mark)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M24 36 H48" fill="none" stroke="#0E7C86" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="1.6 5" strokeLinecap="round" />
        <circle cx="16" cy="36" r="8" fill="#0E7C86" />
        <circle cx="16" cy="36" r="3.2" fill="#F7F4EE" />
        <circle cx="56" cy="36" r="8" fill="#E8893A" />
        <circle cx="56" cy="36" r="3.2" fill="#F7F4EE" />
      </svg>
      <span className="font-display text-[1.45rem] leading-none font-semibold tracking-[-0.04em]">
        <span className="text-navy">Pilot</span>
        <span className="text-teal">Bridge</span>
      </span>
    </span>
  );
}
