"use client";

// Floating bottom-right mark with a recurring "aurora" gradient shimmer —
// the icon itself is used as a CSS mask (its solid black shapes become the
// visible region) so the gradient can move across it, rather than being a
// flat single-colour icon. The moving gradient stays confined to the icon's
// own shape (no glow/blur bleeding outside it). Functionality is
// intentionally a no-op for now; the user will specify what it should do on
// click in a later request.
export function AuroraMark() {
  return (
    <button
      type="button"
      aria-label="Amoria"
      className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md shadow-ink/10 transition-transform duration-300 hover:scale-105"
    >
      <span
        aria-hidden
        className="aurora-mark relative h-11 w-11"
        style={{
          WebkitMaskImage: "url(/icons/amoria-mark.svg)",
          maskImage: "url(/icons/amoria-mark.svg)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </button>
  );
}
