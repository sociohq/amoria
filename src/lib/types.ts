export type ConcentrationType = "EAU_DE_TOILETTE" | "EAU_DE_PARFUM" | "EXTRAIT_DE_PARFUM" | "PARFUM";
export type ProductType = "PERFUME" | "HOME_FRAGRANCE" | "ACCESSORY" | "HAIR_CARE";

export interface HeroSlide {
  id: string;
  image: string | null;
  heading: string;
  subtext: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  position: number;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  menuGroup: string | null;
  position: number;
  featuredInMenu: boolean;
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

export interface InfoSection {
  heading: string;
  content: string;
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
  // The single listing/card thumbnail — separate from `images` (the
  // detail-page gallery) so a specific shot can represent the product in
  // grids without also having to be the gallery's first entry. Null on
  // a product that predates this field; the storefront falls back to
  // images[0] in that case.
  thumbnailImage: string | null;
  // Admin-editable accordion sections on the product page (heading +
  // body, e.g. "Sizes and Refills"). Null/empty falls back to generated
  // defaults — see productInfoSections() in lib/format.ts.
  infoSections: InfoSection[] | null;
  price: number; // AED
  compareAtPrice: number | null; // AED
  avgRating: number;
  reviewCount: number;
  status: "ACTIVE" | "DRAFT";
  categories: Category[];
  images: ProductImage[];
  variants: ProductVariant[];
  // Only present on the single-product fetch (getProductBySlug) — list
  // views (shop page, homepage) don't include the full review list, only
  // the avgRating/reviewCount summary above.
  reviews?: Review[];
}

export interface Review {
  id: string;
  customerName: string;
  location: string | null; // e.g. "Dubai" — shown as "Name, Location" when set
  rating: number; // 1-5
  reviewText: string;
  customerImage: string | null;
  productId: string | null;
  featured: boolean;
  createdAt: string;
  // Only present on the admin list (joined for display there).
  product?: { name: string; slug: string } | null;
}

export interface Reel {
  id: string;
  videoUrl: string;
  productId: string;
  position: number;
  active: boolean;
  product: Product;
}

export interface ShopTheLookHotspot {
  id: string;
  sectionId: string;
  productId: string;
  x: number; // percent, 0-100, from the image's left edge
  y: number; // percent, 0-100, from the image's top edge
  position: number;
  product: Product;
}

export interface ShopTheLookSection {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  active: boolean;
  hotspots: ShopTheLookHotspot[];
}

export interface GenderShowcaseItem {
  id: string;
  sectionId: string;
  productId: string;
  side: "him" | "her";
  position: number;
  product: Product;
}

export interface GenderShowcaseSection {
  id: string;
  active: boolean;
  intro: string | null;
  himEyebrow: string;
  himHeading: string;
  himSubheading: string | null;
  himImage: string | null;
  herEyebrow: string;
  herHeading: string;
  herSubheading: string | null;
  herImage: string | null;
  // Public fetch (storefront): flattened, active-only product lists.
  him: Product[];
  her: Product[];
  // Admin fetch only: the raw per-side assignments (own id, so a specific
  // row can be removed/reordered — a product can legitimately be
  // assigned to both sides).
  items?: GenderShowcaseItem[];
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

export type BlogBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string; caption?: string; aspect: "landscape" | "portrait" | "square" }
  | { type: "video"; url: string; caption?: string }
  | { type: "product"; productId: string; product: Product | null }
  | { type: "quote"; text: string; attribution?: string };

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  heroImage: string;
  heroEyebrow: string | null;
  content: BlogBlock[];
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  createdAt: string;
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
  newsletterPopupEnabled: boolean;
  newsletterPopupDelaySeconds: number;
  newsletterPopupEyebrow: string;
  newsletterPopupHeadline: string;
  newsletterPopupSubtext: string;
  newsletterPopupButtonText: string;
  newsletterPopupImage: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  twitterUrl: string | null;
  threadsUrl: string | null;
  youtubeUrl: string | null;
  pinterestUrl: string | null;
  snapchatUrl: string | null;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  createdAt: string;
}

export interface Order {
  id: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  guestEmail: string | null;
  // True when this order was placed as a guest and the account created
  // for it hasn't confirmed its email yet — the success page shows the
  // OTP form while this is true.
  needsGuestVerification: boolean;
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
  // Null only in the brief window between a guest's payment succeeding
  // and the webhook provisioning their account.
  user: { id: string; email: string; name: string } | null;
}
