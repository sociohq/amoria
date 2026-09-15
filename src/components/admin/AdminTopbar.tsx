"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "./AdminSidebar";

// Derives the page title from the current path against the sidebar's own
// nav list, rather than asking every admin page to declare one — one
// less thing each page has to remember to set.
function currentTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  const match = [...ADMIN_NAV_ITEMS].sort((a, b) => b.href.length - a.href.length).find((i) => pathname.startsWith(i.href));
  return match?.label ?? "Admin";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function AdminTopbar() {
  const pathname = usePathname();
  // A genuine reachability check against the backend's own /health route
  // (not the /api/* mount, so it isn't subject to the origin allowlist)
  // rather than a decorative dot that always shows green regardless of
  // whether the API is actually up.
  const [apiUp, setApiUp] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/health`)
      .then((r) => {
        if (!cancelled) setApiUp(r.ok);
      })
      .catch(() => {
        if (!cancelled) setApiUp(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-cream px-8">
      <h1 className="text-lg font-medium text-ink">{currentTitle(pathname)}</h1>
      <div className="hidden items-center gap-1.5 text-xs text-ink-soft sm:flex">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            apiUp === null ? "bg-ink-soft/40" : apiUp ? "bg-royal" : "bg-crimson"
          }`}
        />
        {apiUp === null ? "Checking API…" : apiUp ? "API Connected" : "API Unreachable"}
      </div>
    </header>
  );
}
