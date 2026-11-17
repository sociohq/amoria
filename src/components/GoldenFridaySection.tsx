import Link from "next/link";
import { GoldenFridayOffer, offerEnds } from "@/lib/goldenFriday";
import { CopyCodeButton } from "./CopyCodeButton";
import { Reveal } from "./Reveal";

const SHOP_LINKS = [
  { label: "Shop Inspired Perfumes", href: "/shop?category=inspired-fragrance" },
  { label: "Shop Premium Fragrance", href: "/shop?category=premium-collection" },
  { label: "Shop Gift Sets", href: "/shop?category=gift-sets" },
];

// The homepage Golden Friday section, shown while the GOLDEN25 coupon is live (see lib/goldenFriday.ts). The
// amounts and the end date come from the coupon itself, so editing it in the admin updates this text.
export function GoldenFridaySection({ offer }: { offer: GoldenFridayOffer | null }) {
  if (!offer) return null;
  const off = offer.type === "PERCENTAGE" ? `${offer.value}%` : `AED ${offer.value}`;
  const min = offer.minOrderValue ? `AED ${offer.minOrderValue}` : null;
  const ends = offerEnds(offer);

  return (
    <section id="golden-friday" className="bg-ink px-6 py-14 text-center text-cream sm:py-16">
      <Reveal>
        <div className="mx-auto max-w-2xl">
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

          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {SHOP_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="border border-gold px-6 py-3 label-caps text-gold-light transition-colors hover:bg-gold hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
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
