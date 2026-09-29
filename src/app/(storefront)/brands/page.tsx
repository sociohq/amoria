import { BRANDS } from "@/lib/brands";
import { BrandTile } from "@/components/BrandLogoGrid/BrandTile";

export const metadata = {
  title: "Shop By Brand | Amoria",
};

// The full roster the homepage's "Shop By Brand" teaser only samples 12
// of — same bordered-cell grid, just complete and denser (more columns)
// since this page's whole job is browsing the full list.
export default function BrandsPage() {
  return (
    <div className="px-6 py-16 sm:px-12">
      <div className="text-center">
        <p className="label-caps text-gold">The Houses We Draw From</p>
        <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">Shop By Brand</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          Every design house Amoria&apos;s Inspired Perfume line draws from — pick one to see its fragrances.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-3 gap-px border border-border bg-border sm:grid-cols-5 lg:grid-cols-7">
        {BRANDS.map((brand) => (
          <BrandTile key={brand.slug} brand={brand} />
        ))}
      </div>
    </div>
  );
}
