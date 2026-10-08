import Link from "next/link";

type Item = number | "gap-start" | "gap-end";

// 1 … 4 5 6 … 18 — the first and last page, the current page and `siblings`
// neighbours either side, with "…" wherever pages are skipped. A catalogue of
// 200+ products runs to dozens of pages, so listing every number overflowed a
// phone's width.
function pageItems(current: number, total: number, siblings: number): Item[] {
  const wanted = new Set<number>([1, total]);
  for (let n = current - siblings; n <= current + siblings; n++) if (n >= 1 && n <= total) wanted.add(n);
  const pages = [...wanted].sort((a, b) => a - b);
  const items: Item[] = [];
  pages.forEach((n, i) => {
    const prev = pages[i - 1];
    if (prev !== undefined && n - prev > 1) {
      // A single skipped page is shown as itself rather than as "…".
      if (n - prev === 2) items.push(prev + 1);
      else items.push(i === 1 ? "gap-start" : "gap-end");
    }
    items.push(n);
  });
  return items;
}

const CELL = "flex h-10 min-w-10 items-center justify-center px-1 text-sm";

export function Pagination({
  current,
  total,
  hrefFor,
}: {
  current: number;
  total: number;
  hrefFor: (page: number) => string;
}) {
  if (total <= 1) return null;
  const page = Math.min(Math.max(current, 1), total);

  const arrow = (target: number, disabled: boolean, label: string, glyph: string) =>
    disabled ? (
      <span aria-hidden className={`${CELL} text-ink-soft/30`}>
        {glyph}
      </span>
    ) : (
      <Link href={hrefFor(target)} aria-label={label} className={`${CELL} text-ink hover:text-royal`}>
        {glyph}
      </Link>
    );

  const row = (siblings: number, className: string) => (
    <ul className={`items-center justify-center gap-0.5 sm:gap-1 ${className}`}>
      <li>{arrow(page - 1, page === 1, "Previous page", "‹")}</li>
      {pageItems(page, total, siblings).map((item) =>
        typeof item !== "number" ? (
          <li key={item} aria-hidden className={`${CELL} text-ink-soft`}>
            …
          </li>
        ) : (
          <li key={item}>
            <Link
              href={hrefFor(item)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              className={`${CELL} ${item === page ? "bg-royal text-cream" : "text-ink-soft hover:text-royal"}`}
            >
              {item}
            </Link>
          </li>
        )
      )}
      <li>{arrow(page + 1, page === total, "Next page", "›")}</li>
    </ul>
  );

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-col items-center gap-2">
      {/* Phones get the compact row (first · current · last), wider screens
          also show the pages next to the current one. */}
      {row(0, "flex sm:hidden")}
      {row(1, "hidden sm:flex")}
      <p className="text-xs text-ink-soft">
        Page {page} of {total}
      </p>
    </nav>
  );
}
