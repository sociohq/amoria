import Image from "next/image";
import { Review } from "@/lib/types";
import { Stars } from "./StarRating";

// A customer testimonial card — image (or an initial-letter placeholder
// when the admin hasn't uploaded one), star rating, quote, and name.
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border border-border bg-white p-6">
      <Stars rating={review.rating} />
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">&ldquo;{review.reviewText}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-cream-dark">
          {review.customerImage ? (
            <Image src={review.customerImage} alt={review.customerName} fill sizes="40px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-serif text-sm text-ink-soft">
              {review.customerName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-ink">{review.customerName}</p>
      </div>
    </div>
  );
}

// Used both on the homepage (admin-curated "featured" reviews, see
// getFeaturedReviews) and under each product page (that product's own
// reviews, already included in the product fetch) — same card, different
// heading and review list passed in. Renders nothing until there's at
// least one real review; no placeholder/invented testimonials.
export function ReviewsSection({ eyebrow, title, reviews }: { eyebrow: string; title: string; reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="px-6 py-16 sm:px-12">
      <div className="mb-10 text-center">
        <p className="label-caps text-gold">{eyebrow}</p>
        <h2 className="mt-1 font-serif text-3xl text-ink">{title}</h2>
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
    </section>
  );
}
