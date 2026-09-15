"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listProducts } from "@/lib/products";
import { Product } from "@/lib/types";
import { formatAed } from "@/lib/money";
import { PageHeader, Card, Button, Table, TableHead, Badge } from "@/components/admin/ui";

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
      <PageHeader
        title="Products"
        action={
          <Link href="/admin/products/new">
            <Button>+ New Product</Button>
          </Link>
        }
      />

      <Card>
        <Table>
          <TableHead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Price</th>
              <th>Variants</th>
              <th />
            </tr>
          </TableHead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-ink-soft">
                  Loading…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-ink-soft">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium text-ink">{p.name}</td>
                  <td>
                    <Badge tone={p.status === "ACTIVE" ? "success" : "neutral"}>{p.status}</Badge>
                  </td>
                  <td className="text-ink-soft">{formatAed(p.price)}</td>
                  <td className="text-ink-soft">{p.variants.length}</td>
                  <td className="text-right">
                    <Link href={`/admin/products/${p.slug}`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
