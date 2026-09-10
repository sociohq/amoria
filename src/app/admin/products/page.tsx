"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listProducts } from "@/lib/products";
import { Product } from "@/lib/types";
import { formatAed } from "@/lib/money";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProducts({ limit: 100 })
      .then(({ products }) => setProducts(products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink">Products</h1>
        <Link href="/admin/products/new" className="bg-emerald px-5 py-2 label-caps text-cream hover:opacity-90">
          + New Product
        </Link>
      </div>

      {loading ? (
        <p className="text-ink-soft">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-ink-soft">No products yet.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-ink-soft">
              <th className="py-2">Name</th>
              <th className="py-2">Status</th>
              <th className="py-2">Price</th>
              <th className="py-2">Variants</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="py-2 text-ink">{p.name}</td>
                <td className="py-2 text-ink-soft">{p.status}</td>
                <td className="py-2 text-ink-soft">{formatAed(p.price)}</td>
                <td className="py-2 text-ink-soft">{p.variants.length}</td>
                <td className="py-2 text-right">
                  <Link href={`/admin/products/${p.slug}`} className="text-emerald hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
