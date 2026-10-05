// Shown the instant a link is clicked while the next page's data is still
// loading — without this the page sat frozen after a click (no sign
// anything was happening), which read as a broken link and led to repeat
// clicks. Pages with their own, more specific skeleton (e.g. product pages)
// override this one.
export default function StorefrontLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6" role="status" aria-label="Loading">
      <span className="font-serif text-xl tracking-[0.3em] text-ink-soft">AMORIA</span>
      <span className="relative block h-px w-28 overflow-hidden bg-border">
        <span className="absolute inset-y-0 left-0 w-1/2 animate-[loader-slide_1s_ease-in-out_infinite] bg-gold" />
      </span>
    </div>
  );
}
