"use client";

import { useEffect, useState } from "react";
import { listReelsAdmin, createReel, updateReel, deleteReel } from "@/lib/admin";
import { listProducts } from "@/lib/products";
import { Reel, Product } from "@/lib/types";
import { ApiError } from "@/lib/api";

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

  const inputClass = "border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-royal";

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-ink">Reels</h1>
      <p className="mb-6 max-w-2xl text-sm text-ink-soft">
        The homepage&apos;s &quot;Shop By Reels&quot; video carousel: each entry is one looping video tied to a real
        product. Only <strong className="text-ink">Active</strong> reels show on the storefront. Video URL can be a
        local <code>/public</code> path or any hosted video URL.
      </p>

      <form onSubmit={handleCreate} className="mb-8 flex max-w-2xl flex-wrap gap-2">
        <input
          required
          placeholder="Video URL (e.g. /reels/velaris.mp4)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className={`${inputClass} min-w-[240px] flex-1`}
        />
        <select value={productId} onChange={(e) => setProductId(e.target.value)} className={inputClass}>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button disabled={submitting} className="bg-ink px-5 py-2 label-caps text-cream hover:opacity-90 disabled:opacity-50">
          Add
        </button>
      </form>
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <table className="w-full max-w-3xl border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-ink-soft">
            <th className="py-2">Video</th>
            <th className="py-2">Product</th>
            <th className="py-2">Position</th>
            <th className="py-2">Active</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {reels.map((r) => (
            <tr key={r.id} className="border-b border-border">
              <td className="max-w-[220px] truncate py-2 text-ink-soft" title={r.videoUrl}>
                {r.videoUrl}
              </td>
              <td className="py-2 text-ink">{r.product.name}</td>
              <td className="py-2">
                <input
                  type="number"
                  defaultValue={r.position}
                  onBlur={(e) => savePosition(r.id, Number(e.target.value))}
                  className="w-16 border border-border bg-cream px-2 py-1 text-xs outline-none focus:border-royal"
                />
              </td>
              <td className="py-2 text-center">
                <input
                  type="checkbox"
                  checked={r.active}
                  onChange={(e) => toggleActive(r.id, e.target.checked)}
                  style={{ accentColor: "var(--color-ink)" }}
                />
              </td>
              <td className="py-2 text-right">
                <button onClick={() => handleDelete(r.id)} className="text-crimson hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {reels.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-ink-soft">
                No reels yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
