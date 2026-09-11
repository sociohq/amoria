export type ConcentrationType = "EAU_DE_TOILETTE" | "EAU_DE_PARFUM" | "EXTRAIT_DE_PARFUM" | "PARFUM";
export type ProductType = "PERFUME" | "HOME_FRAGRANCE" | "ACCESSORY" | "HAIR_CARE";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  position: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  price: number; // AED
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  productType: ProductType;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  concentrationType: ConcentrationType | null;
  scentAccords: string[];
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  perfumerNote: string | null;
  fragranceFamily: string | null;
  season: string | null;
  scentSillage: string | null;
  scentLongevity: string | null;
  designHouse: string | null;
  yearIntroduced: number | null;
  attributes: Record<string, unknown> | null;
  price: number; // AED
  compareAtPrice: number | null; // AED
  avgRating: number;
  reviewCount: number;
  status: "ACTIVE" | "DRAFT";
  categories: Category[];
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface CartItem {
  id: string;
  quantity: number;
  product: { id: string; name: string; slug: string; image: string | null };
  variant: { id: string; size: string; price: number; stock: number };
  lineTotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number; // percentage (0-100) or AED
  minOrderValue: number | null; // AED
  maxUsage: number | null;
  usagePerUser: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
}

export interface Settings {
  orderCutoffHour: number;
  minLeadDays: number;
  maxLeadDays: number;
  freeShippingThreshold: number; // AED
  standardShippingFee: number; // AED
}

export interface DashboardSummary {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeProducts: number;
  lowStockVariants: number;
}

export interface Order {
  id: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    variantSize: string;
    imageUrl: string | null;
    unitPrice: number;
    quantity: number;
  }>;
}

export interface AdminOrder extends Order {
  user: { id: string; email: string; name: string };
}
