import { Product, ProductImage } from "./types";

// A photo can belong to one size of a product (variantSize), so picking 100ml
// shows the 100ml bottle. A size with no photos of its own falls back to the
// product's shared photos (and its thumbnail), and as a last resort to
// everything — a product never ends up with an empty gallery. A size marked
// "own photos only" in the admin skips that borrowing: with no photo of its own
// (and none shared) it shows the AMORIA placeholder rather than another size's bottle.
export function galleryFor(product: Product, size: string | undefined): ProductImage[] {
  const own = size ? product.images.filter((i) => i.variantSize === size) : [];
  if (own.length > 0) return own;

  const ownOnly = size ? product.variants.find((v) => v.size === size)?.ownPhotosOnly : false;
  if (ownOnly) return product.images.filter((i) => !i.variantSize);

  const shared = product.images.filter((i) => !i.variantSize);
  const thumb: ProductImage[] =
    product.thumbnailImage && !shared.some((i) => i.url === product.thumbnailImage)
      ? [{ id: "thumbnail", url: product.thumbnailImage, altText: product.name, position: -1, variantSize: null }]
      : [];
  const base = [...thumb, ...shared];
  return base.length > 0 ? base : product.images;
}

// The single photo shown for a size in the cart.
export function imageForSize(product: Product, size: string | undefined): string | null {
  return galleryFor(product, size)[0]?.url ?? null;
}
