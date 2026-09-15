"use client";

import { useEffect, useState } from "react";
import { listReelsAdmin, createReel, updateReel, deleteReel } from "@/lib/admin";
import { listProducts } from "@/lib/products";
import { Reel, Product } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { PageHeader, Card, Button, Table, TableHead, inputClass } from "@/components/admin/ui";

export default function AdminReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [productId, setProductId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function refresh() {
    listReelsAdmin()
      .then(({ reels }) => setReels(reels))
      .catch(() => setError("Could not load reels"));
  }

  useEffect(() => {
    refresh();
    listProducts({ limit: 100 })
      .then(({ products }) => {
        setProducts(products);
        setProductId((id) => id || products[0]?.id || "");
      })
      .catch(() => {});
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!productId) return;
    setError(null);
    setSubmitting(true);
    try {
      await createReel({ videoUrl, productId, position: reels.length });
      setVideoUrl("");
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this reel?")) return;
    try {
      await deleteReel(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete reel");
    }
  }

  async function toggleActive(id: string, active: boolean) {
    try {
      await updateReel(id, { active });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update reel");
    }
  }

  async function savePosition(id: string, position: number) {
    try {
      await updateReel(id, { position });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update position");
    }
  }

  return (
    <div>
      <PageHeader
        title="Reels"
        description={
          <>
            The homepage&apos;s &quot;Shop By Reels&quot; video carousel: each entry is one looping video tied to a
            real product. Only <strong className="text-ink">Active</strong> reels show on the storefront. Video URL
            can be a local <code className="rounded bg-ink/5 px-1 py-0.5">/public</code> path or any hosted video
            URL.
          </>
        }
      />

      <form onSubmit={handleCreate} className="mb-6 flex max-w-2xl flex-wrap gap-2">
        <input
          required
          placeholder="Video URL (e.g. /reels/velaris.mp4)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className={`${inputClass} min-w-[240px] flex-1`}
        />
        <select value={productId} onChange={(e) => setProductId(e.target.value)} className={`${inputClass} w-auto`}>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={submitting}>
          Add
        </Button>
      </form>
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <Card>
        <Table>
          <TableHead>
            <tr>
              <th>Video</th>
              <th>Product</th>
              <th>Position</th>
              <th>Active</th>
              <th />
            </tr>
          </TableHead>
          <tbody className="divide-y divide-border">
            {reels.map((r) => (
              <tr key={r.id}>
                <td className="max-w-[220px] truncate text-ink-soft" title={r.videoUrl}>
                  {r.videoUrl}
                </td>
                <td className="text-ink">{r.product.name}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={r.position}
                    onBlur={(e) => savePosition(r.id, Number(e.target.value))}
                    className={`${inputClass} w-16 py-1.5 text-xs`}
                  />
                </td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={r.active}
                    onChange={(e) => toggleActive(r.id, e.target.checked)}
                    style={{ accentColor: "var(--color-ink)" }}
                  />
                </td>
                <td className="text-right">
                  <Button variant="danger" size="sm" onClick={() => handleDelete(r.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {reels.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-ink-soft">
                  No reels yet.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
