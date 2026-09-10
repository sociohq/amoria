"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { Category } from "@/lib/types";

const SOLID_THRESHOLD_PX = 60;

export function Header({ categories }: { categories: Category[] }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // Only the home page has a full-viewport hero behind the header — there
  // the logo/nav rows start transparent (hero shows through) and turn
  // solid white once scrolled past it. Every other page is a plain solid
  // sticky header throughout.
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) return;
    function onScroll() {
      setScrolled(window.scrollY > SOLID_THRESHOLD_PX);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const barClasses = `relative flex items-center justify-center px-6 py-3 border-b transition-colors duration-300 ${
    transparent ? "border-white/25 bg-transparent" : "border-border bg-white"
  }`;
  const navClasses = `hidden justify-center gap-10 py-4 transition-colors duration-300 md:flex ${
    transparent ? "bg-transparent" : "border-b border-border bg-white"
  }`;
  const textClass = transparent ? "text-cream" : "text-ink-soft";
  const linkHoverClass = transparent ? "hover:text-gold-light" : "hover:text-emerald";

  return (
    <header className={isHome ? "fixed inset-x-0 top-0 z-40" : "sticky top-0 z-40"}>
      {/* Announcement bar — always solid, on every page */}
      <div className="relative bg-ink px-6 py-2 text-center">
        <p className="text-xs tracking-wide text-cream">Free Delivery in UAE for orders above AED 250</p>
        <div className="absolute inset-y-0 right-6 hidden items-center gap-4 text-xs text-cream/80 sm:flex">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" strokeLinejoin="round" />
            </svg>
            Find A Store
          </span>
          <span>English</span>
        </div>
      </div>

      {/* Logo row */}
      <div className={barClasses}>
        <Link href="/">
          {transparent ? (
            <Image src="/logo.png" alt="Amoria" width={130} height={36} className="h-8 w-auto invert" priority />
          ) : (
            <Image src="/logo.png" alt="Amoria" width={130} height={36} className="h-8 w-auto" priority />
          )}
        </Link>

        <div className={`absolute inset-y-0 right-6 flex items-center gap-5 ${transparent ? "text-cream" : "text-ink"}`}>
          <button aria-label="Wishlist" className="hidden sm:block">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1 4.5 2.5C11.5 6 13 5 15 5c3.5 0 5.5 3.5 3.5 7.5C19 16.65 12 21 12 21z" />
            </svg>
          </button>
          <Link href="/cart" className="relative">
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
          </Link>
          {user ? (
            <button onClick={() => logout()} aria-label="Sign out" className="hidden sm:block">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
              </svg>
            </button>
          ) : (
            <Link href="/login" aria-label="Sign in" className="hidden sm:block">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
              </svg>
            </Link>
          )}
          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Nav row */}
      <nav className={navClasses}>
        <Link href="/" className={`text-xs uppercase tracking-[0.12em] transition-colors ${textClass} ${linkHoverClass}`}>
          Home
        </Link>
        <div className="group relative">
          <Link
            href="/shop"
            className={`flex items-center gap-1 text-xs uppercase tracking-[0.12em] transition-colors ${textClass} ${linkHoverClass}`}
          >
            The Shop
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </Link>
          {categories.length > 0 && (
            <div className="invisible absolute left-1/2 top-full flex -translate-x-1/2 justify-center pt-3 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
              <div className="flex flex-col gap-1 border border-border bg-white px-5 py-3 shadow-sm">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/shop?category=${c.slug}`}
                    className="whitespace-nowrap py-1 text-sm text-ink-soft hover:text-emerald"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <Link
          href="/shop?category=gift-sets"
          className={`text-xs uppercase tracking-[0.12em] transition-colors ${textClass} ${linkHoverClass}`}
        >
          Gift Sets
        </Link>
        <Link
          href="/custom-perfume"
          className={`text-xs uppercase tracking-[0.12em] transition-colors ${textClass} ${linkHoverClass}`}
        >
          Custom Perfume
        </Link>
        <Link
          href="/gift-cards"
          className={`text-xs uppercase tracking-[0.12em] transition-colors ${textClass} ${linkHoverClass}`}
        >
          Gift Cards
        </Link>
        <Link
          href="/our-story"
          className={`text-xs uppercase tracking-[0.12em] transition-colors ${textClass} ${linkHoverClass}`}
        >
          Our Story
        </Link>
      </nav>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-b border-border bg-white px-6 py-4 md:hidden">
          <Link href="/" className="py-2 label-caps text-ink-soft" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/shop" className="py-2 label-caps text-ink-soft" onClick={() => setMenuOpen(false)}>
            The Shop
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="py-2 pl-4 text-sm text-ink-soft"
              onClick={() => setMenuOpen(false)}
            >
              {c.name}
            </Link>
          ))}
          <Link href="/shop?category=gift-sets" className="py-2 label-caps text-ink-soft" onClick={() => setMenuOpen(false)}>
            Gift Sets
          </Link>
          <Link href="/custom-perfume" className="py-2 label-caps text-ink-soft" onClick={() => setMenuOpen(false)}>
            Custom Perfume
          </Link>
          <Link href="/gift-cards" className="py-2 label-caps text-ink-soft" onClick={() => setMenuOpen(false)}>
            Gift Cards
          </Link>
          <Link href="/our-story" className="py-2 label-caps text-ink-soft" onClick={() => setMenuOpen(false)}>
            Our Story
          </Link>
          {!user && (
            <Link href="/login" className="py-2 label-caps text-ink-soft" onClick={() => setMenuOpen(false)}>
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
