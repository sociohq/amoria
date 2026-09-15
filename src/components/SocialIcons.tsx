// Shared social-icon set for the header and footer, so both read the same
// admin-configured URLs (Settings.*Url) through one place instead of two
// copies of the same SVGs drifting apart.

export const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.4-1.5 1.6-1.5h1.4V4.2c-.4 0-1.5-.1-2.8-.1-2.6 0-4.4 1.6-4.4 4.5v2.9H6.8v3H9.3V21h4.2Z" />
  </svg>
);

export const TiktokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.6 2h-3.1v13.4a2.9 2.9 0 1 1-2.9-2.9c.2 0 .4 0 .6.05V9.4a5.9 5.9 0 1 0 5.4 5.9V8.3a7.3 7.3 0 0 0 4.2 1.4V6.6a4.3 4.3 0 0 1-4.2-4.6Z" />
  </svg>
);

export const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.8L4.6 22H1.5l8.1-9.3L1 2h7.1l4.9 6.2L18.9 2zm-1.2 18h1.9L7.3 4H5.3l12.4 16z" />
  </svg>
);

interface SocialLinksProps {
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  twitterUrl?: string | null;
  className?: string;
  linkClassName?: string;
}

// Renders only the platforms that have a URL configured in Settings — no
// dead "#" links waiting to be filled in later.
export function SocialLinks({
  instagramUrl,
  facebookUrl,
  tiktokUrl,
  twitterUrl,
  className = "",
  linkClassName = "transition-colors hover:opacity-70",
}: SocialLinksProps) {
  const links = [
    instagramUrl ? { href: instagramUrl, label: "Instagram", Icon: InstagramIcon } : null,
    facebookUrl ? { href: facebookUrl, label: "Facebook", Icon: FacebookIcon } : null,
    tiktokUrl ? { href: tiktokUrl, label: "TikTok", Icon: TiktokIcon } : null,
    twitterUrl ? { href: twitterUrl, label: "X (Twitter)", Icon: XIcon } : null,
  ].filter((l): l is { href: string; label: string; Icon: () => React.JSX.Element } => l !== null);

  if (links.length === 0) return null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={linkClassName}>
          <Icon />
        </a>
      ))}
    </div>
  );
}
