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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const recommendedPromise = getRecommendedProducts(slug).catch(() => []);
  const product = await getProductBySlug(slug);

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
