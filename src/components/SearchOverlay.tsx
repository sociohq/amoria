"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { listProducts } from "@/lib/products";
import { formatAed } from "@/lib/money";
import { useIsClient } from "@/lib/useIsClient";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 250;

// Full-screen product search, opened from the header's magnifier. Typing
// shows live matches (debounced); pressing Enter / "See all results" opens
// the shop page filtered by the same query. Rendered through a portal so it
// sits above every other fixed layer (the header's own stacking context,
// the floating Find Your Scent button and chat) instead of being trapped
// inside the header.
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  // The last completed search, tagged with the query it answered — so a
  // slow response for an older query is never shown against newer text.
  const [found, setFound] = useState<{ q: string; products: Product[] } | null>(null);
  const mounted = useIsClient();

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < MIN_QUERY_LENGTH) return;
    let cancelled = false;
    const t = setTimeout(() => {
      listProducts({ search: q, limit: 8 })
        .then((r) => !cancelled && setFound({ q, products: r.products }))
        .catch(() => !cancelled && setFound({ q, products: [] }));
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onClose();
    router.push(`/shop?search=${encodeURIComponent(q)}`);
  }

  if (!mounted || !open) return null;

  const q = query.trim();
  const answered = found?.q === q;
  const results = answered ? found.products : [];

  return createPortal(
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Search products">
      <button aria-label="Close search" className="absolute inset-0 cursor-default bg-black/55" onClick={onClose} />
      <div data-lenis-prevent className="relative max-h-[85vh] overflow-y-auto bg-white shadow-xl">
        <form onSubmit={submit} className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 text-ink-soft">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search perfumes, oils, bukhoor…"
            enterKeyHint="search"
            className="min-w-0 flex-1 bg-transparent py-1 text-base text-ink outline-none placeholder:text-ink-soft/60"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="shrink-0 text-ink-soft hover:text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <div className="border-t border-border">
          <div className="mx-auto max-w-3xl px-4 pb-5 pt-3 sm:px-6">
            {q.length < MIN_QUERY_LENGTH ? (
              <p className="py-6 text-sm text-ink-soft">Start typing to find a fragrance, brand or product.</p>
            ) : !answered ? (
              <p className="py-6 text-sm text-ink-soft">Searching…</p>
            ) : results.length === 0 ? (
              <p className="py-6 text-sm text-ink-soft">No products found for “{q}”.</p>
            ) : (
              <>
                <ul className="divide-y divide-border">
                  {results.map((p) => {
                    const image = p.thumbnailImage ?? p.images[0]?.url;
                    return (
                      <li key={p.id}>
                        <Link
                          href={`/product/${p.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3 py-3 transition-colors hover:text-royal"
                        >
                          <span className="relative h-14 w-14 shrink-0 overflow-hidden bg-cream-dark">
                            {image && <Image src={image} alt="" fill sizes="56px" className="object-contain" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-serif text-base text-ink">{p.name}</span>
                            {p.fragranceFamily && <span className="block truncate text-xs text-ink-soft">{p.fragranceFamily}</span>}
                          </span>
                          <span className="shrink-0 text-sm text-gold">{formatAed(p.variants[0]?.price ?? p.price)}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <button
                  type="button"
                  onClick={submit}
                  className="mt-3 w-full border border-ink py-3 label-caps text-ink transition-colors hover:bg-ink hover:text-cream"
                >
                  See all results
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
