"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";
import { availableShopNav, shopHref } from "@/lib/nav";

// The "Shop" nav item's dropdown — the category tree from lib/nav.ts (parents
// with their sub-categories listed beneath), plus a promo image tile for
// whichever category is flagged `featuredInMenu`. Opens by growing from 0 to
// its measured content height rather than a plain fade — CSS can't
// transition to `height: auto` on its own, so the content's natural height
// is measured via a ref.
export function MegaMenu({ categories, open }: { categories: Category[]; open: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  // The panel is anchored under its "Shop" trigger, which sits left of
  // centre — on narrower desktops it would run off the right edge. On open
  // it's slid left by exactly the overflow (never past the left margin), so
  // it always stays on screen without needing a different anchor.
  const [shift, setShift] = useState(0);

  useEffect(() => {
    setHeight(open ? (contentRef.current?.scrollHeight ?? 0) : 0);
    if (!open) return;
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;
    const margin = 24;
    const left = wrapper.getBoundingClientRect().left + shift; // where it sits with no shift
    const overflow = left + content.offsetWidth - (document.documentElement.clientWidth - margin);
    setShift(Math.max(0, Math.min(overflow, left - margin)));
    // shift is derived from the other values and only read here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, categories]);

  if (categories.length === 0) return null;

  const nav = availableShopNav(categories);
  const featured = categories.find((c) => c.featuredInMenu && c.image);
  // Only truly "open" once the real height has been measured and applied —
  // keeps the opacity fade in step with the height grow instead of jumping
  // ahead of it by a render.
  const visible = open && height > 0;

  return (
    // The panel's content is wider than its "Shop" trigger (w-max, so it
    // can span under the other nav items) — while closed this outer box
    // still occupies that full width, just at zero height, and without
    // pointer-events-none here that invisible strip stays a real hover
    // target: moving the mouse near the bottom of *any* nav item close
    // enough to clip it would re-open this menu. Gated on `open` (not
    // `visible`) so it becomes interactive the instant you hover the
    // trigger, not only once the height animation finishes measuring.
    <div
      ref={wrapperRef}
      style={{ marginLeft: -shift }}
      className={`absolute left-0 top-full pt-3 ${open ? "" : "pointer-events-none"}`}
    >
      <div
        style={{ height }}
        className={`overflow-hidden transition-[height,opacity] duration-300 ease-in ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          ref={contentRef}
          className="flex w-max max-w-[calc(100vw-3rem)] gap-10 border border-border bg-white px-8 py-8 shadow-sm lg:gap-12 lg:px-10"
        >
          <div className="columns-2 gap-10 [column-fill:balance] lg:columns-3 lg:gap-12">
            {nav.map((node) => (
              <div key={node.slug} className="mb-5 break-inside-avoid">
                <Link
                  href={shopHref(node.slug)}
                  className="whitespace-nowrap text-sm font-medium text-ink transition-colors hover:text-royal"
                >
                  {node.label}
                </Link>
                {node.children && (
                  <ul className="mt-2 space-y-1.5 border-l border-border pl-3">
                    {node.children.map((child) => (
                      <li key={child.slug}>
                        <Link
                          href={shopHref(child.slug)}
                          className="whitespace-nowrap text-[13px] text-ink-soft transition-colors hover:text-royal"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {featured && (
            <Link
              href={shopHref(featured.slug)}
              className="group/promo relative hidden w-52 shrink-0 self-start overflow-hidden lg:block xl:w-60"
            >
              <div className="relative aspect-[4/5] bg-cream-dark">
                <Image
                  src={featured.image!}
                  alt={featured.name}
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-500 group-hover/promo:scale-105"
                />
              </div>
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-4 py-4 text-xs uppercase tracking-[0.12em] text-cream">
                {featured.name}
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
