import { apiFetch } from "./api";

// A logged-in customer's review of a product. It is stored unapproved and
// only appears on the product page once an admin approves it.
export async function submitProductReview(input: { productId: string; rating: number; reviewText: string }) {
  return apiFetch<{ message: string }>("/api/reviews", { method: "POST", body: JSON.stringify(input) });
}
