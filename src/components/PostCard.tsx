import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/types";
import { formatPostDate } from "@/lib/format";

// One journal story as a card — used by the Journal page and by the homepage's blog section, so the two
// always look the same. A small landscape thumbnail (not a tall portrait), the eyebrow, date, title and a
// two-line excerpt.
export function PostCard({ post, sizes = "(min-width: 1024px) 25vw, 33vw" }: { post: Post; sizes?: string }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[3/2] overflow-hidden bg-cream-dark">
        <Image
          src={post.heroImage}
          alt={post.title}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        {post.heroEyebrow && <p className="label-caps text-gold">{post.heroEyebrow}</p>}
        <p className="mt-1 text-xs text-ink-soft">{formatPostDate(post.publishedAt ?? post.createdAt)}</p>
        <p className="mt-1 font-serif text-lg text-ink group-hover:text-royal">{post.title}</p>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{post.excerpt}</p>
      </div>
    </Link>
  );
}
