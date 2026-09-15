"use client";

import { InfoSection } from "@/lib/types";
import { inputClass } from "@/components/admin/ui";

// The product page's accordion sections ("Sizes and Refills", "Shipping,
// Returns and Questions", etc.) used to be identical hardcoded copy on
// every product — this is what actually makes them editable: both the
// heading and the body are freeform per section, add/remove/reorder like
// PostBlockEditor's content blocks, rather than a fixed set of named
// fields an admin can't rename or add to.
export function InfoSectionsEditor({
  sections,
  onChange,
}: {
  sections: InfoSection[];
  onChange: (sections: InfoSection[]) => void;
}) {
  function update(i: number, patch: Partial<InfoSection>) {
    onChange(sections.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function remove(i: number) {
    onChange(sections.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function add() {
    onChange([...sections, { heading: "", content: "" }]);
  }

  return (
    <div className="space-y-3">
      {sections.map((s, i) => (
        <div key={i} className="rounded-lg border border-border bg-cream-dark/40 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">Section {i + 1}</span>
            <div className="flex items-center gap-3 text-xs">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-ink-soft hover:text-ink disabled:opacity-30">
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === sections.length - 1}
                className="text-ink-soft hover:text-ink disabled:opacity-30"
              >
                ↓
              </button>
              <button type="button" onClick={() => remove(i)} className="text-crimson hover:underline">
                Remove
              </button>
            </div>
          </div>
          <input
            placeholder="Heading (e.g. Sizes and Refills)"
            value={s.heading}
            onChange={(e) => update(i, { heading: e.target.value })}
            className={`${inputClass} font-medium`}
          />
          <textarea
            placeholder="Content shown when this section is expanded"
            rows={3}
            value={s.content}
            onChange={(e) => update(i, { content: e.target.value })}
            className={`${inputClass} mt-2`}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-md border border-border px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
      >
        + Add section
      </button>
    </div>
  );
}
