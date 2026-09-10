"use client";

import { useState, ReactNode } from "react";

export function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="label-caps flex w-full items-center justify-between py-4 text-left text-ink"
      >
        {title}
        <span className="text-lg font-light">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="pb-5 text-sm leading-relaxed text-ink-soft">{children}</div>}
    </div>
  );
}
