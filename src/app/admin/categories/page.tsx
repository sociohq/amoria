"use client";

import { useEffect, useState } from "react";
import { listCategories } from "@/lib/products";
import { createCategory, deleteCategory } from "@/lib/admin";
import { Category } from "@/lib/types";
import { ApiError } from "@/lib/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function refresh() {
    listCategories().then(setCategories).catch(() => setError("Could not load categories"));
  }

  useEffect(refresh, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createCategory({ name });
      setName("");
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Products in it are unaffected but lose this tag.")) return;
    try {
      await deleteCategory(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete category");
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-ink">Categories</h1>

      <form onSubmit={handleCreate} className="mb-8 flex max-w-md gap-2">
        <input
          required
          placeholder="Category name (e.g. Men)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-emerald"
        />
        <button disabled={submitting} className="bg-ink px-5 py-2 label-caps text-cream hover:opacity-90 disabled:opacity-50">
          Add
        </button>
      </form>
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <table className="w-full max-w-2xl border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-ink-soft">
            <th className="py-2">Name</th>
            <th className="py-2">Slug</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-b border-border">
              <td className="py-2 text-ink">{c.name}</td>
              <td className="py-2 text-ink-soft">{c.slug}</td>
              <td className="py-2 text-right">
                <button onClick={() => handleDelete(c.id)} className="text-crimson hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
