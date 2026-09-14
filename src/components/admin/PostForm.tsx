"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost, PostInput } from "@/lib/admin";
import { listProducts } from "@/lib/products";
import { Post, Product, BlogBlock } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { PostBlockEditor } from "./PostBlockEditor";

const inputClass = "w-full border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-royal";

const EMPTY: PostInput = {
  title: "",
  excerpt: "",
  heroImage: "",
  heroEyebrow: "",
  content: [],
  status: "DRAFT",
};

export function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [draft, setDraft] = useState<PostInput>(
    post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          heroImage: post.heroImage,
          heroEyebrow: post.heroEyebrow ?? "",
          content: post.content,
          status: post.status,
        }
      : EMPTY
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listProducts({ limit: 100 })
      .then(({ products }) => setProducts(products))
      .catch(() => {});
  }, []);

  function setContent(content: BlogBlock[]) {
    setDraft((d) => ({ ...d, content }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (post) {
        await updatePost(post.id, draft);
      } else {
        await createPost(draft);
      }
      router.push("/admin/posts");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div>
        <label className="label-caps mb-1 block text-ink-soft">Title</label>
        <input
          required
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className="label-caps mb-1 block text-ink-soft">Slug (optional, derived from title)</label>
        <input
          value={draft.slug ?? ""}
          onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className="label-caps mb-1 block text-ink-soft">Excerpt</label>
        <textarea
          required
          rows={2}
          value={draft.excerpt}
          onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className="label-caps mb-1 block text-ink-soft">Hero Image URL</label>
        <input
          required
          value={draft.heroImage}
          onChange={(e) => setDraft({ ...draft, heroImage: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className="label-caps mb-1 block text-ink-soft">Hero Eyebrow (optional)</label>
        <input
          value={draft.heroEyebrow}
          onChange={(e) => setDraft({ ...draft, heroEyebrow: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className="label-caps mb-1 block text-ink-soft">Status</label>
        <select
          value={draft.status}
          onChange={(e) => setDraft({ ...draft, status: e.target.value as "DRAFT" | "PUBLISHED" })}
          className={inputClass}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <div>
        <h2 className="mb-3 font-serif text-xl text-ink">Content</h2>
        <PostBlockEditor blocks={draft.content} onChange={setContent} products={products} />
      </div>

      {error && <p className="text-sm text-crimson">{error}</p>}
      <button disabled={submitting} className="bg-ink px-6 py-3 label-caps text-cream hover:opacity-90 disabled:opacity-50">
        {submitting ? "Saving…" : post ? "Save Changes" : "Create Post"}
      </button>
    </form>
  );
}
