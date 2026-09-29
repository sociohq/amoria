import Link from "next/link";
import Image from "next/image";
import { Brand } from "@/lib/brands";

// One bordered logo cell — shared by the homepage teaser grid and the
// full /brands directory so both read as the same grid, just different
// sizes. `padding` controls how much of the square cell the logo actually
// fills — more padding reads as smaller/more minimal without changing the
// cell (and therefore grid) size itself.
export function BrandTile({ brand, padding = "p-5 sm:p-6" }: { brand: Brand; padding?: string }) {
  return (
    <Link
      href={`/brand/${brand.slug}`}
      className={`group flex aspect-square items-center justify-center bg-cream transition-colors hover:bg-cream-dark ${padding}`}
    >
      <span className="relative h-full w-full">
        <Image
          src={brand.logo}
          alt={brand.name}
          fill
          sizes="140px"
          className="object-contain opacity-70 transition-opacity group-hover:opacity-100"
        />
      </span>
    </Link>
  );
}
