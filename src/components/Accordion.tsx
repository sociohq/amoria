"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

// Grows/shrinks from a measured pixel height rather than popping the
// content in and out instantly — same technique as MegaMenu.tsx (CSS
// can't transition to/from `height: auto` on its own, so the content's
// natural height is measured via a ref and animated to/from 0).
export function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
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
        className="label-caps flex w-full items-center justify-between py-4 text-left text-ink"
      >
        {title}
        <span className="text-lg font-light">{open ? "−" : "+"}</span>
      </button>
      <div style={{ height }} className="overflow-hidden transition-[height] duration-300 ease-in-out">
        <div ref={contentRef} className="pb-5 text-sm leading-relaxed text-ink-soft">
          {children}
        </div>
      </div>
    </div>
  );
}
