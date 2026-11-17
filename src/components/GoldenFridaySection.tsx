import Link from "next/link";
import Image from "next/image";
import { GoldenFridayOffer, offerEnds } from "@/lib/goldenFriday";
import { CopyCodeButton } from "./CopyCodeButton";
import { Reveal } from "./Reveal";

// The homepage Golden Friday section, shown while the GOLDEN25 coupon is live (see lib/goldenFriday.ts). The
// amounts and the end date come from the coupon itself, so editing it in the admin updates this text.
export function GoldenFridaySection({ offer }: { offer: GoldenFridayOffer | null }) {
  if (!offer) return null;
  const off = offer.type === "PERCENTAGE" ? `${offer.value}%` : `AED ${offer.value}`;
  const min = offer.minOrderValue ? `AED ${offer.minOrderValue}` : null;
  const ends = offerEnds(offer);

  return (
    <section id="golden-friday" className="relative overflow-hidden bg-ink px-6 py-14 text-center text-cream sm:py-16">
      {/* Two ribbons of gold, tilted: one runs in from the left edge and leaves through the top, the other in from the right edge and out through the bottom, so each reaches the frame and carries on past it. Decorative only,
          sitting behind the text (the content below is lifted above them) and never in the way of clicks. */}
      <Image
        src="/offers/gold-ribbon.webp"
        alt=""
        aria-hidden
        width={1400}
        height={467}
        sizes="(min-width: 1024px) 780px, (min-width: 640px) 544px, 288px"
        className="pointer-events-none absolute -left-28 -top-10 w-[18rem] max-w-none rotate-[12deg] select-none opacity-90 sm:-left-44 sm:-top-14 sm:w-[34rem] lg:-left-[3vw] lg:-top-[1vw] lg:w-[36vw] lg:max-w-[780px] lg:-rotate-[8deg]"
      />
      <Image
        src="/offers/gold-ribbon.webp"
        alt=""
        aria-hidden
        width={1400}
        height={467}
        sizes="(min-width: 1024px) 780px, (min-width: 640px) 544px, 288px"
        className="pointer-events-none absolute -bottom-10 -right-28 w-[18rem] max-w-none rotate-[192deg] select-none opacity-90 sm:-bottom-14 sm:-right-44 sm:w-[34rem] lg:-bottom-[1vw] lg:-right-[3vw] lg:w-[36vw] lg:max-w-[780px] lg:rotate-[172deg]"
      />
      <Reveal>
        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="label-caps text-gold-light">Limited-time sale</p>
          <h2 className="mt-2 font-serif text-5xl text-cream sm:text-6xl">Golden Friday</h2>
          <p className="mt-4 font-serif text-2xl text-gold-light sm:text-3xl">
            {off} off orders of {min ?? "any size"}
            {min ? " or more" : ""}
          </p>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-cream/80">
            Your signature scent, now in gold. Get {off} off when you spend {min ?? "any amount"}
            {min ? " or more" : ""}.
          </p>

          <div className="mx-auto mt-7 max-w-sm">
            <p className="label-caps mb-2 text-cream/60">
              Use code <span className="text-gold-light">{offer.code}</span> at checkout
            </p>
            <CopyCodeButton code={offer.code} label="Copy code" />
          </div>

          <div className="mt-7">
            <Link
              href="/shop"
              className="inline-block border border-gold px-10 py-3 label-caps text-gold-light transition-colors hover:bg-gold hover:text-ink"
            >
              Shop now
            </Link>
          </div>

          <p className="mx-auto mt-7 max-w-md text-xs leading-relaxed text-cream/50">
            Valid on orders of {min ?? "any size"}
            {min ? " and above" : ""}. Cannot be combined with other offers.{ends ? ` ${ends}.` : ""}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
