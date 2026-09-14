// The row of 5 star glyphs on its own — shared between the aggregate
// summary below and each individual review card in ReviewsSection.
// unfilledColor defaults to a gold outline (the look already shipped on
// product cards); ReviewsSection passes text-ink instead to match its
// reference design's black outline on the empty stars.
export function Stars({
  rating,
  className = "",
  unfilledColor = "text-gold",
}: {
  rating: number;
  className?: string;
  unfilledColor?: string;
}) {
  return (
    <div className={`flex ${className}`} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <svg
            key={i}
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1"
            className={filled ? "text-gold" : unfilledColor}
          >
            <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
          </svg>
        );
      })}
    </div>
  );
}

export function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  if (reviewCount === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <Stars rating={rating} />
      <span className="text-sm text-ink-soft">
        {rating.toFixed(1)} ({reviewCount} Reviews)
      </span>
    </div>
  );
}
