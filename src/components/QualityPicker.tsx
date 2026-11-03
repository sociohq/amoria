"use client";

// The quality grade chooser on a product sold in grades ("Top Quality" / "Medium Quality"): one button per
// grade, the chosen one filled. Picking a grade keeps the size when that grade has it (see ProductDetail).
export function QualityPicker({
  qualities,
  value,
  onChange,
  className = "",
}: {
  qualities: string[];
  value: string | undefined;
  onChange: (quality: string) => void;
  className?: string;
}) {
  if (qualities.length < 2) return null;
  return (
    <div className={className}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">Quality</p>
      <div role="radiogroup" aria-label="Select quality" className="flex flex-wrap gap-3">
        {qualities.map((q) => (
          <button
            key={q}
            type="button"
            role="radio"
            aria-checked={q === value}
            onClick={() => onChange(q)}
            className={`border px-4 py-2 text-sm transition-colors ${
              q === value ? "border-royal bg-royal text-cream" : "border-border text-ink hover:border-royal"
            }`}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
