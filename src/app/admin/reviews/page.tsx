"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  listReviewsAdmin,
  createReview,
  updateReview,
  deleteReview,
  uploadReviewImage,
} from "@/lib/admin";
import { listProducts } from "@/lib/products";
import { Review, Product } from "@/lib/types";
import { ApiError } from "@/lib/api";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [customerName, setCustomerName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [productId, setProductId] = useState(""); // "" = no product (homepage-only)
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Tracks which row's image upload is in flight, so only that row's
  // file input shows a "Uploading…" state.
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  function refresh() {
    listReviewsAdmin()
      .then(({ reviews }) => setReviews(reviews))
      .catch(() => setError("Could not load reviews"));
  }

  useEffect(() => {
    refresh();
    listProducts({ limit: 100 })
      .then(({ products }) => setProducts(products))
      .catch(() => {});
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createReview({
        customerName,
        location: location || null,
        rating,
        reviewText,
        productId: productId || null,
        featured,
      });
      setCustomerName("");
      setLocation("");
      setRating(5);
      setReviewText("");
      setProductId("");
      setFeatured(false);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete review");
    }
  }

  async function toggleFeatured(id: string, next: boolean) {
    try {
      await updateReview(id, { featured: next });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update review");
    }
  }

  async function handleImageChange(id: string, file: File | undefined) {
    if (!file) return;
    setUploadingId(id);
    setError(null);
    try {
      await uploadReviewImage(id, file);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload image");
    } finally {
      setUploadingId(null);
    }
  }

  const inputClass = "border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-royal";

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-ink">Reviews</h1>
      <p className="mb-6 max-w-2xl text-sm text-ink-soft">
        Customer testimonials — attach one to a product to show it on that product&apos;s page (and fold it into the
        star rating shown there), and/or mark it <strong className="text-ink">Featured</strong> to also show it on
        the homepage. Leave Product unset for a homepage-only testimonial.
      </p>

      <form onSubmit={handleCreate} className="mb-8 max-w-2xl space-y-3 border border-border p-4">
        <div className="flex flex-wrap gap-2">
          <input
            required
            placeholder="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className={`${inputClass} min-w-[160px] flex-1`}
          />
          <input
            placeholder="Location (optional, e.g. Dubai)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`${inputClass} min-w-[160px] flex-1`}
          />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className={inputClass}
            aria-label="Rating"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} Star{n === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </div>
        <textarea
          required
          placeholder="Review text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={3}
          className={`${inputClass} w-full`}
        />
        <div className="flex flex-wrap items-center gap-4">
          <select value={productId} onChange={(e) => setProductId(e.target.value)} className={inputClass}>
            <option value="">No product (homepage only)</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              style={{ accentColor: "var(--color-ink)" }}
            />
            Featured on homepage
          </label>
          <button
            disabled={submitting}
            className="ml-auto bg-ink px-5 py-2 label-caps text-cream hover:opacity-90 disabled:opacity-50"
          >
            Add Review
          </button>
        </div>
      </form>
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <table className="w-full max-w-4xl border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-ink-soft">
            <th className="py-2">Photo</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Rating</th>
            <th className="py-2">Product</th>
            <th className="py-2">Featured</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} className="border-b border-border align-top">
              <td className="py-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-cream-dark">
                  {r.customerImage && (
                    <Image src={r.customerImage} alt={r.customerName} fill sizes="48px" className="object-cover" />
                  )}
                </div>
                <input
                  ref={(el) => {
                    fileInputs.current[r.id] = el;
                  }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageChange(r.id, e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileInputs.current[r.id]?.click()}
                  disabled={uploadingId === r.id}
                  className="mt-1 block text-xs text-ink-soft underline underline-offset-2 hover:text-royal disabled:opacity-50"
                >
                  {uploadingId === r.id ? "Uploading…" : r.customerImage ? "Change" : "Upload"}
                </button>
              </td>
              <td className="max-w-[220px] py-3 text-ink">
                {r.customerName}
                {r.location && <span className="text-ink-soft">, {r.location}</span>}
                <p className="mt-1 max-w-[220px] truncate text-xs text-ink-soft" title={r.reviewText}>
                  {r.reviewText}
                </p>
              </td>
              <td className="py-3 text-ink">{r.rating} ★</td>
              <td className="py-3 text-ink-soft">{r.product?.name ?? "—"}</td>
              <td className="py-3 text-center">
                <input
                  type="checkbox"
                  checked={r.featured}
                  onChange={(e) => toggleFeatured(r.id, e.target.checked)}
                  style={{ accentColor: "var(--color-ink)" }}
                />
              </td>
              <td className="py-3 text-right">
                <button onClick={() => handleDelete(r.id)} className="text-crimson hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-ink-soft">
                No reviews yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
