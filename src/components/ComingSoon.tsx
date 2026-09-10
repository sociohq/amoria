import Link from "next/link";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-lg px-6 py-32 text-center">
      <p className="label-caps text-gold">Coming Soon</p>
      <h1 className="mt-2 font-serif text-3xl text-ink">{title}</h1>
      <p className="mt-4 text-ink-soft">{description}</p>
      <Link href="/shop" className="mt-8 inline-block border border-ink px-8 py-3 label-caps text-ink hover:bg-ink hover:text-cream">
        Shop the Collection
      </Link>
    </div>
  );
}
