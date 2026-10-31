export function BridgeArc() {
  return <figure className="bridge-arc">
    <svg viewBox="0 0 640 190" role="img" aria-labelledby="bridge-title">
      <title id="bridge-title">PilotBridge execution span: challenge, matching, charter, outcome</title>
      <line x1="64" y1="128" x2="576" y2="128" stroke="var(--line)" strokeWidth="1" strokeDasharray="3 8"/>
      <path d="M64 128 C160 34 480 34 576 128" fill="none" stroke="url(#bridge-gradient)" strokeWidth="3" strokeLinecap="round"/>
      <defs><linearGradient id="bridge-gradient" x1="64" y1="0" x2="576" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="var(--green)"/><stop offset="1" stopColor="#b7792c"/></linearGradient></defs>
      <circle cx="64" cy="128" r="7" fill="var(--green)"/>
      <circle cx="64" cy="128" r="2.6" fill="var(--paper)"/>
      <circle cx="320" cy="67" r="6" fill="var(--white)" stroke="var(--green)" strokeWidth="2"/>
      <circle cx="576" cy="128" r="7" fill="#b7792c"/>
      <circle cx="576" cy="128" r="2.6" fill="var(--paper)"/>
      <text x="64" y="154" textAnchor="middle">Challenge</text>
      <text x="320" y="92" textAnchor="middle">Matching · Charter</text>
      <text x="576" y="154" textAnchor="middle">Verified outcome</text>
    </svg>
    <figcaption>One accountable span from corporate problem to measured result.</figcaption>
  </figure>;
}
