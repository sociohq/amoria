"use client";

import { useEffect, useState } from "react";
import { Category, Product, ProductType } from "@/lib/types";
import { listCategories } from "@/lib/products";
import { ProductInput } from "@/lib/admin";

const CONCENTRATIONS = ["EAU_DE_TOILETTE", "EAU_DE_PARFUM", "EXTRAIT_DE_PARFUM", "PARFUM"];
const PRODUCT_TYPES: { value: ProductType; label: string }[] = [
  { value: "PERFUME", label: "Perfume" },
  { value: "HOME_FRAGRANCE", label: "Home Fragrance (Bukhoor, Incense Sticks)" },
  { value: "ACCESSORY", label: "Accessory (Bukhoor Burners, etc.)" },
  { value: "HAIR_CARE", label: "Hair Care (Hair Mist)" },
];

// Perfume and Hair Care can carry a scent pyramid; Accessories generally
// don't. This only controls which fields the form shows — an admin can
// still fill them in for an edge case, nothing is enforced server-side.
const SCENT_CAPABLE_TYPES: ProductType[] = ["PERFUME", "HAIR_CARE"];

export interface ProductFormValue extends Omit<ProductInput, "variants" | "attributes"> {
  variants: Array<{ size: string; price: number; stock: number; sku: string }>;
  attributesText: string; // raw JSON textarea content; parsed on submit
}

// What onSubmit actually receives — the raw JSON textarea is parsed into a
// real object (or omitted) before handing off to the caller.
export type ProductFormSubmitValue = Omit<ProductFormValue, "attributesText"> & {
  attributes?: Record<string, unknown>;
};

function toFormValue(p?: Product): ProductFormValue {
  return {
    productType: p?.productType ?? "PERFUME",
    name: p?.name ?? "",
    shortDescription: p?.shortDescription ?? "",
    description: p?.description ?? "",
    concentrationType: p?.concentrationType ?? "EAU_DE_PARFUM",
    scentAccords: p?.scentAccords ?? [],
    topNotes: p?.topNotes ?? [],
    heartNotes: p?.heartNotes ?? [],
    baseNotes: p?.baseNotes ?? [],
    perfumerNote: p?.perfumerNote ?? "",
    fragranceFamily: p?.fragranceFamily ?? "",
    season: p?.season ?? "",
    scentSillage: p?.scentSillage ?? "",
    scentLongevity: p?.scentLongevity ?? "",
    designHouse: p?.designHouse ?? "Amoria Perfume",
    yearIntroduced: p?.yearIntroduced ?? undefined,
    attributesText: p?.attributes ? JSON.stringify(p.attributes, null, 2) : "",
    price: p?.price ?? 0,
    compareAtPrice: p?.compareAtPrice ?? undefined,
    status: p?.status ?? "DRAFT",
    categoryIds: p?.categories.map((c) => c.id) ?? [],
    variants: p ? [] : [{ size: "", price: 0, stock: 0, sku: "" }], // edit mode manages variants separately
  };
}

const listToText = (arr: string[]) => arr.join(", ");
const textToList = (text: string) =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export function ProductForm({
  product,
  showVariants = true,
  onSubmit,
  submitLabel,
}: {
  product?: Product;
  showVariants?: boolean;
  onSubmit: (value: ProductFormSubmitValue) => Promise<void>;
  submitLabel: string;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [value, setValue] = useState<ProductFormValue>(() => toFormValue(product));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  function set<K extends keyof ProductFormValue>(key: K, val: ProductFormValue[K]) {
    setValue((v) => ({ ...v, [key]: val }));
  }

  function toggleCategory(id: string) {
    set("categoryIds", value.categoryIds.includes(id) ? value.categoryIds.filter((c) => c !== id) : [...value.categoryIds, id]);
  }

  function updateVariantRow(i: number, patch: Partial<ProductFormValue["variants"][number]>) {
    set(
      "variants",
      value.variants.map((v, idx) => (idx === i ? { ...v, ...patch } : v))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let attributes: Record<string, unknown> | undefined;
    if (value.attributesText.trim()) {
      try {
        attributes = JSON.parse(value.attributesText);
      } catch {
        setError('Custom Attributes must be valid JSON, e.g. {"material": "Brass"}');
        return;
      }
    }

    setSubmitting(true);
    try {
      const { attributesText, ...rest } = value;
      void attributesText;
      await onSubmit({ ...rest, attributes });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-emerald";
  const scentCapable = SCENT_CAPABLE_TYPES.includes(value.productType);

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="label-caps mb-1 block text-ink-soft">Product Type</label>
        <select value={value.productType} onChange={(e) => set("productType", e.target.value as ProductType)} className={inputClass}>
          {PRODUCT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-caps mb-1 block text-ink-soft">Name</label>
        <input required value={value.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="label-caps mb-1 block text-ink-soft">Short Description</label>
        <input
          required
          value={value.shortDescription}
          onChange={(e) => set("shortDescription", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="label-caps mb-1 block text-ink-soft">Full Description</label>
        <textarea
          required
          rows={4}
          value={value.description}
          onChange={(e) => set("description", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Status</label>
          <select value={value.status} onChange={(e) => set("status", e.target.value as "ACTIVE" | "DRAFT")} className={inputClass}>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
          </select>
        </div>
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Price (AED)</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={value.price}
            onChange={(e) => set("price", Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="label-caps mb-1 block text-ink-soft">Compare-at Price (optional)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={value.compareAtPrice ?? ""}
          onChange={(e) => set("compareAtPrice", e.target.value ? Number(e.target.value) : undefined)}
          className={inputClass}
        />
      </div>

      {scentCapable && (
        <div className="space-y-5 border border-border bg-cream-dark/40 p-4">
          <p className="label-caps text-ink-soft">Scent Details</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-caps mb-1 block text-ink-soft">Concentration</label>
              <select
                value={value.concentrationType}
                onChange={(e) => set("concentrationType", e.target.value)}
                className={inputClass}
              >
                {CONCENTRATIONS.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-caps mb-1 block text-ink-soft">Fragrance Family</label>
              <input
                placeholder="Oriental Floral"
                value={value.fragranceFamily}
                onChange={(e) => set("fragranceFamily", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="label-caps mb-1 block text-ink-soft">Scent Accords (comma-separated)</label>
            <input
              placeholder="Rose, Oud, Amber"
              value={listToText(value.scentAccords)}
              onChange={(e) => set("scentAccords", textToList(e.target.value))}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label-caps mb-1 block text-ink-soft">Top Notes</label>
              <input value={listToText(value.topNotes)} onChange={(e) => set("topNotes", textToList(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className="label-caps mb-1 block text-ink-soft">Heart Notes</label>
              <input value={listToText(value.heartNotes)} onChange={(e) => set("heartNotes", textToList(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className="label-caps mb-1 block text-ink-soft">Base Notes</label>
              <input value={listToText(value.baseNotes)} onChange={(e) => set("baseNotes", textToList(e.target.value))} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="label-caps mb-1 block text-ink-soft">Perfumer&apos;s Note (optional)</label>
            <textarea
              rows={3}
              value={value.perfumerNote}
              onChange={(e) => set("perfumerNote", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-caps mb-1 block text-ink-soft">Season</label>
              <input placeholder="Any season" value={value.season} onChange={(e) => set("season", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="label-caps mb-1 block text-ink-soft">Sillage</label>
              <input
                placeholder="Moderate"
                value={value.scentSillage}
                onChange={(e) => set("scentSillage", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-caps mb-1 block text-ink-soft">Longevity</label>
              <input
                placeholder="12+ Hours"
                value={value.scentLongevity}
                onChange={(e) => set("scentLongevity", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="label-caps mb-1 block text-ink-soft">Year Introduced</label>
              <input
                type="number"
                value={value.yearIntroduced ?? ""}
                onChange={(e) => set("yearIntroduced", e.target.value ? Number(e.target.value) : undefined)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="label-caps mb-1 block text-ink-soft">Design House</label>
            <input value={value.designHouse} onChange={(e) => set("designHouse", e.target.value)} className={inputClass} />
          </div>
        </div>
      )}

      {!scentCapable && (
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Custom Attributes (optional JSON)</label>
          <textarea
            rows={3}
            placeholder='{"material": "Brass", "burnTimeMinutes": 45}'
            value={value.attributesText}
            onChange={(e) => set("attributesText", e.target.value)}
            className={`${inputClass} font-mono text-xs`}
          />
          <p className="mt-1 text-xs text-ink-soft">
            Anything specific to this product type that doesn&apos;t have its own field yet — e.g. material, dimensions, burn time.
          </p>
        </div>
      )}

      <div>
        <label className="label-caps mb-2 block text-ink-soft">Categories</label>
        <div className="flex flex-wrap gap-3">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={value.categoryIds.includes(c.id)} onChange={() => toggleCategory(c.id)} />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      {showVariants && (
        <div>
          <label className="label-caps mb-2 block text-ink-soft">Variants</label>
          <div className="space-y-2">
            {value.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-4 gap-2">
                <input placeholder="Size / Option" value={v.size} onChange={(e) => updateVariantRow(i, { size: e.target.value })} className={inputClass} />
                <input
                  placeholder="Price"
                  type="number"
                  value={v.price}
                  onChange={(e) => updateVariantRow(i, { price: Number(e.target.value) })}
                  className={inputClass}
                />
                <input
                  placeholder="Stock"
                  type="number"
                  value={v.stock}
                  onChange={(e) => updateVariantRow(i, { stock: Number(e.target.value) })}
                  className={inputClass}
                />
                <input placeholder="SKU" value={v.sku} onChange={(e) => updateVariantRow(i, { sku: e.target.value })} className={inputClass} />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => set("variants", [...value.variants, { size: "", price: 0, stock: 0, sku: "" }])}
            className="mt-2 text-sm text-emerald hover:underline"
          >
            + Add variant
          </button>
        </div>
      )}

      {error && <p className="text-sm text-crimson">{error}</p>}
      <button disabled={submitting} className="bg-emerald px-6 py-3 label-caps text-cream hover:opacity-90 disabled:opacity-50">
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
