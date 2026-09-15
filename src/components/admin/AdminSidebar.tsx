"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

// A real, minimal icon set for the sidebar — same thin-stroke language
// used across the storefront, just a size down (16px, was 18px) so a
// full 12-item nav fits one viewport with no internal scrollbar.
function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      {children}
    </svg>
  );
}
const DashboardIcon = () => <Icon><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></Icon>;
const ProductsIcon = () => <Icon><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></Icon>;
const CategoriesIcon = () => <Icon><path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></Icon>;
const CouponsIcon = () => <Icon><path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" /><path d="M9 8v8" strokeDasharray="2 2" /></Icon>;
const ReelsIcon = () => <Icon><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m10 9 5 3-5 3V9Z" /></Icon>;
const LookIcon = () => <Icon><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-4 4-3-3-6 6" /></Icon>;
const GenderIcon = () => <Icon><circle cx="9" cy="15" r="5" /><path d="M13.5 10.5 19 5" /><path d="M14 5h5v5" /></Icon>;
const ReviewsIcon = () => <Icon><path d="m12 3 2.6 5.6 6.1.6-4.5 4.2 1.3 6-5.5-3.1L6.5 19.4l1.3-6-4.5-4.2 6.1-.6L12 3Z" /></Icon>;
const BlogIcon = () => <Icon><path d="M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" /><path d="M14 3v5h5" /><path d="M8 13h8M8 17h5" /></Icon>;
const OrdersIcon = () => <Icon><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></Icon>;
const ContactIcon = () => <Icon><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Icon>;
const SettingsIcon = () => <Icon><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z" /></Icon>;
const StoreIcon = () => <Icon><path d="M3 9V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v4" /><path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" /><path d="M5 9v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9" /></Icon>;
const SignOutIcon = () => <Icon><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></Icon>;

interface NavItem {
  href: string;
  label: string;
  icon: () => React.JSX.Element;
}

const SECTIONS: { label: string; items: NavItem[] }[] = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: DashboardIcon }] },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: ProductsIcon },
      { href: "/admin/categories", label: "Categories", icon: CategoriesIcon },
      { href: "/admin/coupons", label: "Coupons", icon: CouponsIcon },
    ],
  },
  {
    label: "Homepage Content",
    items: [
      { href: "/admin/reels", label: "Reels", icon: ReelsIcon },
      { href: "/admin/shop-the-look", label: "Shop The Look", icon: LookIcon },
      { href: "/admin/gender-showcase", label: "For Him / For Her", icon: GenderIcon },
      { href: "/admin/reviews", label: "Reviews", icon: ReviewsIcon },
      { href: "/admin/posts", label: "Blog", icon: BlogIcon },
    ],
  },
  {
    label: "Store",
    items: [
      { href: "/admin/orders", label: "Orders", icon: OrdersIcon },
      { href: "/admin/contact", label: "Contact", icon: ContactIcon },
      { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

// Flat lookup used by AdminTopbar to turn the current path into a page
// title without every admin page having to declare one itself.
export const ADMIN_NAV_ITEMS = SECTIONS.flatMap((s) => s.items);

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    // h-screen + no overflow anywhere in this tree by design: every
    // section below is sized to fit one viewport (12 nav items across 4
    // groups) rather than scrolling internally, per the compact-sidebar
    // brief — text stays at a legible 13px floor while padding/gaps do
    // the actual space-saving.
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-ink text-cream">
      <div className="flex items-center gap-2 border-b border-cream/10 px-5 py-4">
        <span className="font-serif text-lg text-cream">Amoria</span>
        <span className="rounded-full border border-gold/40 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-widest text-gold">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-4 px-2.5 py-4">
        {SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="mb-1 px-2.5 text-[10px] font-medium uppercase tracking-widest text-cream/35">
              {section.label}
            </p>
            <div className="space-y-px">
              {section.items.map((item) => {
                const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] leading-tight transition-colors ${
                      active ? "bg-cream/10 text-cream" : "text-cream/60 hover:bg-cream/5 hover:text-cream"
                    }`}
                  >
                    <span className={active ? "text-gold" : ""}>
                      <ItemIcon />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-cream/10 p-2.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] text-cream/60 transition-colors hover:bg-cream/5 hover:text-cream"
        >
          <StoreIcon />
          View Store
        </Link>
        {user && (
          <div className="mt-1 flex items-center gap-2.5 rounded-md px-2.5 py-1.5">
            <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-gold/20 text-[10px] font-medium text-gold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <p className="min-w-0 flex-1 truncate text-xs font-medium text-cream" title={user.email}>
              {user.name}
            </p>
            <button
              onClick={() => logout()}
              title="Sign out"
              aria-label="Sign out"
              className="shrink-0 text-cream/45 transition-colors hover:text-cream"
            >
              <SignOutIcon />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
