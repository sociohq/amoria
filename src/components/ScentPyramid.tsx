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
