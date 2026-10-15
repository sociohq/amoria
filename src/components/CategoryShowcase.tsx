import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";
import { Reveal } from "./Reveal";

// How long each card takes to drift past — slow, so the motion stays subtle.
const SECONDS_PER_CARD = 7;

// Only categories an admin has set an image on appear here — that's the
// curation mechanism (no separate "featured" flag needed). Renders nothing
// if none are set yet.
export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const featured = categories.filter((c) => c.image);
  if (featured.length === 0) return null;
  // Cards per half-loop: enough that one half is wider than a big desktop screen.
  const repeats = Math.max(1, Math.ceil(8 / featured.length));

  return (
    <section className="py-16">
      <div className="mb-8 flex items-end justify-between px-6">
        <div>
          <p className="label-caps text-gold">Extrait De Parfum</p>
          <h2 className="mt-1 font-serif text-3xl text-ink">Browse Our Category</h2>
        </div>
        <Link href="/shop" className="text-sm text-ink underline underline-offset-4 hover:text-royal">
          View all
        </Link>
      </div>

      {/* A slow, endless drift: the set of categories is laid out twice and slid by exactly one
          half, so the loop is seamless. Each half repeats the set enough times to be wider than
          any screen. Pauses on hover; people who ask for reduced motion get a normal swipe row. */}
      <Reveal>
        <div className="category-marquee-wrap overflow-hidden">
          <div
            className="category-marquee flex w-max"
            style={{ ["--category-duration" as string]: `${featured.length * repeats * SECONDS_PER_CARD}s` }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="category-marquee-half flex shrink-0" aria-hidden={copy === 1}>
                {Array.from({ length: repeats }).flatMap((_, r) =>
                  featured.map((c) => (
                    <Link
                      key={`${r}-${c.id}`}
                      href={`/shop?category=${c.slug}`}
                      tabIndex={copy === 1 || r > 0 ? -1 : undefined}
                      className="group relative mr-4 block h-[320px] w-[calc(50vw-32px)] shrink-0 overflow-hidden sm:h-[420px] sm:w-[280px]"
                    >
                      <Image
                        src={c.image as string}
                        alt={copy === 0 && r === 0 ? c.name : ""}
                        fill
                        sizes="(min-width: 640px) 280px, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="font-serif text-xl italic text-cream">{c.name}</p>
                        <span className="mt-1 inline-block text-sm text-cream underline underline-offset-4">Discover</span>
                      </div>
                    </Link>
                  )),
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
