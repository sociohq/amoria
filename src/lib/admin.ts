import { apiFetch, apiUpload } from "./api";
import { Category, Product, ProductType, Coupon, Settings, DashboardSummary, AdminOrder } from "./types";

// ---------- Dashboard ----------
export const getDashboard = () => apiFetch<DashboardSummary>("/api/admin/dashboard");

// ---------- Categories ----------
export const createCategory = (data: { name: string; slug?: string; image?: string }) =>
  apiFetch<{ category: Category }>("/api/categories", { method: "POST", body: JSON.stringify(data) });

export const updateCategory = (id: string, data: { name?: string; slug?: string; image?: string }) =>
  apiFetch<{ category: Category }>(`/api/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteCategory = (id: string) => apiFetch<void>(`/api/categories/${id}`, { method: "DELETE" });

export const uploadCategoryImage = (id: string, file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  return apiUpload<{ category: Category }>(`/api/categories/${id}/image`, formData);
};

// ---------- Products ----------
export interface ProductInput {
  productType: ProductType;
  name: string;
  slug?: string;
  shortDescription: string;
  description: string;
  concentrationType?: string;
  scentAccords: string[];
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  perfumerNote?: string;
  fragranceFamily?: string;
  season?: string;
  scentSillage?: string;
  scentLongevity?: string;
  designHouse?: string;
  yearIntroduced?: number;
  attributes?: Record<string, unknown>;
  price: number;
  compareAtPrice?: number;
  status: "ACTIVE" | "DRAFT";
  categoryIds: string[];
  variants: Array<{ size: string; price: number; stock: number; sku: string }>;
}

export const createProduct = (data: ProductInput) =>
  apiFetch<{ product: Product }>("/api/products", { method: "POST", body: JSON.stringify(data) });

export const updateProduct = (id: string, data: Partial<ProductInput>) =>
  apiFetch<{ product: Product }>(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteProduct = (id: string) => apiFetch<void>(`/api/products/${id}`, { method: "DELETE" });

export const addVariant = (productId: string, data: { size: string; price: number; stock: number; sku: string }) =>
  apiFetch(`/api/products/${productId}/variants`, { method: "POST", body: JSON.stringify(data) });

export const updateVariant = (
  productId: string,
  variantId: string,
  data: Partial<{ size: string; price: number; stock: number; sku: string }>
) => apiFetch(`/api/products/${productId}/variants/${variantId}`, { method: "PATCH", body: JSON.stringify(data) });

export const removeVariant = (productId: string, variantId: string) =>
  apiFetch(`/api/products/${productId}/variants/${variantId}`, { method: "DELETE" });

export const uploadProductImages = (productId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("images", f));
  return apiUpload<{ images: unknown[] }>(`/api/products/${productId}/images`, formData);
};

export const removeProductImage = (productId: string, imageId: string) =>
  apiFetch(`/api/products/${productId}/images/${imageId}`, { method: "DELETE" });

// ---------- Coupons ----------
export interface CouponInput {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderValue?: number;
  maxUsage?: number;
  usagePerUser?: number;
  expiresAt?: string;
  active?: boolean;
}

export const listCoupons = () => apiFetch<{ coupons: Coupon[] }>("/api/coupons");
export const createCoupon = (data: CouponInput) =>
  apiFetch<{ coupon: Coupon }>("/api/coupons", { method: "POST", body: JSON.stringify(data) });
export const updateCoupon = (id: string, data: Partial<CouponInput>) =>
  apiFetch<{ coupon: Coupon }>(`/api/coupons/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteCoupon = (id: string) => apiFetch<void>(`/api/coupons/${id}`, { method: "DELETE" });

// ---------- Orders ----------
export const listAdminOrders = (status?: string) =>
  apiFetch<{ orders: AdminOrder[] }>(`/api/admin/orders${status ? `?status=${status}` : ""}`);

export const updateOrderStatus = (id: string, status: string) =>
  apiFetch<{ order: AdminOrder }>(`/api/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// ---------- Settings ----------
export const getSettings = () => apiFetch<{ settings: Settings }>("/api/admin/settings");
export const updateSettings = (data: Partial<Settings>) =>
  apiFetch<{ settings: Settings }>("/api/admin/settings", { method: "PATCH", body: JSON.stringify(data) });
