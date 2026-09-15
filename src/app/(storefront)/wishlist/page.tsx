"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useAuthDrawer } from "@/lib/auth-drawer-context";
import { formatAed } from "@/lib/money";
import { WishlistItem } from "@/lib/types";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { openDrawer } = useAuthDrawer();
  const { items, loading, remove } = useWishlist();
  const { addItem } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  async function handleAddToCart(item: WishlistItem) {
    const { product } = item;
    const variant = product.variants[0];
    if (!variant) return;
    setAddingId(item.productId);
    try {
      await addItem({
        variantId: variant.id,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantSize: variant.size,
        price: variant.price,
        image: product.thumbnailImage ?? product.images[0]?.url ?? null,
      });
    } finally {
      setAddingId(null);
    }
  }

  if (!authLoading && !user) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="mx-auto text-ink-soft"
        >
          <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1 4.5 2.5C11.5 6 13 5 15 5c3.5 0 5.5 3.5 3.5 7.5C19 16.65 12 21 12 21z" />
        </svg>
        <h1 className="mt-4 font-serif text-2xl text-ink">Sign in to see your wishlist</h1>
        <p className="mt-3 text-sm text-ink-soft">Save fragrances you love and come back to them anytime.</p>
        <button
          onClick={() => openDrawer("login")}
          className="mt-6 bg-ink px-8 py-3 label-caps text-cream hover:opacity-90"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading || authLoading) {
    return <p className="px-6 py-24 text-center text-ink-soft">Loading…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="mx-auto text-ink-soft"
        >
          <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1 4.5 2.5C11.5 6 13 5 15 5c3.5 0 5.5 3.5 3.5 7.5C19 16.65 12 21 12 21z" />
        </svg>
        <h1 className="mt-4 font-serif text-2xl text-ink">Your wishlist is empty</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Save the fragrances that catch your eye. Tap the heart on any product to add it here.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block border border-ink px-8 py-3 label-caps text-ink hover:bg-ink hover:text-cream"
        >
          Explore Fragrances
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-16">
      <h1 className="font-serif text-3xl text-ink">Your Wishlist</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {items.length} saved {items.length === 1 ? "item" : "items"}
      </p>

      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => {
          const { product } = item;
          const imageUrl = product.thumbnailImage ?? product.images[0]?.url;
          const variant = product.variants[0];
          return (
            <div key={item.id}>
              <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-cream-dark">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-serif text-sm tracking-widest text-ink-soft">AMORIA</span>
                  </div>
                )}
              </Link>
              <div className="mt-3">
                <Link href={`/product/${product.slug}`}>
                  <p className="font-serif text-xl text-ink hover:text-royal">{product.name}</p>
                </Link>
                {product.categories[0] && <p className="text-xs text-ink-soft">{product.categories[0].name}</p>}
                <p className="mt-1 text-sm text-ink">{formatAed(variant?.price ?? product.price)}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!variant || variant.stock === 0 || addingId === item.productId}
                    className="flex-1 bg-ink py-2 label-caps text-cream hover:opacity-90 disabled:opacity-50"
                  >
                    {variant?.stock === 0 ? "Out of Stock" : addingId === item.productId ? "Adding…" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => remove(item.productId)}
                    aria-label="Remove from wishlist"
                    className="border border-border px-3 text-ink-soft hover:border-crimson hover:text-crimson"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
