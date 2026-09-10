import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream-dark">
      <div className="px-6 py-12 text-sm text-ink-soft">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Image src="/logo.png" alt="Amoria" width={160} height={44} className="h-10 w-auto" />
            <p className="mt-3 max-w-xs">Fragrances for men, women, and unisex — crafted for the moments that matter.</p>
          </div>
          <div>
            <p className="label-caps mb-3 text-ink">Shop</p>
            <ul className="space-y-2">
              <li><a href="/shop?category=men" className="hover:text-emerald">Men</a></li>
              <li><a href="/shop?category=women" className="hover:text-emerald">Women</a></li>
              <li><a href="/shop?category=unisex" className="hover:text-emerald">Unisex</a></li>
            </ul>
          </div>
          <div>
            <p className="label-caps mb-3 text-ink">Support</p>
            <ul className="space-y-2">
              <li>100% Authentic, Original &amp; Verified Products</li>
              <li>Free shipping on orders above AED 99</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-border pt-6 text-xs">© {new Date().getFullYear()} Amoria. All rights reserved.</p>
      </div>
    </footer>
  );
}
