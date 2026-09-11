"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./auth-context";
import { useAuthDrawer } from "./auth-drawer-context";
import { listWishlist, addToWishlist, removeFromWishlist } from "./wishlist";
import { WishlistItem } from "./types";

interface WishlistContextValue {
  items: WishlistItem[];
  loading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
  remove: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

// Unlike Cart, there's no guest/localStorage fallback here — saving is
// tied to an account, so toggling while logged out opens the sign-in
// drawer instead of silently doing nothing.
export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { openDrawer } = useAuthDrawer();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    if (!user) {
      setItems([]);
      return;
    }
    const { items } = await listWishlist();
    setItems(items);
  }

  useEffect(() => {
    if (authLoading) return;
    async function sync() {
      setLoading(true);
      await refresh();
      setLoading(false);
    }
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  function isWishlisted(productId: string) {
    return items.some((i) => i.productId === productId);
  }

  async function toggle(productId: string) {
    if (!user) {
      openDrawer("login");
      return;
    }
    if (isWishlisted(productId)) {
      await removeFromWishlist(productId);
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      const { item } = await addToWishlist(productId);
      setItems((prev) => [item, ...prev]);
    }
  }

  async function remove(productId: string) {
    await removeFromWishlist(productId);
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  return (
    <WishlistContext.Provider value={{ items, loading, isWishlisted, toggle, remove }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
