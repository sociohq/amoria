"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { SearchOverlay } from "./SearchOverlay";

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// The compact top bar for a product page on phones and tablets: back, the brand
// mark, the product's name, then search, wishlist and the bag. It stands in for the
// site header there (which hides itself on product pages below the desktop width).
export function ProductMobileHeader({ name }: { name: string }) {
  const router = useRouter();
  const { itemCount, openDrawer } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);

  function goBack() {
    // Straight to the shop when the page was opened directly (nothing to go back to).
    if (window.history.length > 1) router.back();
    else router.push("/shop");
  }

  return (
    <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-cream px-4 text-ink lg:hidden">
      <button type="button" onClick={goBack} aria-label="Back" className="-ml-1 shrink-0 p-1">
        <svg {...iconProps}>
          <path d="m15 6-6 6 6 6" />
        </svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/amoria-mark.svg" alt="" className="h-8 w-8 shrink-0 rounded-full border border-border bg-white/60 p-1" />
      <p className="min-w-0 flex-1 truncate text-[15px] font-medium">{name}</p>
      <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" className="shrink-0 p-1">
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
      <Link href="/wishlist" aria-label="Wishlist" className="shrink-0 p-1">
        <svg {...iconProps}>
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
        </svg>
      </Link>
      <button type="button" onClick={openDrawer} aria-label="Open cart" className="relative shrink-0 p-1">
        <svg {...iconProps}>
          <path d="M6 8h12l-1 12H7L6 8Z" />
          <path d="M9 8V7a3 3 0 0 1 6 0v1" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson px-1 text-[10px] text-cream">
            {itemCount}
          </span>
        )}
      </button>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
