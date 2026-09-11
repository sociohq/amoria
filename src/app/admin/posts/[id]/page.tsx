"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { getPostAdmin } from "@/lib/admin";
import { Post } from "@/lib/types";
import { PostForm } from "@/components/admin/PostForm";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPostAdmin(id)
      .then(({ post }) => setPost(post))
      .catch(() => setError("Could not load post"));
  }, [id]);

  if (error) return <p className="text-sm text-crimson">{error}</p>;
  if (!post) return <p className="text-ink-soft">Loading…</p>;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-ink">Edit Post</h1>
      <PostForm post={post} />
    </div>
  );
}
