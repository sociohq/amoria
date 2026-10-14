"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";

interface SortOption {
  value: string;
  label: string;
  href: string;
}

// The phone version of the listing's sort + filter controls: a bar pinned to
// the bottom edge with "Sort by <current>" on the left and the filter on the
// right (passed in as `filter`, the same drawer the desktop button opens).
// Sorting opens a bottom sheet of the same options the desktop links offer.
export function ShopMobileBar({
  sorts,
  currentSort,
  filter,
}: {
  sorts: SortOption[];
  currentSort: string;
  filter: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const current = sorts.find((s) => s.value === currentSort) ?? sorts[0];

  // The floating chat/aurora/scroll-top buttons sit in the same bottom corners as
  // this bar, so while it is on screen they lift clear of it (see globals.css).
  useEffect(() => {
    document.documentElement.dataset.shopBar = "1";
    return () => {
      delete document.documentElement.dataset.shopBar;
    };
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 divide-x divide-border border-t border-border bg-white shadow-[0_-4px_16px_rgba(28,26,22,0.06)] sm:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center justify-between gap-3 px-5 py-3 text-left"
          aria-haspopup="dialog"
        >
          <span className="min-w-0">
            <span className="block text-[10px] font-medium uppercase tracking-[2px] text-ink-soft">Sort by</span>
            <span className="mt-0.5 block truncate text-sm font-medium text-ink">{current.label}</span>
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink">
            <path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3" />
          </svg>
        </button>
        {filter}
      </div>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 sm:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sort products"
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-cream px-6 pb-8 pt-3 shadow-xl transition-transform duration-300 sm:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <div className="mb-2 flex items-center justify-between">
          <p className="font-serif text-xl text-ink">Sort by</p>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="p-1 text-ink-soft hover:text-ink">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ul>
          {sorts.map((s) => (
            <li key={s.value}>
              <Link
                href={s.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-border py-3.5 text-sm text-ink last:border-b-0"
              >
                <span className={s.value === currentSort ? "font-medium" : ""}>{s.label}</span>
                {s.value === currentSort && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-royal">
                    <path d="M5 12l5 5 9-10" />
                  </svg>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
