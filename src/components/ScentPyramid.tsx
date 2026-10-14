// The fragrance's notes drawn as a literal pyramid: top notes at the apex,
// heart in the middle, base at the foot, each tier a slice of one
// continuous triangle (a clip-path on its own row, so the edges line up
// whatever height a row grows to when its list of notes wraps). Only tiers
// that actually have notes are drawn, and the triangle is re-divided across
// however many that is.
interface Tier {
  label: string;
  notes: string[];
  color: string;
}

export function ScentPyramid({ top, heart, base }: { top: string[]; heart: string[]; base: string[] }) {
  const tiers: Tier[] = [
    { label: "Top Notes", notes: top, color: "bg-gold-light" },
    { label: "Heart Notes", notes: heart, color: "bg-gold" },
    { label: "Base Notes", notes: base, color: "bg-royal" },
  ].filter((t) => t.notes.length > 0);

  if (tiers.length === 0) return null;

  return (
    <div className="space-y-1">
      {tiers.map((tier, i) => {
        // Width of the triangle (as a fraction of the cell) at this tier's
        // top and bottom edge.
        const topW = i / tiers.length;
        const bottomW = (i + 1) / tiers.length;
        const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
        const clipPath = `polygon(${pct((1 - topW) / 2)} 0, ${pct((1 + topW) / 2)} 0, ${pct((1 + bottomW) / 2)} 100%, ${pct((1 - bottomW) / 2)} 100%)`;

        return (
          <div key={tier.label} className="grid min-h-[64px] grid-cols-[84px_1fr] items-stretch gap-4 sm:grid-cols-[96px_1fr]">
            <div aria-hidden className={tier.color} style={{ clipPath }} />
            <div className="self-center py-2">
              <p className="label-caps text-[11px] text-ink">{tier.label}</p>
              <p className="mt-1 text-sm leading-snug text-ink-soft">{tier.notes.join(", ")}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const TileIcon = ({ kind }: { kind: "top" | "heart" | "base" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {kind === "top" && <path d="M12 3c3.5 4.2 5.5 7 5.5 10a5.5 5.5 0 0 1-11 0c0-3 2-5.8 5.5-10Z" />}
    {kind === "heart" && <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />}
    {kind === "base" && <path d="M12 4 4 19h16L12 4ZM8.5 14h7M10.2 10h3.6" />}
  </svg>
);

// The same notes as three tiles side by side — easier to read on a phone than the
// stepped triangle. Only tiers that have notes are shown.
export function ScentTiles({ top, heart, base }: { top: string[]; heart: string[]; base: string[] }) {
  const tiers = [
    { kind: "top" as const, label: "Top", notes: top },
    { kind: "heart" as const, label: "Heart", notes: heart },
    { kind: "base" as const, label: "Base", notes: base },
  ].filter((t) => t.notes.length > 0);
  if (tiers.length === 0) return null;
  return (
    <div className={`grid gap-2 ${tiers.length === 1 ? "grid-cols-1" : tiers.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
      {tiers.map((t) => (
        <div key={t.kind} className="flex flex-col items-center rounded-lg bg-white px-2 py-4 text-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-royal">
            <TileIcon kind={t.kind} />
          </span>
          <span className="mt-2 text-[10px] font-medium uppercase tracking-[2px] text-ink-soft">{t.label}</span>
          <span className="mt-1 font-serif text-[17px] leading-snug text-ink">{t.notes.join(", ")}</span>
        </div>
      ))}
    </div>
  );
}
