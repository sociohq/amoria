import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";

// Only categories an admin has set an image on appear here — that's the
// curation mechanism (no separate "featured" flag needed). Renders nothing
// if none are set yet.
export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const featured = categories.filter((c) => c.image);
  if (featured.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mb-8 flex items-end justify-between px-6">
        <div>
          <p className="label-caps text-gold">Extrait De Parfum</p>
          <h2 className="mt-1 font-serif text-3xl text-ink">Browse Our Category</h2>
        </div>
        <Link href="/shop" className="text-sm text-ink underline underline-offset-4 hover:text-emerald">
          View all
        </Link>
      </div>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2">
        {featured.map((c) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className="group relative h-[420px] w-[280px] shrink-0 snap-start overflow-hidden"
          >
            <Image
              src={c.image as string}
              alt={c.name}
              fill
              sizes="280px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-serif text-xl italic text-cream">{c.name}</p>
              <span className="mt-1 inline-block text-sm text-cream underline underline-offset-4">Discover</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
