import { Product, ProductImage } from "./types";

// A photo can belong to one size of a product (variantSize), so picking 100ml
// shows the 100ml bottle. A size with no photos of its own falls back to the
// product's shared photos (and its thumbnail), and as a last resort to
// everything — a product never ends up with an empty gallery.
export function galleryFor(product: Product, size: string | undefined): ProductImage[] {
  const own = size ? product.images.filter((i) => i.variantSize === size) : [];
  if (own.length > 0) return own;

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
