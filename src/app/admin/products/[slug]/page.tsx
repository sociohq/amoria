"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { updateProduct, deleteProduct } from "@/lib/admin";
import { Product } from "@/lib/types";
import { ProductForm, ProductFormSubmitValue } from "@/components/admin/ProductForm";
import { ImageManager } from "@/components/admin/ImageManager";
import { VariantManager } from "@/components/admin/VariantManager";

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  const refresh = useCallback(() => {
    getProductBySlug(slug).then(setProduct);
  }, [slug]);

  useEffect(refresh, [refresh]);

  async function handleSubmit(value: ProductFormSubmitValue) {
    if (!product) return;
    if (value.categoryIds.length === 0) {
      throw new Error("Assign at least one category");
    }
    // Variants aren't part of the update payload — VariantManager below
    // manages them individually against their own endpoints.
    const { variants, ...rest } = value;
    void variants;
    const { product: updated } = await updateProduct(product.id, rest);
    if (updated.slug !== slug) {
      router.push(`/admin/products/${updated.slug}`);
    } else {
      refresh();
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    await deleteProduct(product.id);
    router.push("/admin/products");
  }

  if (product === undefined) return <p className="text-ink-soft">Loading…</p>;
  if (product === null) return <p className="text-crimson">Product not found.</p>;

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink">Edit: {product.name}</h1>
        <button onClick={handleDelete} className="text-sm text-crimson hover:underline">
          Delete Product
        </button>
      </div>

      <ProductForm product={product} showVariants={false} onSubmit={handleSubmit} submitLabel="Save Changes" />

      <div>
        <h2 className="mb-4 font-serif text-xl text-ink">Images</h2>
        <ImageManager productId={product.id} images={product.images} onChange={refresh} />
      </div>

      <div>
        <h2 className="mb-4 font-serif text-xl text-ink">Variants</h2>
        <VariantManager productId={product.id} variants={product.variants} onChange={refresh} />
      </div>
    </div>
  );
}
