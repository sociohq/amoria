import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ParallaxHero } from "@/components/ParallaxHero";
import { OurStores } from "@/components/OurStores";

const VALUES = [
  "Extrait De Parfum Only",
  "Small-Batch Bottling",
  "100% Authentic",
  "Free Shipping AED 99+",
  "Responsible Sourcing",
];

export default function OurStoryPage() {
  return (
    <div>
      {/* Hero — full-bleed, oversized serif headline pinned to the bottom,
          the same parallax device Hero.tsx uses on the homepage, plus the
          same transparent-over-hero header treatment (see Header.tsx's
          hasFullBleedHero check) since the header sits fixed on top of it. */}
      <ParallaxHero
        image="/banners/find-your-scent.png"
        heightClassName="h-[70vh] min-h-[480px]"
        // find-your-scent.png is bright sky at the top, unlike Hero.tsx's
        // naturally dark banner — with the transparent header now sitting
        // over this hero too, the top needs its own darkening (not just
        // the bottom, for the headline) or the cream nav text has almost
        // no contrast to read against.
        overlayClassName="bg-gradient-to-b from-black/55 via-black/10 to-black/75"
        contentClassName="flex h-full items-end px-6 pb-14 sm:px-12"
      >
        <div>
          <p className="label-caps text-gold-light">Our Story</p>
          <h1 className="mt-3 font-serif text-6xl leading-[0.95] text-cream sm:text-7xl lg:text-8xl">
            The House of
            <br />
            <em className="italic text-gold-light">Amoria</em>
          </h1>
        </div>
      </ParallaxHero>

      {/* Manifesto */}
      <section className="px-6 py-20 sm:px-12 lg:py-28">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[200px_1fr] lg:gap-12">
          <p className="label-caps text-gold">Manifesto</p>
          <p className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
            Amoria is a <em className="italic text-royal">modern fragrance house</em>, rooted in the perfumery
            traditions of the Gulf and built for the way people actually wear scent. We compose every bottle as an
            Extrait de Parfum, the most concentrated form a perfume can take, and let{" "}
            <em className="italic text-royal">craft and patience</em> do the rest.
          </p>
        </div>
      </section>

      {/* Our Roots — text is top-aligned and sticky (lg:), so it holds its
          position as the taller image scrolls past beside it, then
          releases once the image runs out (see ProductDetail.tsx's
          gallery column for the same lg:sticky lg:top-28 lg:self-start
          pattern — its sticky containing block is the grid row itself,
          which stretches to the image's height). */}
      <section className="grid gap-10 px-6 py-16 sm:px-12 lg:grid-cols-2 lg:items-start lg:gap-16 lg:py-24">
        <Reveal className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
          <Image
            src="/categories/amoria-signature.png"
            alt="An Amoria bottle set among sun-bleached driftwood"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
        <Reveal delayMs={100} className="lg:sticky lg:top-28 lg:self-start">
          <p className="label-caps text-gold">Our Roots</p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Born from oud and attar.</h2>
          <p className="mt-5 max-w-md text-ink-soft">
            Long before Amoria was a bottle on a shelf, it was ouds and attars passed between generations across
            the region. We carry that inheritance forward, pairing it with classic French perfumery technique so
            each fragrance reads as familiar and entirely new at once.
          </p>
        </Reveal>
      </section>

      {/* The Craft — same sticky-text treatment, mirrored. */}
      <section className="grid gap-10 bg-cream-dark px-6 py-16 sm:px-12 lg:grid-cols-2 lg:items-start lg:gap-16 lg:py-24">
        <Reveal className="order-2 lg:sticky lg:top-28 lg:order-1 lg:self-start">
          <p className="label-caps text-gold">The Craft</p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Composed, not mass-produced.</h2>
          <p className="mt-5 max-w-md text-ink-soft">
            Every Amoria fragrance is bottled at Extrait de Parfum strength, the most concentrated and
            longest-lasting a perfume can be. Batches are kept small and composed with intent, so each bottle
            holds up through the heat of the day and lingers long after.
          </p>
        </Reveal>
        <Reveal delayMs={100} className="relative order-1 aspect-[4/5] overflow-hidden bg-cream lg:order-2">
          <Image
            src="/categories/inspired-fragrance.png"
            alt="Hands holding an Amoria bottle"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
      </section>

      {/* Values */}
      <section className="px-6 py-20 text-center sm:px-12">
        <Reveal>
          <p className="label-caps text-gold">What We Stand For</p>
          <h2 className="mx-auto mt-3 max-w-xl font-serif text-3xl text-ink sm:text-4xl">
            Considered from the first note to the last mile.
          </h2>
        </Reveal>
        <Reveal delayMs={100} className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
          {VALUES.map((v) => (
            <span key={v} className="label-caps border border-border px-5 py-2.5 text-ink-soft">
              {v}
            </span>
          ))}
        </Reveal>
      </section>

      {/* Visit Us — the same section used at the bottom of the homepage,
          rather than a one-off panel duplicating what it already says. */}
      <OurStores />
    </div>
  );
}
