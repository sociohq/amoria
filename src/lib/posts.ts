import { apiFetch } from "./api";
import { Post } from "./types";

export async function listPosts(): Promise<Post[]> {
  const { posts } = await apiFetch<{ posts: Post[] }>("/api/posts");
  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { post } = await apiFetch<{ post: Post }>(`/api/posts/${slug}`);
    return post;
  } catch {
    return null;
  }
}
