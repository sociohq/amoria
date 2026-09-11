"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiFetch } from "./api";
import { useAuth } from "./auth-context";
import { Cart } from "./types";

const GUEST_CART_KEY = "amoria_guest_cart";

// A guest cart item carries a display snapshot (name/price/image) captured
// at add-to-cart time, since there's no logged-in server cart to enrich it
// from — the product page already has all of this in hand when adding.
interface GuestItem {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantSize: string;
  price: number;
  image: string | null;
  quantity: number;
}

interface DisplayItem {
  id: string; // cart item id (server) or variantId (guest)
  variantId: string;
  productName: string;
  productSlug: string;
  variantSize: string;
  price: number;
  quantity: number;
  image: string | null;
  lineTotal: number;
}

interface CartContextValue {
  items: DisplayItem[];
  itemCount: number;
  subtotal: number;
  loading: boolean;
  isGuest: boolean;
  addItem: (input: Omit<GuestItem, "quantity"> & { quantity?: number }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
  // Slide-out cart drawer, opened automatically after adding an item and
  // from the header's cart icon — a full /cart page still exists
  // separately for direct navigation.
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readGuestCart(): GuestItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeGuestCart(items: GuestItem[]) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // ignore — localStorage unavailable (private browsing, etc.)
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [serverCart, setServerCart] = useState<Cart | null>(null);
  const [guestItems, setGuestItems] = useState<GuestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function refreshServerCart() {
    const { cart } = await apiFetch<{ cart: Cart }>("/api/cart");
    setServerCart(cart);
  }

  // Runs on login/logout transitions: logged-in users get their server
  // cart (merging in any leftover guest cart exactly once); logged-out
  // users fall back to whatever's in localStorage.
  useEffect(() => {
    if (authLoading) return;

    async function sync() {
      setLoading(true);
      if (user) {
        const guest = readGuestCart();
        if (guest.length > 0) {
          try {
            await apiFetch("/api/cart/merge", {
              method: "POST",
              body: JSON.stringify({
                items: guest.map(({ variantId, quantity }) => ({ variantId, quantity })),
              }),
            });
          } catch {
            // best effort — don't block login on a merge failure
          }
          writeGuestCart([]);
          setGuestItems([]);
        }
        try {
          await refreshServerCart();
        } catch {
          setServerCart(null);
        }
      } else {
        setServerCart(null);
        setGuestItems(readGuestCart());
      }
      setLoading(false);
    }

    sync();
  }, [user, authLoading]);

  async function addItem(input: Omit<GuestItem, "quantity"> & { quantity?: number }) {
    const quantity = input.quantity ?? 1;
    if (user) {
      await apiFetch("/api/cart/items", {
        method: "POST",
        body: JSON.stringify({ variantId: input.variantId, quantity }),
      });
      await refreshServerCart();
    } else {
      setGuestItems((prev) => {
        const existing = prev.find((i) => i.variantId === input.variantId);
        const next = existing
          ? prev.map((i) => (i.variantId === input.variantId ? { ...i, quantity: i.quantity + quantity } : i))
          : [...prev, { ...input, quantity }];
        writeGuestCart(next);
        return next;
      });
    }
    setDrawerOpen(true);
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (user) {
      await apiFetch(`/api/cart/items/${itemId}`, { method: "PATCH", body: JSON.stringify({ quantity }) });
      await refreshServerCart();
    } else {
      setGuestItems((prev) => {
        const next = prev.map((i) => (i.variantId === itemId ? { ...i, quantity } : i));
        writeGuestCart(next);
        return next;
      });
    }
  }

  async function removeItem(itemId: string) {
    if (user) {
      await apiFetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
      await refreshServerCart();
    } else {
      setGuestItems((prev) => {
        const next = prev.filter((i) => i.variantId !== itemId);
        writeGuestCart(next);
        return next;
      });
    }
  }

  const items: DisplayItem[] = user
    ? (serverCart?.items ?? []).map((i) => ({
        id: i.id,
        variantId: i.variant.id,
        productName: i.product.name,
        productSlug: i.product.slug,
        variantSize: i.variant.size,
        price: i.variant.price,
        quantity: i.quantity,
        image: i.product.image,
        lineTotal: i.lineTotal,
      }))
    : guestItems.map((i) => ({
        id: i.variantId,
        variantId: i.variantId,
        productName: i.productName,
        productSlug: i.productSlug,
        variantSize: i.variantSize,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        lineTotal: i.price * i.quantity,
      }));

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        loading,
        isGuest: !user,
        addItem,
        updateQuantity,
        removeItem,
        refresh: user ? refreshServerCart : async () => setGuestItems(readGuestCart()),
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
