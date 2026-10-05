"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useAuthDrawer } from "@/lib/auth-drawer-context";
import { submitProductReview } from "@/lib/reviews";
import { ApiError } from "@/lib/api";

// "Write a review" on a product page. Signed-out visitors are sent to the
// sign-in drawer first (a review needs an account, which also limits spam);
// submissions are held for approval, so the confirmation says so rather
// than pretending the review is already live.
export function ReviewForm({ productId, productName }: { productId: string; productName: string }) {
  const { user, loading } = useAuth();
  const { openDrawer } = useAuthDrawer();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please choose a star rating");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const { message } = await submitProductReview({ productId, rating, reviewText: text });
      setDone(message);
      setOpen(false);
      setText("");
      setRating(0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const shown = hover || rating;

  return (
    <section className="px-6 pb-4 pt-2 text-center sm:px-12">
      <div className="mx-auto max-w-xl border-t border-border pt-10">
        <p className="label-caps text-gold">Share Your Experience</p>
        <h2 className="mt-1 font-serif text-2xl text-ink sm:text-3xl">Have you tried {productName}?</h2>

        {done ? (
          <p className="mt-5 text-sm text-royal">{done}</p>
        ) : !open ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => (user ? setOpen(true) : openDrawer("login"))}
            className="mt-5 inline-block border border-ink px-8 py-3 label-caps text-ink transition-colors hover:bg-ink hover:text-cream disabled:opacity-50"
          >
            {user ? "Write A Review" : "Sign In To Write A Review"}
          </button>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4 text-left">
            <div>
              <p className="label-caps mb-2 text-ink-soft">Your rating</p>
              <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    aria-pressed={rating === n}
                    className="p-0.5"
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 20 20"
                      fill={n <= shown ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-gold"
                    >
                      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="review-text" className="label-caps mb-2 block text-ink-soft">
                Your review
              </label>
              <textarea
                id="review-text"
                required
                minLength={10}
                maxLength={1500}
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="How does it wear? Longevity, projection, when you reach for it…"
                className="w-full border border-border bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-royal"
              />
            </div>
            {error && <p className="text-sm text-crimson">{error}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-ink py-3 label-caps text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border border-border px-5 py-3 label-caps text-ink-soft hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
