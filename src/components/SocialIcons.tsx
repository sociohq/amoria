// Shared social-icon set for the header and footer, so both read the same
// admin-configured URLs (Settings.*Url) through one place instead of two
// copies of the same SVGs drifting apart.

import { Settings } from "@/lib/types";

type IconProps = { size?: number };

export const InstagramIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.4-1.5 1.6-1.5h1.4V4.2c-.4 0-1.5-.1-2.8-.1-2.6 0-4.4 1.6-4.4 4.5v2.9H6.8v3H9.3V21h4.2Z" />
  </svg>
);

export const TiktokIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.6 2h-3.1v13.4a2.9 2.9 0 1 1-2.9-2.9c.2 0 .4 0 .6.05V9.4a5.9 5.9 0 1 0 5.4 5.9V8.3a7.3 7.3 0 0 0 4.2 1.4V6.6a4.3 4.3 0 0 1-4.2-4.6Z" />
  </svg>
);

export const XIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.8L4.6 22H1.5l8.1-9.3L1 2h7.1l4.9 6.2L18.9 2zm-1.2 18h1.9L7.3 4H5.3l12.4 16z" />
  </svg>
);

export const ThreadsIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.6 11.1c-.3-3.1-2.1-4.7-5.2-4.7-2.5 0-4.4 1.3-5.3 3.5M17.9 12.6c-.9-.6-2-.9-3.3-.9-2.3 0-3.9 1.1-3.9 2.7 0 1.5 1.3 2.5 3 2.4 2.2-.1 3.6-1.5 3.9-4.2" />
    <path d="M20.7 13.6c0 4.5-3.2 7.4-8.5 7.4C6.9 21 3.5 17.7 3.5 12S6.9 3 12.2 3c4.3 0 7.1 1.9 8 5.3" />
  </svg>
);

export const YoutubeIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);

export const PinterestIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 5.1 3.2 9.4 7.6 11.2-.1-.9-.2-2.4 0-3.4.2-.9 1.4-6 1.4-6s-.4-.7-.4-1.8c0-1.7 1-2.9 2.2-2.9 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4-.3 1.2.6 2.2 1.8 2.2 2.1 0 3.8-2.2 3.8-5.5 0-2.9-2.1-4.9-5-4.9-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.2.1.3l-.3 1.4c0 .2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.6 0-3.8 2.7-7.3 7.9-7.3 4.2 0 7.4 3 7.4 6.9 0 4.1-2.6 7.5-6.2 7.5-1.2 0-2.4-.6-2.8-1.4l-.7 2.8c-.3 1-1 2.4-1.5 3.1 1.1.3 2.3.5 3.5.5 6.6 0 12-5.4 12-12S18.6 0 12 0Z" />
  </svg>
);

export const SnapchatIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
    <path d="M12 3c2.6 0 4.5 1.9 4.5 4.6 0 .8-.1 1.6-.1 2.3.3.2.8.3 1.3.1.6-.2 1.2.4.8.9-.5.6-1.4.8-1.9 1 .1.4.9 2 2.9 2.6.6.2.5.9-.2 1.1-.9.2-1.5.4-1.7.9-.1.4-.2.8-1 .6-.9-.2-1.8-.2-2.6.4-.7.5-1.4 1-2 1s-1.3-.5-2-1c-.8-.6-1.7-.6-2.6-.4-.8.2-.9-.2-1-.6-.2-.5-.8-.7-1.7-.9-.7-.2-.8-.9-.2-1.1 2-.6 2.8-2.2 2.9-2.6-.5-.2-1.4-.4-1.9-1-.4-.5.2-1.1.8-.9.5.2 1 .1 1.3-.1 0-.7-.1-1.5-.1-2.3C7.5 4.9 9.4 3 12 3Z" />
  </svg>
);

type SocialSettings = Partial<
  Pick<
    Settings,
    | "instagramUrl"
    | "facebookUrl"
    | "tiktokUrl"
    | "twitterUrl"
    | "threadsUrl"
    | "youtubeUrl"
    | "pinterestUrl"
    | "snapchatUrl"
  >
>;

const PLATFORMS: { key: keyof SocialSettings; label: string; Icon: (p: IconProps) => React.JSX.Element }[] = [
  { key: "instagramUrl", label: "Instagram", Icon: InstagramIcon },
  { key: "facebookUrl", label: "Facebook", Icon: FacebookIcon },
  { key: "tiktokUrl", label: "TikTok", Icon: TiktokIcon },
  { key: "twitterUrl", label: "X (Twitter)", Icon: XIcon },
  { key: "threadsUrl", label: "Threads", Icon: ThreadsIcon },
  { key: "youtubeUrl", label: "YouTube", Icon: YoutubeIcon },
  { key: "pinterestUrl", label: "Pinterest", Icon: PinterestIcon },
  { key: "snapchatUrl", label: "Snapchat", Icon: SnapchatIcon },
];

interface SocialLinksProps {
  settings?: SocialSettings | null;
  // Limits how many platforms are shown (the header only has room for a few).
  max?: number;
  size?: number;
  className?: string;
  linkClassName?: string;
}

// Renders only the platforms that have a URL configured in Settings — no
// dead "#" links waiting to be filled in later.
export function SocialLinks({
  settings,
  max,
  size = 18,
  className = "",
  linkClassName = "transition-colors hover:opacity-70",
}: SocialLinksProps) {
  const links = PLATFORMS.filter((p) => settings?.[p.key]).slice(0, max);

  if (links.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {links.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={settings![key]!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={linkClassName}
        >
          <Icon size={size} />
        </a>
      ))}
    </div>
  );
}
