import Link from "next/link";
import { BRANDS, Brand } from "@/lib/brands";
import { BrandTile } from "./BrandTile";

// Seconds each logo takes to drift past — keeps the speed the same however
// many brands a row holds (a longer row just gets a proportionally longer
// loop), rather than a fixed duration that would crawl or race.
const SECONDS_PER_LOGO = 3.5;

function MarqueeRow({ brands, reverse = false }: { brands: Brand[]; reverse?: boolean }) {
  return (
    <div className="overflow-hidden border-y border-border">
      <div
        className={`brands-marquee flex w-max ${reverse ? "brands-marquee-reverse" : ""}`}
        style={{ ["--brands-duration" as string]: `${brands.length * SECONDS_PER_LOGO}s` }}
      >
        {/* Two identical halves — the animation slides by exactly one half,
            so the second picks up where the first leaves off. The copy is
            hidden from assistive tech so each logo is announced once. */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {brands.map((brand) => (
              <div key={brand.slug} className="w-28 shrink-0 border-r border-border sm:w-36">
                <BrandTile brand={brand} padding="p-5 sm:p-7" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// A teaser for the full /brands directory — the whole roster drifting past
// in two rows moving in opposite directions (brands with real matching
// products first, so the first logos seen aren't dead links). Hovering a
// row pauses it so a logo can be clicked. "Explore More Brands" opens the
// full directory.
export function BrandLogoGrid() {
  const sorted = [...BRANDS].sort((a, b) => Number(!a.designHouse) - Number(!b.designHouse));
  const rowA = sorted.filter((_, i) => i % 2 === 0);
  const rowB = sorted.filter((_, i) => i % 2 === 1);

  return (
    <section className="py-16">
      <div className="px-6 text-center sm:px-12">
        <p className="label-caps text-gold">The Houses We Draw From</p>
        <h2 className="mt-1 font-serif text-3xl text-ink">Shop By Brand</h2>
      </div>

      <div className="mt-10 space-y-px">
        <MarqueeRow brands={rowA} />
        <MarqueeRow brands={rowB} reverse />
      </div>

      <div className="mt-10 px-6 text-center sm:px-12">
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
