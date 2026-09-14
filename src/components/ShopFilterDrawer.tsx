"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/types";

interface ShopFilterDrawerProps {
  categories: Category[];
  currentCategory?: string;
  currentSort: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

// Mirrors the header mega menu's grouping (see Header.tsx) so "Filter"
// presents the same categories the same way shoppers already browse them
// by, rather than a flat, re-sorted list.
const GROUP_ORDER = ["Shop By Gender", "Shop By Type", "Collections"];

// Slide-out panel — same fixed/backdrop/translate-x pattern as CartDrawer
// and AuthDrawer, so it reads as the same UI language as the rest of the
// site rather than a one-off.
export function ShopFilterDrawer({
  categories,
  currentCategory,
  currentSort,
  currentMinPrice,
  currentMaxPrice,
}: ShopFilterDrawerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(currentCategory ?? "");
  const [minPrice, setMinPrice] = useState(currentMinPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice ?? "");

  const groups = GROUP_ORDER.map((group) => ({
    group,
    items: categories.filter((c) => c.menuGroup === group),
  })).filter((g) => g.items.length > 0);

  // Reflects what's actually applied to the page right now — shown on the
  // trigger even while the drawer is closed, independent of whatever's
  // being drafted inside it.
  const activeCount = [currentCategory, currentMinPrice, currentMaxPrice].filter(Boolean).length;

  function openDrawer() {
    // Re-sync the draft with whatever's currently applied — the URL may
    // have changed (Back button, a sort link) since this last opened.
    setCategory(currentCategory ?? "");
    setMinPrice(currentMinPrice ?? "");
    setMaxPrice(currentMaxPrice ?? "");
    setOpen(true);
  }

  function buildUrl(overrides: { category?: string; minPrice?: string; maxPrice?: string }) {
    const params = new URLSearchParams();
    if (overrides.category) params.set("category", overrides.category);
    if (currentSort !== "newest") params.set("sort", currentSort);
    if (overrides.minPrice) params.set("minPrice", overrides.minPrice);
    if (overrides.maxPrice) params.set("maxPrice", overrides.maxPrice);
    const qs = params.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }

  function apply() {
    router.push(buildUrl({ category, minPrice, maxPrice }));
    setOpen(false);
  }

  function clearAll() {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    router.push(buildUrl({}));
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={openDrawer}
        className="flex items-center gap-2 label-caps text-ink-soft transition-colors hover:text-emerald"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <circle cx="9" cy="7" r="2.2" fill="var(--color-cream)" />
          <line x1="4" y1="17" x2="20" y2="17" />
          <circle cx="15" cy="17" r="2.2" fill="var(--color-cream)" />
        </svg>
        Filter
        {activeCount > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald text-[10px] text-cream">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Filter products"
      >
        <div className="flex items-center justify-between border-b border-border px-8 py-7">
          <p className="font-serif text-2xl text-ink">Filter</p>
          <button onClick={() => setOpen(false)} aria-label="Close filters" className="text-ink-soft hover:text-ink">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-8 py-7">
          {groups.map(({ group, items }) => (
            <div key={group}>
              <h3 className="label-caps text-ink-soft">{group}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {items.map((c) => {
                  const active = category === c.slug;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCategory(active ? "" : c.slug)}
                      className={`border px-4 py-2 text-sm transition-colors ${
                        active ? "border-emerald bg-emerald text-cream" : "border-border text-ink hover:border-emerald"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div>
            <h3 className="label-caps text-ink-soft">Price (AED)</h3>
            <div className="mt-3 flex items-center gap-3">
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-emerald"
              />
              <span className="text-ink-soft">—</span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-emerald"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t border-border px-8 py-7">
          <button
            onClick={apply}
            className="w-full bg-emerald py-4 label-caps text-cream transition-opacity hover:opacity-90"
          >
            Apply Filters
          </button>
          {activeCount > 0 && (
            <button onClick={clearAll} className="w-full text-center text-sm text-ink-soft underline hover:text-emerald">
              Clear All
            </button>
          )}
        </div>
      </div>
    </>
  );
}
