"use client";

import { useRouter } from "next/navigation";
import { ProductForm, ProductFormValue } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/admin";

export default function NewProductPage() {
  const router = useRouter();

  async function handleSubmit(value: ProductFormValue) {
    if (value.variants.length === 0 || value.variants.some((v) => !v.size || !v.sku)) {
      throw new Error("Add at least one complete size variant (size, price, stock, SKU)");
    }
    if (value.categoryIds.length === 0) {
      throw new Error("Assign at least one category");
    }
    const { product } = await createProduct(value);
    router.push(`/admin/products/${product.slug}`);
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-ink">New Product</h1>
      <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
    </div>
  );
}
