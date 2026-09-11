import Link from "next/link";
import Image from "next/image";

// A single full-width promo banner between the featured products and the
// stores section — currently just links through to the shop; swap the
// href once a real "match me a scent" quiz flow exists.
export function FindYourScentBanner() {
  return (
    <section className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
      <Image
        src="/banners/find-your-scent.png"
        alt="Amoria Mystique, Nocturne, Aurora, Velaris and Solstice"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-start px-6 pt-10 sm:px-12 sm:pt-16">
        <div className="max-w-md">
          <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">Find Your Perfect Scent</h2>
          <p className="mt-3 text-sm text-ink-soft">
            Answer a few questions and we&apos;ll match you with fragrances made for exactly who you are.
          </p>
          <Link href="/shop" className="mt-6 inline-block bg-ink px-8 py-3 label-caps text-cream hover:opacity-90">
            Begin the Experience
          </Link>
        </div>
      </div>
    </section>
  );
}
