import Link from "next/link";
import { ParallaxHero } from "./ParallaxHero";

export function Hero() {
  return (
    <ParallaxHero
      image="/hero-banner.jpg"
      heightClassName="h-screen"
      overlayClassName="bg-gradient-to-r from-black/45 via-black/15 to-transparent"
      contentClassName="flex h-full items-end px-6 pb-20"
    >
      <div className="max-w-md">
        <h1 className="font-serif text-4xl leading-tight text-cream sm:text-5xl">
          Scent, the way Arabia remembers it.
        </h1>
        <p className="mt-5 text-cream/85">Ouds, attars and signature perfumes crafted for the Gulf, delivered across the UAE.</p>
        <Link
          href="/shop"
          className="group relative mt-8 inline-block overflow-hidden bg-ink px-8 py-3 label-caps text-cream transition-all duration-500 ease-out hover:scale-[1.03] hover:bg-royal hover:shadow-lg hover:shadow-royal/30"
        >
          <span className="relative z-10">Shop Amoria Signature</span>
          {/* A thin gold sheen that sweeps across on hover — the "luxury
              touch" rather than a plain opacity fade. */}
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-light/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          />
        </Link>
      </div>
    </ParallaxHero>
  );
}
