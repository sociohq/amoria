"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useAuthDrawer } from "@/lib/auth-drawer-context";
import { useCart } from "@/lib/cart-context";
import { Category } from "@/lib/types";
import { getPublicSettings, PublicSettings } from "@/lib/settings";
import { SocialLinks } from "./SocialIcons";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";

const SOLID_THRESHOLD_PX = 60;

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

// English-only for now. Arabic is listed (so the option is visible) but
// disabled until the site is actually translated — a selector that silently
// did nothing would be worse than an honest "soon".
function LanguageSelect({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1"
      >
        English
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 w-40 border border-border bg-white py-1 text-xs text-ink shadow-sm"
        >
          <li role="option" aria-selected className="flex items-center justify-between px-3 py-2">
            English
            <span aria-hidden className="text-royal">
              ✓
            </span>
          </li>
          <li role="option" aria-selected={false} aria-disabled className="flex items-center justify-between px-3 py-2 text-ink-soft/70">
            العربية
            <span className="text-[10px] uppercase tracking-wider">Soon</span>
          </li>
        </ul>
      )}
    </div>
  );
}

export function Header({ categories }: { categories: Category[] }) {
  const { user, logout } = useAuth();
  const { openDrawer: openAuthDrawer } = useAuthDrawer();
  const { itemCount, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  // A thin underline that slides to whichever nav item is hovered,
  // instead of each link just changing color on its own — measured
  // against the nav's own box so it works regardless of how wide each
  // link's text is.
  const [underline, setUnderline] = useState({ left: 0, width: 0, visible: false });

  function trackUnderline(e: React.MouseEvent<HTMLElement>) {
    const nav = navRef.current;
    if (!nav) return;
    const navRect = nav.getBoundingClientRect();
    const itemRect = e.currentTarget.getBoundingClientRect();
    setUnderline({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
      visible: true,
    });
  }

  function hideUnderline() {
    setUnderline((u) => ({ ...u, visible: false }));
  }

  // Dims the rest of the page behind a scrim while the mega menu is open,
  // so the header + dropdown are the visual focus. Rendered as the first
  // child of <header> (see below) so it paints under the header's own
  // chrome — which comes later in DOM order — but above everything else
  // on the page, since <header> itself sits at a higher z-index.
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  // Only pages that open on a full-bleed hero get the transparent-over-hero
  // treatment — logo/nav rows start see-through (the hero shows through)
  // and turn solid white once scrolled past it. Every other page is a
  // plain solid sticky header throughout.
  const hasFullBleedHero = pathname === "/" || pathname === "/our-story";
  const transparent = hasFullBleedHero && !scrolled;

  // Tracked on every page, not just home — the announcement bar collapses
  // on scroll everywhere, even though the transparent/solid logo treatment
  // below only applies on home.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SOLID_THRESHOLD_PX);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getPublicSettings()
      .then(setSettings)
      .catch(() => {
        // No social links, no icons — never block the header over this.
      });
  }, []);

  const barClasses = `relative flex items-center justify-between px-4 py-3 border-b transition-colors duration-300 md:justify-center md:px-6 ${
    transparent ? "border-white/25 bg-transparent" : "border-border bg-white"
  }`;
  const navClasses = `relative hidden justify-center gap-6 py-4 transition-colors duration-300 md:flex lg:gap-10 [&_a]:whitespace-nowrap ${
    transparent ? "bg-transparent" : "border-b border-border bg-white"
  }`;
  const textClass = transparent ? "text-cream" : "text-ink-soft";
  const linkHoverClass = transparent ? "hover:text-gold-light" : "hover:text-royal";
  const iconColor = transparent ? "text-cream" : "text-ink";

  return (
    <header className={hasFullBleedHero ? "fixed inset-x-0 top-0 z-40" : "sticky top-0 z-40"}>
      {/* Backdrop scrim behind the mega menu — dims the rest of the page so
          the header + dropdown stay the visual focus. First child so it
          paints under the rest of the header's own (later-DOM) chrome. */}
      <div
        aria-hidden
        className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${
          shopMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Utility strip (phones) + announcement bar — only shown at the very
          top; collapses away as soon as scrolling starts, on every page.
          Overflow is only clipped while collapsed, so the language
          dropdown can hang below the strip while it's visible. */}
      <div
        className={`transition-all duration-300 ${
          scrolled ? "max-h-0 overflow-hidden opacity-0" : "max-h-24 overflow-visible opacity-100"
        }`}
      >
        <div
          className={`flex items-center justify-between border-b px-4 py-2 text-xs transition-colors duration-300 md:hidden ${
            transparent ? "border-white/25 text-cream" : "border-border bg-white text-ink-soft"
          }`}
        >
          <Link href="/stores" className="flex items-center gap-1.5">
            <PinIcon />
            Find A Store
          </Link>
          <LanguageSelect />
        </div>

        <div className="relative bg-ink px-6 py-2 text-center">
          <p className="text-xs tracking-wide text-cream">Free Delivery in UAE for orders above AED 250</p>
          <div className="absolute inset-y-0 right-6 hidden items-center gap-4 text-xs text-cream/80 md:flex">
            <Link href="/stores" className="flex items-center gap-1 transition-colors hover:text-cream">
              <PinIcon />
              Find A Store
            </Link>
            <LanguageSelect />
          </div>
        </div>
      </div>

      {/* Logo row — phones: menu button + logo on the left, search and cart
          on the right. Larger screens: logo centered, socials left, icons
          right. */}
      <div className={barClasses}>
        <div className={`flex items-center gap-3 md:hidden ${iconColor}`}>
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/" aria-label="Amoria home">
            <Image
              src="/logo.png"
              alt="Amoria"
              width={130}
              height={36}
              className={`h-7 w-auto ${transparent ? "invert" : ""}`}
              priority
            />
          </Link>
        </div>

        <div className={`absolute inset-y-0 left-6 hidden items-center md:flex ${iconColor}`}>
          <SocialLinks settings={settings} max={4} />
        </div>

        <Link href="/" aria-label="Amoria home" className="hidden md:block">
          <Image
            src="/logo.png"
            alt="Amoria"
            width={130}
            height={36}
            className={`h-8 w-auto ${transparent ? "invert" : ""}`}
          />
        </Link>

        <div className={`flex items-center gap-4 md:absolute md:inset-y-0 md:right-6 md:gap-5 ${iconColor}`}>
          <button onClick={() => setSearchOpen(true)} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/wishlist" aria-label="Wishlist" className="hidden md:block">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1 4.5 2.5C11.5 6 13 5 15 5c3.5 0 5.5 3.5 3.5 7.5C19 16.65 12 21 12 21z" />
            </svg>
          </Link>
          <button onClick={openDrawer} aria-label="Open cart" className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6h15l-1.5 9h-13z" strokeLinejoin="round" />
              <path d="M6 6 4.5 2H2" strokeLinecap="round" />
              <circle cx="9" cy="20" r="1.3" />
              <circle cx="18" cy="20" r="1.3" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-crimson text-[10px] text-cream">
                {itemCount}
              </span>
            )}
          </button>
          {user ? (
            <button onClick={() => logout()} aria-label="Sign out" className="hidden md:block">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
              </svg>
            </button>
          ) : (
            <button onClick={() => openAuthDrawer("login")} aria-label="Sign in" className="hidden md:block">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Nav row */}
      <nav ref={navRef} className={navClasses} onMouseLeave={hideUnderline}>
        <span
          aria-hidden
          className={`pointer-events-none absolute bottom-2 h-px transition-all duration-300 ease-out ${
            transparent ? "bg-gold-light" : "bg-royal"
          }`}
          style={{ left: underline.left, width: underline.width, opacity: underline.visible ? 1 : 0 }}
        />
        <Link
          href="/"
          onMouseEnter={trackUnderline}
          className={`relative text-xs uppercase tracking-[0.12em] transition-colors ${textClass} ${linkHoverClass}`}
        >
          Home
        </Link>
        <div
          className="relative"
          onMouseEnter={(e) => {
            trackUnderline(e);
            setShopMenuOpen(true);
          }}
          onMouseLeave={() => setShopMenuOpen(false)}
        >
          <Link
            href="/shop"
            className={`relative flex items-center gap-1 text-xs uppercase tracking-[0.12em] transition-colors ${textClass} ${linkHoverClass}`}
          >
            The Shop
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </Link>
          <MegaMenu categories={categories} open={shopMenuOpen} />
        </div>
        <Link
          href="/shop?category=gift-sets"
          onMouseEnter={trackUnderline}
          className={`relative text-xs uppercase tracking-[0.12em] transition-colors ${textClass} ${linkHoverClass}`}
        >
          Gift Sets
        </Link>
        <Link
          href="/custom-perfume"
          onMouseEnter={trackUnderline}
          className={`relative text-xs uppercase tracking-[0.12em] transition-colors ${textClass} ${linkHoverClass}`}
        >
          Custom Perfume
        </Link>
        <Link
          href="/our-story"
          onMouseEnter={trackUnderline}
          className={`relative text-xs uppercase tracking-[0.12em] transition-colors ${textClass} ${linkHoverClass}`}
        >
          About Us
        </Link>
        <Link
          href="/blog"
          onMouseEnter={trackUnderline}
          className={`relative text-xs uppercase tracking-[0.12em] transition-colors ${textClass} ${linkHoverClass}`}
        >
          Journal
        </Link>
        <Link
          href="/contact"
          onMouseEnter={trackUnderline}
          className={`relative text-xs uppercase tracking-[0.12em] transition-colors ${textClass} ${linkHoverClass}`}
        >
          Contact Us
        </Link>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} categories={categories} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
