"use client";

import { useState } from "react";

// The product's description paragraph, shown right under the price so a shopper reads what the
// fragrance is before anything else. Long ones are trimmed to a few lines with "Read more"; the
// full text is also in the "Product information" section further down the page.
const CLAMP_FROM = 220; // characters; shorter text is shown whole, with no toggle

export function DescriptionLead({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const body = text.trim();
  if (!body) return null;
  const long = body.length > CLAMP_FROM;

  return (
    <div className="mt-5 lg:mt-4">
      <p
        className="whitespace-pre-line text-sm leading-relaxed text-ink-soft"
        style={
          long && !open
            ? { display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }
            : undefined
        }
      >
        {body}
      </p>
      {long && (
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
