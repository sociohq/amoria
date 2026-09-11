import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";

// The "Shop" nav item's dropdown — categories are grouped into columns by
// their admin-set `menuGroup` (falling back to a single "More" column for
// anything ungrouped), plus a promo image tile for whichever category is
// flagged `featuredInMenu`. Rendered by Header.tsx inside a `group`
// wrapper, shown via group-hover.
export function MegaMenu({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  const groups: { name: string; items: Category[] }[] = [];
  const ungrouped: Category[] = [];
  for (const c of categories) {
    if (!c.menuGroup) {
      ungrouped.push(c);
      continue;
    }
    let group = groups.find((g) => g.name === c.menuGroup);
    if (!group) {
      group = { name: c.menuGroup, items: [] };
      groups.push(group);
    }
    group.items.push(c);
  }
  if (ungrouped.length > 0) groups.push({ name: "More", items: ungrouped });

  const featured = categories.find((c) => c.featuredInMenu && c.image);

  return (
    <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
      <div className="flex w-max max-w-[calc(100vw-3rem)] gap-16 border border-border bg-white px-10 py-8 shadow-sm">
        <div className="flex flex-1 gap-16">
          {groups.map((g) => (
            <div key={g.name}>
              <p className="label-caps mb-4 text-ink-soft">{g.name}</p>
              <ul className="space-y-2.5">
                {g.items.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/shop?category=${c.slug}`}
                      className="whitespace-nowrap text-sm text-ink transition-colors hover:text-emerald"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {featured && (
          <Link
            href={`/shop?category=${featured.slug}`}
            className="group/promo relative block w-64 shrink-0 self-start overflow-hidden"
          >
            <div className="relative aspect-[4/5] bg-cream-dark">
              <Image
                src={featured.image!}
                alt={featured.name}
                fill
                sizes="256px"
                className="object-cover transition-transform duration-500 group-hover/promo:scale-105"
              />
            </div>
            <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-4 py-4 text-xs uppercase tracking-[0.12em] text-cream">
              {featured.name}
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
