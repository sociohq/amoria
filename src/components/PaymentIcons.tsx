// Card-brand marks for the footer. Drawn as small inline SVGs on a white
// "card" so they read the same on the dark footer as they would on the
// checkout page — only the card networks Stripe Checkout actually accepts
// for this store are listed (no wallet/BNPL logos that aren't wired up).
function CardFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className="inline-flex h-7 w-11 items-center justify-center overflow-hidden rounded-[4px] bg-white"
    >
      {children}
    </span>
  );
}

export function PaymentIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CardFrame label="Visa">
        <svg viewBox="0 0 44 28" className="h-full w-full">
          <text
            x="22"
            y="19"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="14"
            fontWeight="800"
            fontStyle="italic"
            fill="#1A1F71"
            letterSpacing="-0.5"
          >
            VISA
          </text>
        </svg>
      </CardFrame>
      <CardFrame label="Mastercard">
        <svg viewBox="0 0 44 28" className="h-full w-full">
          <circle cx="17" cy="14" r="8" fill="#EB001B" />
          <circle cx="27" cy="14" r="8" fill="#F79E1B" />
          <path d="M22 7.9a8 8 0 0 1 0 12.2 8 8 0 0 1 0-12.2Z" fill="#FF5F00" />
        </svg>
      </CardFrame>
      <CardFrame label="American Express">
        <svg viewBox="0 0 44 28" className="h-full w-full">
          <rect width="44" height="28" fill="#2E77BC" />
          <text
            x="22"
            y="17.5"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="9.5"
            fontWeight="800"
            fill="#FFFFFF"
            letterSpacing="0.2"
          >
            AMEX
          </text>
        </svg>
      </CardFrame>
    </div>
  );
}
