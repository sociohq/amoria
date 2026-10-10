import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getPostBySlug } from "@/lib/posts";
import { PostBody } from "@/components/PostBody";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Article not found", robots: { index: false } };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, ...(post.heroImage ? { images: [{ url: post.heroImage }] } : {}) },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <section className="relative flex h-[70vh] min-h-[420px] items-end overflow-hidden">
        <Image src={post.heroImage} alt="" fill sizes="100vw" className="object-cover" priority />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 px-6 pb-16 sm:px-12">
          {post.heroEyebrow && <p className="label-caps text-gold-light">{post.heroEyebrow}</p>}
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-cream sm:text-5xl">{post.title}</h1>
          <p className="mt-4 max-w-xl text-cream/85">{post.excerpt}</p>
        </div>
      </section>

      <PostBody content={post.content} />
    </article>
  );
}
