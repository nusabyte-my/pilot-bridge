export function Mark({
  initials,
  color,
  size = 32,
  label,
}: {
  initials: string;
  color?: string;
  size?: number;
  label: string;
}) {
  return (
    <span
      className="startup-logo"
      style={{ background: color ?? "var(--soft)", width: size, height: size, fontSize: size < 28 ? 10 : 12 }}
      aria-hidden="true"
      title={label}
    >
      {initials}
    </span>
  );
}

export function Pair({
  left,
  right,
}: {
  left: { initials: string; color?: string; name: string };
  right?: { initials: string; color?: string; name: string } | null;
}) {
  return (
    <span className="logo-pair">
      <Mark initials={left.initials} color={left.color} size={28} label={left.name} />
      {right ? <Mark initials={right.initials} color={right.color} size={28} label={right.name} /> : null}
    </span>
  );
}
