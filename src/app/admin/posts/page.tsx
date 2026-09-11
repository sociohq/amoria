"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listPostsAdmin, deletePost } from "@/lib/admin";
import { Post } from "@/lib/types";
import { ApiError } from "@/lib/api";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    listPostsAdmin()
      .then(({ posts }) => setPosts(posts))
      .catch(() => setError("Could not load posts"));
  }

  useEffect(refresh, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete post");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink">Blog Posts</h1>
        <Link href="/admin/posts/new" className="bg-ink px-5 py-2 label-caps text-cream hover:opacity-90">
          New Post
        </Link>
      </div>
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <table className="w-full max-w-3xl border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-ink-soft">
            <th className="py-2">Title</th>
            <th className="py-2">Status</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id} className="border-b border-border">
              <td className="py-2 text-ink">{p.title}</td>
              <td className="py-2 text-ink-soft">{p.status === "PUBLISHED" ? "Published" : "Draft"}</td>
              <td className="py-2 text-right">
                <Link href={`/admin/posts/${p.id}`} className="mr-4 text-emerald hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(p.id)} className="text-crimson hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={3} className="py-6 text-center text-ink-soft">
                No posts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
