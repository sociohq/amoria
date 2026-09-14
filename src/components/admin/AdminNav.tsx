"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/reels", label: "Reels" },
  { href: "/admin/shop-the-look", label: "Shop The Look" },
  { href: "/admin/posts", label: "Blog" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 border-b border-border px-6 py-4">
      {LINKS.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`label-caps ${active ? "text-royal" : "text-ink-soft hover:text-royal"}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
