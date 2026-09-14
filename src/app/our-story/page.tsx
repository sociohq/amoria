import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

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
          the same device the rest of the site uses for section heroes
          (see Hero.tsx, blog/[slug]) but sized up for an editorial feel. */}
      <section className="relative flex h-[70vh] min-h-[480px] items-end overflow-hidden bg-ink">
        <Image src="/banners/find-your-scent.png" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <div className="relative z-10 px-6 pb-14 sm:px-12">
          <p className="label-caps text-gold-light">Our Story</p>
          <h1 className="mt-3 font-serif text-6xl leading-[0.95] text-cream sm:text-7xl lg:text-8xl">
            The House of
            <br />
            <em className="italic text-gold-light">Amoria</em>
          </h1>
        </div>
      </section>

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

      {/* Our Roots */}
      <section className="grid gap-10 px-6 py-16 sm:px-12 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
        <Reveal className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
          <Image
            src="/categories/amoria-signature.png"
            alt="An Amoria bottle set among sun-bleached driftwood"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
        <Reveal delayMs={100}>
          <p className="label-caps text-gold">Our Roots</p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Born from oud and attar.</h2>
          <p className="mt-5 max-w-md text-ink-soft">
            Long before Amoria was a bottle on a shelf, it was ouds and attars passed between generations across
            the region. We carry that inheritance forward, pairing it with classic French perfumery technique so
            each fragrance reads as familiar and entirely new at once.
          </p>
        </Reveal>
      </section>

      {/* The Craft */}
      <section className="grid gap-10 bg-cream-dark px-6 py-16 sm:px-12 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
        <Reveal className="order-2 lg:order-1">
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

      {/* Visit the boutique */}
      <section className="relative flex min-h-[420px] items-center overflow-hidden">
        <Image
          src="/categories/womens-perfume.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto max-w-lg px-6 text-center text-cream sm:px-12">
          <p className="label-caps text-gold-light">Visit Us</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Visit The Boutique</h2>
          <p className="mt-4 text-cream/85">
            You&apos;ll find Amoria at Icon Residency 2, Shop 7, opposite the ADNOC service station on Al Muwaihat
            3, Ajman.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block border border-cream px-8 py-3 label-caps text-cream hover:bg-cream hover:text-ink"
          >
            Get In Touch
          </Link>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-ink px-6 py-20 text-center sm:px-12">
        <p className="font-serif text-3xl text-cream sm:text-4xl">Find your signature scent.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block bg-cream px-10 py-4 label-caps text-ink hover:opacity-90"
        >
          Shop The Collection
        </Link>
      </section>
    </div>
  );
}
