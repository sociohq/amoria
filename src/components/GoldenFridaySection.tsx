import Link from "next/link";
import { GoldenFridayOffer, offerCondition, offerHeadline } from "@/lib/goldenFriday";
import { CopyCodeButton } from "./CopyCodeButton";
import { Reveal } from "./Reveal";

// The homepage Golden Friday banner, shown while the GOLDEN25 coupon is live (see lib/goldenFriday.ts).
export function GoldenFridaySection({ offer }: { offer: GoldenFridayOffer | null }) {
  if (!offer) return null;

  return (
    <section id="golden-friday" className="bg-ink py-14 text-center text-cream sm:py-16">
      <Reveal>
        <div className="mx-auto max-w-xl px-6">
          <p className="label-caps text-gold-light">Limited-time offer</p>
          <h2 className="mt-2 font-serif text-5xl text-cream sm:text-6xl">Golden Friday</h2>
          <p className="mt-4 font-serif text-3xl text-gold-light sm:text-4xl">{offerHeadline(offer)}</p>
          <p className="mt-1 text-sm text-cream/80">{offerCondition(offer)}</p>

          <div className="mx-auto mt-7 max-w-xs">
            <p className="label-caps mb-2 text-cream/60">Use code at checkout</p>
            <CopyCodeButton code={offer.code} />
          </div>

          <Link
            href="/shop"
            className="mt-7 inline-block border border-gold px-10 py-3 label-caps text-gold-light transition-colors hover:bg-gold hover:text-ink"
          >
            Shop now
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
