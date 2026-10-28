import Link from "next/link";
import { Post } from "@/lib/types";
import { PostCard } from "./PostCard";

const MAX_POSTS = 3;

// The homepage's journal teaser: the newest stories (up to three) as the same cards the Journal page
// uses. With one story published it shows that one; with none it shows nothing at all.
export function BlogSection({ posts }: { posts: Post[] }) {
  const shown = posts.slice(0, MAX_POSTS);
  if (shown.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="label-caps text-gold">The Journal</p>
          <h2 className="mt-1 font-serif text-3xl text-ink">Stories from Amoria</h2>
        </div>
        <Link href="/blog" className="text-sm text-ink underline underline-offset-4 hover:text-royal">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3">
        {shown.map((post) => (
          <PostCard key={post.id} post={post} sizes="(min-width: 640px) 33vw, 100vw" />
        ))}
      </div>
    </section>
  );
}
