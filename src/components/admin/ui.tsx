"use client";

import { ReactNode, useId, useState } from "react";

// Shared visual language for every admin page — a dashboard should read
// as one tool, not ten differently-styled forms. Storefront conventions
// (font-serif headings, label-caps uppercase buttons, bottom-line-focus
// inputs) belonged to the luxury storefront brand; the dashboard instead
// uses plain sans text, rounded-md controls, and white bordered cards —
// the same "software, not marketing site" language most real dashboards
// (Stripe, Linear, Vercel) share.

export const inputClass =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-ink/40 focus:ring-2 focus:ring-ink/5 disabled:opacity-60";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// `as="form"` renders a real <form> element (so onSubmit/Enter-to-submit
// actually work) with the same card chrome, instead of a div pretending
// to be one — several admin pages are a single form that IS the card.
type CardProps =
  | ({ as: "form" } & React.FormHTMLAttributes<HTMLFormElement>)
  | ({ as?: "div" } & React.HTMLAttributes<HTMLDivElement>);

export function Card({ className = "", as = "div", ...rest }: CardProps) {
  const cardClassName = `rounded-xl border border-border bg-white ${className}`;
  if (as === "form") {
    return <form className={cardClassName} {...(rest as React.FormHTMLAttributes<HTMLFormElement>)} />;
  }
  return <div className={cardClassName} {...(rest as React.HTMLAttributes<HTMLDivElement>)} />;
}

const BUTTON_BASE = "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
const BUTTON_SIZE = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2" };
const BUTTON_VARIANT = {
  primary: "bg-ink text-cream hover:bg-ink/90",
  secondary: "border border-border bg-white text-ink hover:bg-cream-dark/60",
  danger: "text-crimson hover:bg-crimson/5",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof BUTTON_VARIANT;
  size?: keyof typeof BUTTON_SIZE;
}) {
  return (
    <button
      className={`${BUTTON_BASE} ${BUTTON_SIZE[size]} ${BUTTON_VARIANT[variant]} ${className}`}
      {...props}
    />
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-xs font-medium text-ink-soft">{children}</label>;
}

// The bare `<input type="file">` renders inconsistently across browsers
// (an unstyled OS button plus filename text that's easy to miss, or to
// mistake for a disabled control). This wraps it as a clearly-clickable
// button with the selected filename shown as its own visible text —
// pass a `key` that changes after a successful upload (e.g. the current
// image URL) to clear the native input and this label together.
export function FileInput({
  accept,
  multiple,
  onSelect,
  className = "",
}: {
  accept?: string;
  multiple?: boolean;
  onSelect: (files: FileList | null) => void;
  className?: string;
}) {
  const id = useId();
  const [label, setLabel] = useState("No file selected");

  return (
    <label
      htmlFor={id}
      className={`flex min-w-0 cursor-pointer items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-ink transition-colors hover:bg-cream-dark/60 ${className}`}
    >
      <span className="shrink-0 rounded bg-cream-dark px-2 py-0.5 text-xs font-medium text-ink">
        {multiple ? "Choose Files" : "Choose File"}
      </span>
      <span className="truncate text-ink-soft">{label}</span>
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          const files = e.target.files;
          setLabel(
            !files || files.length === 0
              ? "No file selected"
              : files.length === 1
                ? files[0].name
                : `${files.length} files selected`
          );
          onSelect(files);
        }}
      />
    </label>
  );
}

// Consistent table chrome (muted header row, hairline row dividers,
// generous cell padding) — used as a drop-in wrapper: <Table><thead>...
export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3">
        {children}
      </table>
    </div>
  );
}

const BADGE_TONE = {
  neutral: "bg-ink/5 text-ink-soft",
  success: "bg-royal/10 text-royal",
  warning: "bg-gold/15 text-gold",
  danger: "bg-crimson/10 text-crimson",
};

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof BADGE_TONE; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_TONE[tone]}`}>
      {children}
    </span>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="border-b border-border bg-cream-dark/50 text-left text-xs font-medium uppercase tracking-wide text-ink-soft">{children}</thead>;
}
