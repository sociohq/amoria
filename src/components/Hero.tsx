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
        <Link href="/shop" className="mt-8 inline-block bg-ink px-8 py-3 label-caps text-cream hover:opacity-90">
          Shop Amoria Signature
        </Link>
      </div>
    </ParallaxHero>
  );
}
