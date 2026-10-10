import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cardDisplayName } from "@/lib/fragrance";
import { getProductBySlug, getRecommendedProducts } from "@/lib/products";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductSection } from "@/components/ProductSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ReviewForm } from "@/components/ReviewForm";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// The page and its metadata both need the product; fetch it once per request.
const loadProduct = cache(getProductBySlug);

const clip = (text: string, max = 155) => (text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text);

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug).catch(() => null);
  if (!product) return { title: "Product not found", robots: { index: false } };
  const image = product.thumbnailImage ?? product.images[0]?.url;
  // The short line is often generic ("inspired by a global favorite"), so add what a
  // search result should say: which product, from what price, delivered where.
  const from = Math.min(product.price, ...product.variants.map((v) => v.price));
  const description = clip(`${product.shortDescription || ""} ${product.name} from AED ${from}, delivered across the UAE by Amoria Perfume.`.trim());
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { type: "website", title: product.name, description, ...(image ? { images: [{ url: image, alt: product.name }] } : {}) },
    twitter: { card: "summary_large_image", title: product.name, description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const recommendedPromise = getRecommendedProducts(slug).catch(() => []);
  const product = await loadProduct(slug);

  if (!product) notFound();

  const recommended = await recommendedPromise;

  return (
    <div>
      <ProductDetail product={product} />
      <ReviewsSection eyebrow="Customer Reviews" title="What They're Saying" reviews={product.reviews ?? []} />
      <ReviewForm productId={product.id} productName={cardDisplayName(product.name)} />
      <ProductSection eyebrow="You May Also Like" title="Recommended For You" products={recommended} />
    </div>
  );
}
