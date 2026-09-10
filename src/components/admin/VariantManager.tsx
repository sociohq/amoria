"use client";

import { useState } from "react";
import { ProductVariant } from "@/lib/types";
import { addVariant, updateVariant, removeVariant } from "@/lib/admin";

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
  const inputClass = "w-full border border-border bg-cream px-2 py-1.5 text-sm outline-none focus:border-emerald";

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
    <div>
      <table className="w-full max-w-2xl border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-ink-soft">
            <th className="py-2">Size</th>
            <th className="py-2">Price (AED)</th>
            <th className="py-2">Stock</th>
            <th className="py-2">SKU</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {variants.map((v) => (
            <tr key={v.id} className="border-b border-border">
              <td className="py-2 text-ink">{v.size}</td>
              <td className="py-2">
                <input
                  type="number"
                  defaultValue={v.price}
                  onBlur={(e) => handleUpdateField(v, "price", Number(e.target.value))}
                  className={inputClass}
                />
              </td>
              <td className="py-2">
                <input
                  type="number"
                  defaultValue={v.stock}
                  onBlur={(e) => handleUpdateField(v, "stock", Number(e.target.value))}
                  className={inputClass}
                />
              </td>
              <td className="py-2 text-ink-soft">{v.sku}</td>
              <td className="py-2 text-right">
                <button onClick={() => handleRemove(v.id)} className="text-crimson hover:underline">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 grid max-w-2xl grid-cols-5 gap-2">
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
        <button onClick={handleAdd} className="border border-ink px-3 py-1.5 text-sm text-ink hover:bg-ink hover:text-cream">
          Add
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-crimson">{error}</p>}
    </div>
  );
}
