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
import { PageHeader, Card, Button, Table, TableHead, inputClass } from "@/components/admin/ui";

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

  return (
    <div>
      <PageHeader
        title="Reviews"
        description={
          <>
            Customer testimonials — attach one to a product to show it on that product&apos;s page (and fold it into
            the star rating shown there), and/or mark it <strong className="text-ink">Featured</strong> to also show
            it on the homepage. Leave Product unset for a homepage-only testimonial.
          </>
        }
      />

      <form onSubmit={handleCreate} className="mb-6 max-w-2xl space-y-3 rounded-xl border border-border bg-white p-4">
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
          <Button type="submit" disabled={submitting} className="ml-auto">
            Add Review
          </Button>
        </div>
      </form>
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <Card>
        <Table>
          <TableHead>
            <tr>
              <th>Photo</th>
              <th>Customer</th>
              <th>Rating</th>
              <th>Product</th>
              <th>Featured</th>
              <th />
            </tr>
          </TableHead>
          <tbody className="divide-y divide-border">
            {reviews.map((r) => (
              <tr key={r.id} className="align-top">
                <td>
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
                <td className="max-w-[220px] text-ink">
                  {r.customerName}
                  {r.location && <span className="text-ink-soft">, {r.location}</span>}
                  <p className="mt-1 max-w-[220px] truncate text-xs text-ink-soft" title={r.reviewText}>
                    {r.reviewText}
                  </p>
                </td>
                <td className="text-ink">{r.rating} ★</td>
                <td className="text-ink-soft">{r.product?.name ?? "—"}</td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={r.featured}
                    onChange={(e) => toggleFeatured(r.id, e.target.checked)}
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
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-ink-soft">
                  No reviews yet.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
