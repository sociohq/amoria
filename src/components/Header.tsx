"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { Category } from "@/lib/types";

export function Header({ categories }: { categories: Category[] }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="shrink-0">
          <Image src="/logo.png" alt="Amoria" width={144} height={40} className="h-9 w-auto" priority />
        </Link>

        <nav className="hidden gap-8 md:flex">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="label-caps text-ink-soft transition-colors hover:text-emerald"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/shop" className="label-caps text-ink-soft transition-colors hover:text-emerald">
            All
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          {user ? (
            <button onClick={() => logout()} className="label-caps hidden text-ink-soft hover:text-emerald sm:block">
              Sign out
            </button>
          ) : (
            <Link href="/login" className="label-caps hidden text-ink-soft hover:text-emerald sm:block">
              Sign in
            </Link>
          )}

          <Link href="/cart" className="relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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

          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-border px-6 py-4 md:hidden">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="py-2 label-caps text-ink-soft"
              onClick={() => setMenuOpen(false)}
            >
              {c.name}
            </Link>
          ))}
          <Link href="/shop" className="py-2 label-caps text-ink-soft" onClick={() => setMenuOpen(false)}>
            All
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
