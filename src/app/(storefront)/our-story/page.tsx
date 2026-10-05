import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ParallaxHero } from "@/components/ParallaxHero";
import { OurStores } from "@/components/OurStores";

// Real copy and photography from the company's own 2026 profile document
// (Vision & Mission, Overview, Core Values, and the founder bio/portrait) —
// replaces the earlier placeholder narrative with the brand's actual words.
const MISSION_POINTS = [
  "Elevate the human spirit through the refined artistry of fine perfumery.",
  "Craft exceptional UAE-made fragrances defined by purity, elegance, and authenticity.",
  "Deliver meaningful sensory experiences with uncompromising quality and craftsmanship.",
  "Inspire confidence, distinction, and timeless emotional connection — one person, one bottle, one experience.",
];

const CORE_VALUES = [
  {
    name: "Excellence",
    description:
      "We deliver exceptional quality through premium sourcing, meticulous craftsmanship, and superior service, consistently surpassing industry standards.",
  },
  {
    name: "Innovation",
    description:
      "We embrace creativity and forward-thinking by exploring new ideas, advanced techniques, and modern fragrance concepts to deliver unique and distinctive experiences.",
  },
  {
    name: "Client Success",
    description:
      "We place our clients at the center of everything we do, delivering tailored solutions, exceeding expectations, and supporting their long-term satisfaction and success.",
  },
  {
    name: "Integrity",
    description:
      "We uphold honesty, transparency, and accountability, honoring our commitments and building ethical, trust-driven relationships.",
  },
];

// "Our Services" from the same company profile.
const SERVICES = [
  {
    name: "UAE-made perfume oils",
    description:
      "Premium UAE-made perfume oils and luxury fragrances, known for their purity and longevity.",
    href: "/shop?category=perfume-oils",
    cta: "Shop Perfume Oils",
  },
  {
    name: "Bespoke custom fragrance",
    description:
      "Bespoke custom-fragrance creation — your own blend, composed to your taste in our Ajman boutique.",
    href: "/custom-perfume",
    cta: "Create Yours",
  },
  {
    name: "Authentic luxury perfumes",
    description:
      "Curated retail of authentic luxury perfumes, inspired fragrances, bukhoor and gift sets for personal use and premium gifting.",
    href: "/shop",
    cta: "Shop All",
  },
  {
    name: "Wholesale & bulk supply",
    description:
      "Wholesale and bulk supply solutions across the GCC, with the same consistent quality and reliable availability.",
    href: "/contact",
    cta: "Get In Touch",
  },
];

// Photography from the Ajman boutique (supplied by the brand).
const INSIDE_THE_HOUSE = [
  {
    image: "/about/inspired-bar.jpg",
    alt: "Rows of Amoria inspired-perfume testers on the white counter",
    title: "The Inspired Perfumes bar",
    text: "Every inspired fragrance is on the counter to try before you choose.",
  },
  {
    image: "/about/blending-station.jpg",
    alt: "The Amoria blending station with dropper bottles, beakers and a bottle press",
    title: "Where custom blends are made",
    text: "Our blending station — droppers, beakers and a bottle press — is where bespoke fragrances come together.",
  },
  {
    image: "/about/oil-shelves.jpg",
    alt: "Shelves of Amoria perfume oils in glass bottles and aluminium drums",
    title: "Perfume oils, by the gram and the kilo",
    text: "From small glass bottles to full 1KG drums, our oils are poured and packed in-house.",
  },
];

export default function OurStoryPage() {
  return (
    <div>
      {/* Hero — full-bleed, oversized serif headline pinned to the bottom,
          the same parallax device Hero.tsx uses on the homepage, plus the
          same transparent-over-hero header treatment (see Header.tsx's
          hasFullBleedHero check) since the header sits fixed on top of it. */}
      <ParallaxHero
        image="/about/boutique-counter.jpg"
        heightClassName="h-[70vh] min-h-[480px]"
        // The boutique photo is bright and warm at the top — with the
        // transparent header sitting over this hero, the top needs its own
        // darkening (not just the bottom, for the headline) or the cream nav
        // text has almost no contrast to read against.
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

      {/* Overview */}
      <section className="px-6 py-20 sm:px-12 lg:py-28">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[200px_1fr] lg:gap-12">
          <p className="label-caps text-gold">Overview</p>
          <p className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
            Amoria Perfume is a rising <em className="italic text-royal">luxury fragrance house</em> in Ajman, UAE,
            known for premium blending, refined craftsmanship, and exceptional retail experiences. Rooted in the
            UAE&apos;s spirit of excellence, our long-lasting, meticulously crafted oils serve{" "}
            <em className="italic text-royal">discerning customers worldwide</em>.
          </p>
        </div>
      </section>

      {/* Our Boutique */}
      <section className="grid gap-10 px-6 pb-16 sm:px-12 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pb-24">
        <Reveal className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
          <Image
            src="/about/boutique-arches.jpg"
            alt="The arched glass shelving of the Amoria boutique in Ajman"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
        <Reveal delayMs={100}>
          <p className="label-caps text-gold">Our Boutique</p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">A fragrance house you can walk into.</h2>
          <p className="mt-5 max-w-md text-ink-soft">
            Our boutique in Ajman is where Amoria comes to life — arched, softly lit shelves of our own signature
            extraits beside international favourites, inspired fragrances, bakhoor and perfume oils, all in one place.
          </p>
          <Link
            href="/stores"
            className="mt-6 inline-block border border-ink px-6 py-3 label-caps text-ink hover:bg-ink hover:text-cream"
          >
            Visit The Boutique
          </Link>
        </Reveal>
      </section>

      {/* Vision & Mission */}
      <section className="grid gap-10 bg-cream-dark px-6 py-16 sm:px-12 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <Reveal>
          <p className="label-caps text-gold">Our Vision</p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Serenity, beauty, lasting impact.</h2>
          <p className="mt-5 max-w-md text-ink-soft">
            We set new standards in luxury perfumery through elegance, authenticity, and exceptional craftsmanship.
            With a forward-looking approach, we anticipate trends and consistently exceed expectations, delivering
            distinguished scent experiences with serenity, beauty, and lasting impact.
          </p>
        </Reveal>
        <Reveal delayMs={100}>
          <p className="label-caps text-gold">Our Mission</p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">One person, one bottle, one experience.</h2>
          <ul className="mt-5 max-w-md space-y-3 text-ink-soft">
            {MISSION_POINTS.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-royal" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Premium Collection — the four signature bottles, photographed in
          the boutique. */}
      <section className="grid gap-10 px-6 py-16 sm:px-12 lg:grid-cols-2 lg:items-start lg:gap-16 lg:py-24">
        <Reveal className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
          <Image
            src="/about/signature-bottles.jpg"
            alt="Amoria Nocturne, Mystique, Aurora and Velaris — the four signature creations"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-bottom"
          />
        </Reveal>
        <Reveal delayMs={100} className="lg:sticky lg:top-28 lg:self-start">
          <p className="label-caps text-gold">Premium Collection</p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Four signature creations.</h2>
          <p className="mt-5 max-w-md text-ink-soft">
            Amoria&apos;s premium line features four signature creations, each crafted with refined French-inspired
            compositions and a luxury scent identity — Velaris, Aurora, Mystique, and Nocturne. Every bottle is
            composed as an Extrait de Parfum, the most concentrated and longest-lasting form a perfume can take.
          </p>
          <Link
            href="/shop?category=premium-collection"
            className="mt-6 inline-block border border-ink px-6 py-3 label-caps text-ink hover:bg-ink hover:text-cream"
          >
            Shop The Collection
          </Link>
        </Reveal>
      </section>

      {/* Inside the House — three scenes from the boutique */}
      <section className="px-6 py-16 sm:px-12 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="label-caps text-gold">Inside The House</p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Crafted and poured in Ajman.</h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-6xl gap-8 md:grid-cols-3">
          {INSIDE_THE_HOUSE.map((item, i) => (
            <Reveal key={item.image} delayMs={i * 80}>
              <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
                <Image src={item.image} alt={item.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <h3 className="mt-4 font-serif text-xl text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What We Offer */}
      <section className="bg-cream-dark px-6 py-16 sm:px-12 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="label-caps text-gold">What We Offer</p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">From a single bottle to the whole GCC.</h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-6xl gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <Reveal key={service.name} delayMs={i * 80} className="flex flex-col bg-cream p-8">
              <h3 className="font-serif text-xl text-ink">{service.name}</h3>
              <p className="mt-3 flex-1 text-sm text-ink-soft">{service.description}</p>
              <Link href={service.href} className="mt-6 label-caps text-royal hover:text-ink">
                {service.cta} →
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The signature wall */}
      <section className="grid gap-4 px-6 py-16 sm:px-12 md:grid-cols-2 lg:py-24">
        <Reveal className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
          <Image
            src="/about/premium-shelves.jpg"
            alt="The Velaris, Aurora and Mystique bottles on the Amoria signature shelves"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
        <Reveal delayMs={100} className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
          <Image
            src="/about/premium-wall.jpg"
            alt="The full wall of Amoria signature extraits above the inspired and international ranges"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
      </section>

      {/* Core Values */}
      <section className="bg-cream-dark px-6 py-20 sm:px-12 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="label-caps text-gold">Core Values</p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">What guides every bottle.</h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2">
          {CORE_VALUES.map((value, i) => (
            <Reveal key={value.name} delayMs={i * 80} className="border border-border bg-cream p-8">
              <h3 className="font-serif text-xl text-ink">{value.name}</h3>
              <p className="mt-3 text-sm text-ink-soft">{value.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Founder — same two-column pattern as Premium Collection above,
          mirrored (text left, image right). */}
      <section className="grid gap-10 px-6 py-16 sm:px-12 lg:grid-cols-2 lg:items-start lg:gap-16 lg:py-24">
        <Reveal className="order-2 lg:sticky lg:top-28 lg:order-1 lg:self-start">
          <p className="label-caps text-gold">Founder & CEO</p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">Almuamina Salahudeen</h2>
          <p className="mt-5 max-w-md text-ink-soft">
            Almuamina Salahudeen, Founder and CEO of Amoria Perfume, leads the brand with strategic clarity, refined
            professionalism, and a deep passion for fragrance. Her commitment to authenticity, quality, and
            innovation has shaped Amoria into a rising luxury perfume house in Ajman, UAE, expanding across the UAE,
            GCC, and MENA through distinguished craftsmanship and modern excellence.
          </p>
          <p className="mt-4 max-w-md text-ink-soft">
            Outside her leadership role, she enjoys traveling, reading, watching documentaries, and spending time
            with her family. Her disciplined mindset and dedication to continuous learning strengthen Amoria&apos;s
            growth, ensuring every creation reflects elegance, confidence, and lasting emotional connection.
          </p>
        </Reveal>
        <Reveal delayMs={100} className="relative order-1 aspect-[4/5] overflow-hidden bg-cream-dark lg:order-2">
          <Image
            src="/team/founder.png"
            alt="Almuamina Salahudeen, Founder and CEO of Amoria Perfume"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-top"
          />
        </Reveal>
      </section>

      {/* Visit Us — the same section used at the bottom of the homepage,
          rather than a one-off panel duplicating what it already says. */}
      <OurStores />
    </div>
  );
}
