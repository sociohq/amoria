"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listPostsAdmin, deletePost } from "@/lib/admin";
import { Post } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { PageHeader, Card, Button, Table, TableHead, Badge } from "@/components/admin/ui";

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
      <PageHeader
        title="Blog Posts"
        action={
          <Link href="/admin/posts/new">
            <Button>New Post</Button>
          </Link>
        }
      />
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <Card>
        <Table>
          <TableHead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th />
            </tr>
          </TableHead>
          <tbody className="divide-y divide-border">
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="font-medium text-ink">{p.title}</td>
                <td>
                  <Badge tone={p.status === "PUBLISHED" ? "success" : "neutral"}>
                    {p.status === "PUBLISHED" ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/posts/${p.id}`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={3} className="py-10 text-center text-ink-soft">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
