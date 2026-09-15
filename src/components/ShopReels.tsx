"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Reel } from "@/lib/types";
import { formatAed } from "@/lib/money";
import { listReels } from "@/lib/reels";
import { useCart } from "@/lib/cart-context";

function ReelCard({ reel }: { reel: Reel }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCart();
  const { product } = reel;
  const variant = product.variants[0];
  const imageUrl = product.thumbnailImage ?? product.images[0]?.url;

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  async function handleAddToCart() {
    if (!variant) return;
    setAdding(true);
    try {
      await addItem({
        variantId: variant.id,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantSize: variant.size,
        price: variant.price,
        image: imageUrl ?? null,
      });
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="w-[220px] shrink-0 snap-start">
      <div className="relative aspect-[9/16] overflow-hidden bg-cream-dark">
        <video ref={videoRef} src={reel.videoUrl} autoPlay muted loop playsInline className="h-full w-full object-cover" />
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/50 text-cream backdrop-blur-sm hover:bg-ink/70"
        >
          {muted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 9v6h4l5 5V4L8 9H4z" strokeLinejoin="round" />
              <path d="M16 9l5 6M21 9l-5 6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 9v6h4l5 5V4L8 9H4z" strokeLinejoin="round" />
              <path d="M16 8a5 5 0 0 1 0 8M18.5 5.5a9 9 0 0 1 0 13" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Link href={`/product/${product.slug}`} className="relative h-12 w-12 shrink-0 overflow-hidden bg-cream-dark">
          {imageUrl && <Image src={imageUrl} alt={product.name} fill sizes="48px" className="object-cover" />}
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/product/${product.slug}`} className="block truncate text-sm text-ink hover:text-royal">
            {product.name}
          </Link>
          <p className="text-xs text-ink-soft">{formatAed(variant?.price ?? product.price)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!variant || variant.stock === 0 || adding}
          aria-label="Add to cart"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// A horizontal carousel of looping, muted-by-default product videos —
// content is entirely admin-managed (see /admin/reels): which products get
// featured, in what order, and their video clips. Renders nothing until at
// least one is added.
export function ShopReels() {
  const [reels, setReels] = useState<Reel[] | null>(null);

  useEffect(() => {
    listReels()
      .then(setReels)
      .catch(() => setReels([]));
  }, []);

  if (!reels || reels.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <p className="label-caps text-gold">Watch & Shop</p>
      <h2 className="mt-1 font-serif text-3xl text-ink">Shop By Reels</h2>
      <div className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden pb-4">
        {reels.map((r) => (
          <ReelCard key={r.id} reel={r} />
        ))}
      </div>
    </section>
  );
}
