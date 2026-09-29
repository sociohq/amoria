import Link from "next/link";
import { BRANDS } from "@/lib/brands";
import { BrandTile } from "./BrandTile";

// A teaser for the full /brands directory — 21 logos in a clean static
// 7-column grid (brands with real matching products first, so the
// homepage sample isn't mostly dead links) rather than showing all ~90
// here, which either ran the section several screens tall as a wrapping
// grid or needed a scrolling marquee. "Explore More Brands" is where the
// rest of the roster actually lives.
const COLUMNS = 7;
const ROWS = 3;
const PREVIEW_COUNT = COLUMNS * ROWS;

export function BrandLogoGrid() {
  const preview = [...BRANDS].sort((a, b) => Number(!a.designHouse) - Number(!b.designHouse)).slice(0, PREVIEW_COUNT);

  return (
    <section className="px-6 py-16 sm:px-12">
      <div className="text-center">
        <p className="label-caps text-gold">The Houses We Draw From</p>
        <h2 className="mt-1 font-serif text-3xl text-ink">Shop By Brand</h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-7 gap-px border border-border bg-border">
        {preview.map((brand) => (
          <BrandTile key={brand.slug} brand={brand} padding="p-7 sm:p-9" />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/brands"
          className="inline-block border border-ink px-8 py-3 label-caps text-ink transition-colors hover:bg-ink hover:text-cream"
        >
          Explore More Brands
        </Link>
      </div>
    </section>
  );
}
