"use client";

import { useEffect, useRef, useState } from "react";

// The product's description paragraph, shown right under the price so a shopper reads what the
// fragrance is before anything else. It is trimmed to a few lines, and "Read more" appears only
// when text is genuinely cut off (a paragraph that already fits shows no toggle). The full text
// is also in the "Product information" section further down the page.
const CLAMP_LINES = 4;

export function DescriptionLead({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const body = text.trim();

  // Measured while collapsed, and again whenever the width changes (a phone wraps to more lines
  // than a desktop), so the toggle always matches what is really on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || open) return;
    const measure = () => setTruncated(el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [body, open]);

  if (!body) return null;

  return (
    <div className="mt-5 lg:mt-4">
      <p
        ref={ref}
        className="whitespace-pre-line text-sm leading-relaxed text-ink-soft"
        style={
          open
            ? undefined
            : { display: "-webkit-box", WebkitLineClamp: CLAMP_LINES, WebkitBoxOrient: "vertical", overflow: "hidden" }
        }
      >
        {body}
      </p>
      {(truncated || open) && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-1.5 text-sm font-medium text-ink underline underline-offset-4 hover:text-royal"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
