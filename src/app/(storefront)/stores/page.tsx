import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export const metadata = {
  title: "Our Boutique | Amoria",
  description: "Visit the Amoria Perfume boutique in Muwaihat, Ajman.",
};

// Address, phone and email are taken from the company profile. The directions
// link opens that address in Google Maps rather than pinning exact map
// coordinates the brand hasn't confirmed.
const ADDRESS_LINES = ["Amoria Perfume (S.P.S - LLC)", "Icon Residency 2, Shop 7", "Muwaihat 3, Ajman, UAE"];
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Amoria Perfume, Icon Residency 2, Muwaihat 3, Ajman, UAE"
)}`;

export default function StoresPage() {
  return (
    <div>
      <section className="px-6 pb-8 pt-16 text-center sm:px-12 lg:pt-24">
        <p className="label-caps text-gold">Find A Store</p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">Visit The Amoria Boutique</h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          Smell the range, try our inspired fragrances at the counter and have a custom blend made — in person, in
          Ajman.
        </p>
      </section>

      <section className="grid gap-10 px-6 pb-20 sm:px-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
        <Reveal className="relative aspect-[4/3] overflow-hidden bg-cream-dark lg:aspect-auto lg:min-h-[420px]">
          <Image
            src="/about/boutique-counter.jpg"
            alt="The Amoria Perfume counter and logo wall in the Ajman boutique"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </Reveal>

        <Reveal delayMs={100} className="flex flex-col justify-center">
          <p className="label-caps text-gold">Amoria Perfume · Ajman</p>
          <address className="mt-4 font-serif text-2xl not-italic leading-snug text-ink sm:text-3xl">
            {ADDRESS_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="label-caps text-ink-soft">Call</dt>
              <dd className="mt-1 text-ink">
                <a href="tel:+971507550447" className="whitespace-nowrap hover:text-royal" aria-label="Call +971 50 755 0447">
                  +971 50 755 0447
                </a>
                <span className="text-ink-soft"> · </span>
                <a href="tel:+971568252478" className="whitespace-nowrap hover:text-royal">
                  +971 56 825 2478
                </a>
                <span className="text-ink-soft"> · </span>
                <a href="tel:+97168836971" className="whitespace-nowrap hover:text-royal">
                  06 883 6971
                </a>
              </dd>
            </div>
            <div>
              <dt className="label-caps text-ink-soft">Email</dt>
              <dd className="mt-1">
                <a href="mailto:info@amoriaperfume.ae" className="text-ink hover:text-royal">
                  info@amoriaperfume.ae
                </a>
              </dd>
            </div>
            <div>
              <dt className="label-caps text-ink-soft">Write to us</dt>
              <dd className="mt-1 text-ink">PB No: 3655, Ajman, UAE</dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink px-8 py-3 label-caps text-cream transition-opacity hover:opacity-90"
            >
              Get Directions
            </a>
            <a
              href="https://wa.me/971507550447"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-ink px-8 py-3 label-caps text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              WhatsApp Us
            </a>
            <Link
              href="/contact"
              className="border border-border px-8 py-3 label-caps text-ink-soft transition-colors hover:text-ink"
            >
              Contact Page
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
