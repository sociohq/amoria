"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFreeShippingThreshold } from "@/lib/useFreeShippingThreshold";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { compareFor, formatAed, percentOff } from "@/lib/money";
import { formatConcentration, deliveryEstimate, productInfoSections } from "@/lib/format";
import { StarRating } from "./StarRating";
import { Accordion } from "./Accordion";
import { useCart } from "@/lib/cart-context";
import { WishlistButton } from "./WishlistButton";
import { ProductGallery } from "./ProductGallery";
import { ProductMobileHeader } from "./ProductMobileHeader";
import { galleryFor, imageForSize } from "@/lib/productImages";
import { ScentPyramid, ScentTiles } from "./ScentPyramid";
import { SupportIcon, AuthenticIcon, ShippingIcon } from "./icons/TrustIcons";
import { WHATSAPP_NUMBER } from "./WhatsAppButton";

// A one-line caption under each standard section's title on phones.
const SECTION_SUBTITLES: Record<string, string> = {
  Description: "What it is and how it wears",
  "Scent Pyramid": "Top, heart and base notes",
  "Perfumer's Note": "The story behind the scent",
  "Fragrance Details": "Family, longevity, sillage",
  "Sizes and Refills": "Bottle sizes and refills",
  "How, When & Where to Apply Fragrances": "Pulse points, occasions, seasons",
  "Shipping, Returns and Questions": "Delivery, returns, FAQs",
};

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const freeFrom = useFreeShippingThreshold();
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // The phone's sticky price / Add to cart bar sits at the bottom edge, so the floating
  // chat / aurora / scroll-to-top buttons lift clear of it (see globals.css).
  useEffect(() => {
    document.documentElement.dataset.pdpBar = "1";
    return () => {
      delete document.documentElement.dataset.pdpBar;
    };
  }, []);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const price = variant?.price ?? product.price;
  const compare = compareFor(product, variant);
  const off = percentOff(price, compare);
  // The photos for the size picked — a size can have its own bottle shots
  // (see galleryFor). Otherwise the dedicated thumbnail (if set) leads, as
  // the product's main shot.
  const galleryImages = galleryFor(product, variant?.size);
  const images = galleryImages.length > 0 ? galleryImages : [{ id: "placeholder", url: "", altText: null, position: 0 }];
  const category = product.categories[0]?.name;
  const concentration = product.concentrationType ? formatConcentration(product.concentrationType) : null;
  const hasNotes = product.topNotes.length > 0 || product.heartNotes.length > 0 || product.baseNotes.length > 0;
  const fragranceDetails = [
    product.fragranceFamily && { label: "Fragrance Family", value: product.fragranceFamily },
    product.season && { label: "Season", value: product.season },
    product.scentSillage && { label: "Sillage", value: product.scentSillage },
    product.scentLongevity && { label: "Longevity", value: product.scentLongevity },
    product.designHouse && { label: "Design House", value: product.designHouse },
    product.yearIntroduced && { label: "Year Introduced", value: String(product.yearIntroduced) },
  ].filter((d): d is { label: string; value: string } => Boolean(d));
  const unavailable = !variant || variant.stock === 0;

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
        image: imageForSize(product, variant?.size),
        quantity,
      });
    } finally {
      setAdding(false);
    }
  }

  async function handleBuyNow() {
    await handleAddToCart();
    router.push("/checkout");
  }

  const trustItems = [
    { icon: ShippingIcon, label: "Free shipping", sub: freeFrom ? `On all orders above AED ${freeFrom}` : "On qualifying orders" },
    { icon: AuthenticIcon, label: "100% Authentic", sub: "Original & verified products" },
    { icon: SupportIcon, label: "24/7 Support", sub: "We're here to help" },
  ];

  return (
    <>
      <ProductMobileHeader name={product.name} />

      <div className="mx-auto grid w-full max-w-xl gap-6 pb-10 lg:max-w-none lg:grid-cols-2 lg:gap-12 lg:px-6 lg:py-12">
        {/* Gallery — sticky and height-capped to the viewport on large screens
            so the whole image (plus thumbnails) stays fully in view while the
            details column on the right scrolls past it. Edge to edge on phones. */}
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          {/* keyed by size so switching sizes starts the new gallery on its first photo */}
          <ProductGallery
            key={variant?.id ?? "none"}
            images={images}
            name={product.name}
            label={concentration}
            heart={
              <WishlistButton
                productId={product.id}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm transition-colors hover:text-crimson"
              />
            }
          />
        </div>

        {/* Details */}
        <div className="px-5 lg:px-0">
          {/* Phones: collection chip and "brand · The Shop" line */}
          <div className="lg:hidden">
            {category && (
              <span className="inline-block rounded-[3px] bg-gold/15 px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-[2px] text-ink">
                {category}
              </span>
            )}
            <Link href="/shop" className="mt-3 flex items-center gap-1 text-sm font-medium text-ink">
              {product.designHouse ?? "Amoria"} · The Shop
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              {category && <p className="label-caps hidden text-ink-soft lg:block">The Shop · {category}</p>}
              <h1 className="mt-2 font-serif text-[28px] leading-[1.2] tracking-normal! text-ink lg:text-3xl lg:leading-snug lg:tracking-[1px]!">
                {product.name} {concentration}
              </h1>
            </div>
            <WishlistButton
              productId={product.id}
              className="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:text-crimson lg:flex"
            />
          </div>
          {product.scentAccords.length > 0 && (
            <p className="mt-2 hidden text-sm text-crimson lg:block">{product.scentAccords.join(" · ")}</p>
          )}

          <div className="mt-3 hidden lg:block">
            <StarRating rating={product.avgRating} reviewCount={product.reviewCount} />
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 lg:mt-4">
            <span className="text-[30px] font-medium leading-none text-ink lg:text-2xl lg:font-normal">{formatAed(price)}</span>
            {compare && off && <span className="text-ink-soft line-through">{formatAed(compare)}</span>}
            {off && <span className="font-medium text-[#2f7d4f] lg:text-royal">{off}% Off</span>}
          </div>
          <p className="mt-2 text-xs text-ink-soft lg:mt-1">Tax included. Shipping calculated at checkout.</p>

          {/* Phones: rating chip */}
          {product.reviewCount > 0 && (
            <div className="mt-4 inline-flex divide-x divide-border overflow-hidden rounded border border-border bg-white text-sm lg:hidden">
              <span className="px-3 py-2 font-medium text-ink">{product.avgRating.toFixed(1)} ★</span>
              <span className="px-3 py-2 text-ink-soft">
                {product.reviewCount} {product.reviewCount === 1 ? "Review" : "Reviews"}
              </span>
            </div>
          )}

          {/* Desktop: size buttons */}
          {product.variants.length > 0 && (
            <div className="mt-6 hidden gap-3 lg:flex">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  disabled={v.stock === 0}
                  className={`border px-4 py-2 text-sm transition-colors ${
                    v.id === variantId ? "border-royal bg-royal text-cream" : "border-border text-ink hover:border-royal"
                  } ${v.stock === 0 ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          )}

          {/* Phones: size tiles with each size's price, then quantity */}
          {product.variants.length > 0 && (
            <div className="mt-6 border-t border-border pt-6 lg:hidden">
              <p className="font-serif text-xl tracking-normal! text-ink">
                Size {variant && <span className="font-sans text-sm text-ink-soft">· {variant.size}</span>}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    disabled={v.stock === 0}
                    aria-pressed={v.id === variantId}
                    className={`min-w-[104px] rounded-md border bg-white px-4 py-3 text-center transition-colors ${
                      v.id === variantId ? "border-2 border-ink" : "border-border"
                    } ${v.stock === 0 ? "cursor-not-allowed opacity-40" : ""}`}
                  >
                    <span className="block text-sm font-medium uppercase tracking-wide text-ink">{v.size}</span>
                    <span className="mt-1 block text-xs text-ink-soft">{formatAed(v.price)}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-ink">Quantity</span>
                <div className="flex items-center rounded border border-border bg-white">
                  <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Fewer" className="px-3.5 py-2 text-ink-soft">
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(variant?.stock ?? 1, q + 1))}
                    aria-label="More"
                    className="px-3.5 py-2 text-ink-soft"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Phones: when it arrives */}
          <div className="mt-6 border-t border-border pt-6 lg:hidden">
            <p className="font-serif text-xl tracking-normal! text-ink">Delivery date</p>
            <p className="mt-3 flex items-start gap-2 text-sm text-ink">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
              <span>
                Order today, you&apos;ll receive your package between <strong>{deliveryEstimate()}</strong>
              </span>
            </p>
            <ul className="mt-5 space-y-4">
              {trustItems.map((b) => (
                <li key={b.label} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-royal">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium text-ink">{b.label}</span>
                    <span className="block text-[13px] text-ink-soft">{b.sub}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop: trust badges */}
          <div className="mt-8 hidden grid-cols-3 gap-4 border-y border-border py-6 text-center lg:grid">
            {trustItems.map((b) => (
              <div key={b.label} className="flex flex-col items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-royal">
                  <b.icon className="h-5 w-5" />
                </div>
                <p className="mt-2 text-xs font-medium text-ink">{b.label}</p>
                <p className="mt-1 text-[11px] text-ink-soft">{b.sub}</p>
              </div>
            ))}
          </div>

          {/* Desktop: quantity, Add to cart, Buy now (phones use the sticky bar) */}
          <div className="hidden lg:block">
            <div className="mt-6 flex gap-3">
              <div className="flex items-center border border-border">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-3 text-ink-soft">
                  −
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(variant?.stock ?? 1, q + 1))}
                  className="px-3 py-3 text-ink-soft"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={unavailable || adding}
                className="flex-1 bg-crimson py-3 label-caps text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {variant?.stock === 0 ? "Out of Stock" : adding ? "Adding…" : "Add to Cart"}
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              disabled={unavailable || adding}
              className="mt-3 w-full bg-ink py-3 label-caps text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>

          <h2 className="mt-8 border-t border-border pt-8 font-serif text-2xl tracking-normal! text-ink lg:hidden">Product information</h2>
          <div className="mt-3 lg:mt-8">
            {product.description?.trim() && (
              <Accordion title="Description" subtitle={SECTION_SUBTITLES.Description} defaultOpen>
                <p className="whitespace-pre-line">{product.description.trim()}</p>
              </Accordion>
            )}
            {hasNotes && (
              <Accordion title="Scent Pyramid" subtitle={SECTION_SUBTITLES["Scent Pyramid"]} defaultOpen>
                <div className="lg:hidden">
                  <ScentTiles top={product.topNotes} heart={product.heartNotes} base={product.baseNotes} />
                </div>
                <div className="hidden lg:block">
                  <ScentPyramid top={product.topNotes} heart={product.heartNotes} base={product.baseNotes} />
                </div>
              </Accordion>
            )}
            {product.perfumerNote && (
              <Accordion title="Perfumer's Note" subtitle={SECTION_SUBTITLES["Perfumer's Note"]}>
                <p>{product.perfumerNote}</p>
              </Accordion>
            )}
            {fragranceDetails.length > 0 && (
              <Accordion title="Fragrance Details" subtitle={SECTION_SUBTITLES["Fragrance Details"]}>
                <dl className="grid grid-cols-2 gap-y-2">
                  {fragranceDetails.map((d) => (
                    <div key={d.label} className="contents">
                      <dt className="text-ink">{d.label}</dt>
                      <dd>{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </Accordion>
            )}
            {productInfoSections(product, freeFrom).map((section) => (
              <Accordion key={section.heading} title={section.heading} subtitle={SECTION_SUBTITLES[section.heading]}>
                <p className="whitespace-pre-line">{section.content}</p>
              </Accordion>
            ))}
          </div>

          {/* Phones: chat with the team */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex items-center justify-between gap-4 rounded-lg border border-border bg-white px-5 py-4 lg:hidden"
          >
            <span>
              <span className="block font-serif text-lg tracking-normal! text-ink">Amoria Fragrance Concierge</span>
              <span className="mt-0.5 block text-[13px] text-ink-soft">Chat with us to find your signature scent</span>
            </span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
              <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C4 14.9 3.6 13.5 3.6 12c0-4.6 3.8-8.4 8.4-8.4s8.4 3.8 8.4 8.4-3.8 8.2-8.4 8.2Z" />
              </svg>
            </span>
          </a>

          {/* Phones: rating summary, with a way to leave one */}
          {product.reviewCount > 0 && (
            <div className="mt-9 lg:hidden">
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-2xl tracking-normal! text-ink">Ratings &amp; reviews</h2>
                <a href="#write-review" className="text-sm font-medium text-[#8a6a3a] underline underline-offset-4">
                  Write a review
                </a>
              </div>
              <div className="mt-4 grid grid-cols-[1.3fr_1fr] divide-x divide-border rounded-lg border border-border bg-white py-5">
                <div className="flex items-center justify-center gap-2 text-[34px] font-medium leading-none text-ink">
                  {product.avgRating.toFixed(1)} <span className="text-2xl">★</span>
                </div>
                <div className="text-center">
                  <p className="text-xl font-medium text-ink">{product.reviewCount}</p>
                  <p className="text-xs text-ink-soft">{product.reviewCount === 1 ? "Review" : "Reviews"}</p>
                </div>
              </div>
            </div>
          )}

          <p className="mt-6 hidden items-center gap-2 text-sm text-royal lg:flex">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="9" /></svg>
            Order today, you&apos;ll receive your package between <strong>{deliveryEstimate()}</strong>
          </p>
        </div>
      </div>

      {/* Phones: sticky price + Buy now / Add to cart */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-border bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(28,26,22,0.06)] lg:hidden">
        <div className="shrink-0">
          <p className="text-xl font-medium leading-tight text-ink">{formatAed(price * quantity)}</p>
          {compare && off && (
            <p className="text-[11px] leading-tight">
              <span className="text-ink-soft line-through">{formatAed(compare * quantity)}</span>{" "}
              <span className="font-medium text-[#2f7d4f]">{off}% Off</span>
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={unavailable || adding}
          className="flex-1 whitespace-nowrap border border-ink bg-white px-1 py-3 text-[11px] font-medium uppercase tracking-[1.5px] text-ink transition-opacity disabled:opacity-50"
        >
          Buy now
        </button>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={unavailable || adding}
          className="flex-1 whitespace-nowrap bg-crimson px-1 py-3 text-[11px] font-medium uppercase tracking-[1.5px] text-cream transition-opacity disabled:opacity-50"
        >
          {variant?.stock === 0 ? "Sold out" : adding ? "Adding…" : "Add to cart"}
        </button>
      </div>
    </>
  );
}
