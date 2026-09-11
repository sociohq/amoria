import { apiFetch } from "./api";
import { WishlistItem } from "./types";

export const listWishlist = () => apiFetch<{ items: WishlistItem[] }>("/api/wishlist");
export const addToWishlist = (productId: string) =>
  apiFetch<{ item: WishlistItem }>("/api/wishlist", { method: "POST", body: JSON.stringify({ productId }) });
export const removeFromWishlist = (productId: string) =>
  apiFetch<void>(`/api/wishlist/${productId}`, { method: "DELETE" });
