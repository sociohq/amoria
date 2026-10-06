"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/types";
import { availableShopNav, shopHref } from "@/lib/nav";
import { useAuth } from "@/lib/auth-context";
import { useAuthDrawer } from "@/lib/auth-drawer-context";
import { useCart } from "@/lib/cart-context";
import { useIsClient } from "@/lib/useIsClient";

function SectionHeading({ children }: { children: React.ReactNode }) {
  // Each group gets a tinted band with a gold label so the headings stand
  // apart from the plain ink links listed beneath them.
  return (
    <p className="bg-cream px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-gold">{children}</p>
  );
}

function RowLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between px-5 py-3 text-[15px] text-ink transition-colors active:bg-cream-dark"
    >
      {children}
      <Chevron />
    </Link>
  );
}

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={`shrink-0 text-ink-soft transition-transform ${open ? "rotate-90" : ""}`}
    >
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The phone navigation drawer: a search box, then the shop categories
// (parents expand to show their sub-categories), then separate groups for
// site pages, orders/help and the account — each under its own heading.
// Portalled to <body> so it covers everything, including the floating
// buttons that would otherwise sit above a drawer rendered inside the
// header's own stacking context.
export function MobileMenu({ open, onClose, categories }: { open: boolean; onClose: () => void; categories: Category[] }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { openDrawer: openAuthDrawer } = useAuthDrawer();
  const { openDrawer: openCart, itemCount } = useCart();
  const mounted = useIsClient();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!mounted) return null;

  const nav = availableShopNav(categories);

  function search(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onClose();
    setQuery("");
    router.push(`/shop?search=${encodeURIComponent(q)}`);
  }

  return createPortal(
    <div className={`fixed inset-0 z-[65] md:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <button
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 bg-black/55 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-lenis-prevent
        className={`absolute inset-y-0 left-0 flex w-[88%] max-w-[360px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link href="/" onClick={onClose}>
            <Image src="/logo.png" alt="Amoria" width={130} height={36} className="h-7 w-auto" />
          </Link>
          <button onClick={onClose} aria-label="Close menu" className="text-ink-soft hover:text-ink">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain pb-8">
          <form onSubmit={search} className="px-5 py-4">
            <div className="flex items-center gap-2 border border-border bg-cream px-3 py-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="shrink-0 text-ink-soft">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search perfumes…"
                enterKeyHint="search"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-soft/60"
              />
            </div>
          </form>

          <SectionHeading>Shop</SectionHeading>
          <RowLink href="/shop" onClick={onClose}>
            All Fragrances
          </RowLink>
          {nav.map((node) => {
            const isOpen = expanded === node.slug;
            if (!node.children) {
              return (
                <RowLink key={node.slug} href={shopHref(node.slug)} onClick={onClose}>
                  {node.label}
                </RowLink>
              );
            }
            return (
              <div key={node.slug}>
                <div className="flex items-stretch">
                  <Link
                    href={shopHref(node.slug)}
                    onClick={onClose}
                    className="flex-1 px-5 py-3 text-[15px] text-ink transition-colors active:bg-cream-dark"
                  >
                    {node.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? "Collapse" : "Expand"} ${node.label}`}
                    onClick={() => setExpanded(isOpen ? null : node.slug)}
                    className="px-5"
                  >
                    <Chevron open={isOpen} />
                  </button>
                </div>
                {isOpen && (
                  <div className="mb-1 ml-5 border-l border-border bg-white">
                    {node.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={shopHref(child.slug)}
                        onClick={onClose}
                        className="block py-2.5 pl-4 pr-5 text-sm text-ink-soft transition-colors active:bg-cream-dark"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-2">
            <SectionHeading>Explore</SectionHeading>
            <RowLink href="/custom-perfume" onClick={onClose}>
              Custom Perfume
            </RowLink>
            <RowLink href="/blog" onClick={onClose}>
              Journal
            </RowLink>
            <RowLink href="/our-story" onClick={onClose}>
              About Us
            </RowLink>
            <RowLink href="/stores" onClick={onClose}>
              Our Boutique
            </RowLink>
            <RowLink href="/contact" onClick={onClose}>
              Contact Us
            </RowLink>
          </div>

          <div className="mt-2">
            <SectionHeading>Orders &amp; Help</SectionHeading>
            <RowLink href="/track" onClick={onClose}>
              Track Order
            </RowLink>
            <RowLink href="/shipping" onClick={onClose}>
              Shipping &amp; Delivery
            </RowLink>
            <RowLink href="/returns" onClick={onClose}>
              Returns &amp; Refunds
            </RowLink>
            <RowLink href="/faq" onClick={onClose}>
              FAQs
            </RowLink>
          </div>

          <div className="mt-2">
            <SectionHeading>Account</SectionHeading>
            <RowLink href="/wishlist" onClick={onClose}>
              Wishlist
            </RowLink>
            <button
              type="button"
              onClick={() => {
                onClose();
                openCart();
              }}
              className="flex w-full items-center justify-between px-5 py-3 text-left text-[15px] text-ink active:bg-cream-dark"
            >
              <span>
                Cart{itemCount > 0 && <span className="ml-2 rounded-full bg-crimson px-1.5 py-0.5 text-[10px] text-cream">{itemCount}</span>}
              </span>
              <Chevron />
            </button>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="flex w-full items-center justify-between px-5 py-3 text-left text-[15px] text-ink active:bg-cream-dark"
              >
                <span>
                  Sign out <span className="text-ink-soft">({user.name})</span>
                </span>
                <Chevron />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuthDrawer("login");
                }}
                className="flex w-full items-center justify-between px-5 py-3 text-left text-[15px] text-ink active:bg-cream-dark"
              >
                Login / Register
                <Chevron />
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
}
