import Image from "next/image";
import { Review } from "@/lib/types";
import { Stars } from "./StarRating";

// A customer testimonial card — photo on the left, star rating, quote, and
// name (+ location, when set) on the right, matching the reference layout
// the site owner shared. Falls back to an initial-letter placeholder when
// no photo has been uploaded for that review yet.
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex w-[380px] shrink-0 gap-5 bg-cream-dark p-6 sm:w-[420px]">
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-white sm:h-32 sm:w-32">
        {review.customerImage ? (
          <Image src={review.customerImage} alt={review.customerName} fill sizes="128px" className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-serif text-3xl text-ink-soft">
            {review.customerName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex flex-col justify-center">
        {/* Unfilled stars read as a black outline here (matching the
            reference), rather than the gold outline used on the product
            card's aggregate summary elsewhere. */}
        <Stars rating={review.rating} unfilledColor="text-ink" />
        <p className="mt-3 text-sm font-medium leading-snug text-ink">{review.reviewText}</p>
        <p className="mt-4 text-sm font-semibold text-ink">
          {review.customerName}
          {review.location && <span className="font-normal text-ink-soft"> , {review.location}</span>}
        </p>
      </div>
    </div>
  );
}

// Used both on the homepage (admin-curated "featured" reviews, see
// getFeaturedReviews) and under each product page (that product's own
// reviews, already included in the product fetch) — same card, different
// heading and review list passed in. Renders nothing until there's at
// least one real review; no placeholder/invented testimonials.
//
// The row scrolls itself continuously (left-to-right, per the site
// owner's request) rather than sitting still or needing arrow clicks —
// the list is rendered twice back to back so the loop is seamless, and
// the animation pauses on hover so a review can actually be read.
export function ReviewsSection({ eyebrow, title, reviews }: { eyebrow: string; title: string; reviews: Review[] }) {
  if (reviews.length === 0) return null;

  const track = [...reviews, ...reviews];
  // Slower with more reviews so each card gets roughly the same amount of
  // screen time regardless of how many there are.
  const durationSeconds = reviews.length * 6;

  return (
    <section className="py-16">
      <div className="mb-10 px-6 text-center sm:px-12">
        <p className="label-caps text-gold">{eyebrow}</p>
        <h2 className="mt-1 font-serif text-3xl text-ink">{title}</h2>
      </div>
      <div className="overflow-hidden">
        <div
          className="reviews-marquee flex w-max gap-6"
          style={{ animationDuration: `${durationSeconds}s` }}
        >
          {track.map((r, i) => (
            <ReviewCard key={`${r.id}-${i}`} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
