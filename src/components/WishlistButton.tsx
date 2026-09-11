"use client";

import { useWishlist } from "@/lib/wishlist-context";

// A small heart toggle reused across product cards and the product detail
// page — filled when the product is saved. Stops the click from bubbling
// so it works layered on top of a card's own link/image.
export function WishlistButton({ productId, className = "" }: { productId: string; className?: string }) {
  const { isWishlisted, toggle } = useWishlist();
  const saved = isWishlisted(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      className={className}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1 4.5 2.5C11.5 6 13 5 15 5c3.5 0 5.5 3.5 3.5 7.5C19 16.65 12 21 12 21z" />
      </svg>
    </button>
  );
}
