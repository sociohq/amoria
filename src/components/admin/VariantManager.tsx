"use client";

import { useState } from "react";
import { ProductVariant } from "@/lib/types";
import { addVariant, updateVariant, removeVariant } from "@/lib/admin";
import { Card, Table, TableHead, Button, inputClass } from "@/components/admin/ui";

export function VariantManager({
  productId,
  variants,
  onChange,
}: {
  productId: string;
  variants: ProductVariant[];
  onChange: () => void;
}) {
  const [draft, setDraft] = useState({ size: "", price: 0, stock: 0, sku: "" });
  const [error, setError] = useState<string | null>(null);

  async function handleUpdateField(v: ProductVariant, field: "price" | "stock", value: number) {
    try {
      await updateVariant(productId, v.id, { [field]: value });
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeVariant(productId, id);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove variant");
    }
  }

  async function handleAdd() {
    if (!draft.size || !draft.sku) {
      setError("Size and SKU are required");
      return;
    }
    try {
      await addVariant(productId, draft);
      setDraft({ size: "", price: 0, stock: 0, sku: "" });
      setError(null);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add variant");
    }
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <Table>
          <TableHead>
            <tr>
              <th>Size</th>
              <th>Price (AED)</th>
              <th>Stock</th>
              <th>SKU</th>
              <th />
            </tr>
          </TableHead>
          <tbody className="divide-y divide-border">
            {variants.map((v) => (
              <tr key={v.id}>
                <td className="text-ink">{v.size}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={v.price}
                    onBlur={(e) => handleUpdateField(v, "price", Number(e.target.value))}
                    className={`${inputClass} py-1.5`}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    defaultValue={v.stock}
                    onBlur={(e) => handleUpdateField(v, "stock", Number(e.target.value))}
                    className={`${inputClass} py-1.5`}
                  />
                </td>
                <td className="text-ink-soft">{v.sku}</td>
                <td className="text-right">
                  <Button variant="danger" size="sm" onClick={() => handleRemove(v.id)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <div className="mt-4 grid grid-cols-5 gap-2">
        <input placeholder="Size" value={draft.size} onChange={(e) => setDraft({ ...draft, size: e.target.value })} className={inputClass} />
        <input
          placeholder="Price"
          type="number"
          value={draft.price}
          onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
          className={inputClass}
        />
        <input
          placeholder="Stock"
          type="number"
          value={draft.stock}
          onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })}
          className={inputClass}
        />
        <input placeholder="SKU" value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} className={inputClass} />
        <Button variant="secondary" onClick={handleAdd}>
          Add
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-crimson">{error}</p>}
    </div>
  );
}
