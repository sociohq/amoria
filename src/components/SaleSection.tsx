import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";
import { Reveal } from "./Reveal";

// The homepage sale section ("11.11 Offer"): one big picture per category on sale, each linking to that category's
// page, where every product already shows its sale price. Fully driven by the admin (Categories): a category appears
// here while it has a Sale picture and a Discount % above 0, so ending the sale (Discount % back to 0, or removing
// the picture) takes it off the page; with none left the whole section disappears.
export function SaleSection({ categories }: { categories: Category[] }) {
  const onSale = categories.filter((c) => c.saleImage && (c.discountPercent ?? 0) > 0);
  if (onSale.length === 0) return null;
  const top = Math.max(...onSale.map((c) => c.discountPercent ?? 0));

  return (
    <section className="bg-cream-dark py-14 sm:py-16">
      <div className="mb-8 px-6 text-center sm:mb-10">
        <p className="label-caps text-crimson">Limited-time sale</p>
        <h2 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">11.11 Offer</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
          {onSale.length > 1 ? `Up to ${top}% off` : `${top}% off`} {onSale.map((c) => c.name).join(", ").replace(/, ([^,]*)$/, " and $1")}. Pick a
          bag and shop the sale.
        </p>
      </div>

      <Reveal>
        {/* Phones: a swipe row of big bags (the text on each bag needs the room). Wider screens: all in one row. */}
        <ul className="no-scrollbar mx-auto flex max-w-5xl snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0">
          {onSale.map((c) => (
            <li key={c.id} className="w-[68vw] shrink-0 snap-center sm:w-auto sm:shrink">
              <Link
                href={`/shop?category=${c.slug}`}
                aria-label={`${c.name}: ${c.discountPercent}% off`}
                className="group flex flex-col items-center"
              >
                <span className="relative block aspect-square w-full">
                  <Image
                    src={c.saleImage as string}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 30vw, 68vw"
                    className="object-contain drop-shadow-[0_18px_22px_rgba(120,20,20,0.22)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="mt-2 inline-block border-b border-ink pb-0.5 text-sm text-ink transition-colors group-hover:border-royal group-hover:text-royal">
                  Shop {c.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
