"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

// Grows/shrinks from a measured pixel height rather than popping the
// content in and out instantly — same technique as MegaMenu.tsx (CSS
// can't transition to/from `height: auto` on its own, so the content's
// natural height is measured via a ref and animated to/from 0).
export function Accordion({
  title,
  subtitle,
  children,
  defaultOpen = false,
}: {
  title: string;
  // A short grey line under the title, shown on phones only.
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  // "auto" for the very first render only, so a defaultOpen accordion
  // shows fully expanded immediately instead of flashing closed-then-open
  // while the height-measuring effect below catches up.
  const [height, setHeight] = useState<number | "auto">(defaultOpen ? "auto" : 0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setHeight(open ? (contentRef.current?.scrollHeight ?? 0) : 0);
  }, [open]);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="label-caps flex w-full items-center justify-between gap-4 py-4 text-left text-ink"
        aria-expanded={open}
      >
        <span className="min-w-0">
          {title}
          {subtitle && (
            <span className="mt-1.5 block text-[13px] font-normal normal-case tracking-normal text-ink-soft lg:hidden">{subtitle}</span>
          )}
        </span>
        <span className="hidden text-lg font-light lg:inline">{open ? "−" : "+"}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 transition-transform duration-300 lg:hidden ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div style={{ height }} className="overflow-hidden transition-[height] duration-300 ease-in-out">
        <div ref={contentRef} className="pb-5 text-sm leading-relaxed text-ink-soft">
          {children}
        </div>
      </div>
    </div>
  );
}
