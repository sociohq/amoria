"use client";

import { useState } from "react";

// A code chip with a Copy button, used by the Golden Friday popup and homepage banner.
export function CopyCodeButton({ code, label = "Copy" }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard blocked: select the code so it can be copied by hand.
      const el = document.getElementById(`code-${code}`);
      if (el) window.getSelection()?.selectAllChildren(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-stretch border border-gold/60 text-cream">
      <span
        id={`code-${code}`}
        className="min-w-0 flex-1 select-all px-4 py-3 text-center font-mono text-lg tracking-[0.25em]"
      >
        {code}
      </span>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 bg-gold px-5 label-caps text-ink transition-opacity hover:opacity-90"
      >
        {copied ? "Copied" : label}
      </button>
    </div>
  );
}
