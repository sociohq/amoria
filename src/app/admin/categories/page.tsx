"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { listCategories } from "@/lib/products";
import { createCategory, deleteCategory, updateCategory, uploadCategoryImage } from "@/lib/admin";
import { Category } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { PageHeader, Card, Button, Table, TableHead, inputClass } from "@/components/admin/ui";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  // Local, editable copies of menuGroup/position so typing doesn't fight
  // the table re-rendering from the last save — synced from `categories`
  // whenever it's (re)loaded.
  const [drafts, setDrafts] = useState<Record<string, { menuGroup: string; position: string }>>({});

  function refresh() {
    listCategories()
      .then((cats) => {
        setCategories(cats);
        setDrafts(
          Object.fromEntries(
            cats.map((c) => [c.id, { menuGroup: c.menuGroup ?? "", position: String(c.position) }])
          )
        );
      })
      .catch(() => setError("Could not load categories"));
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

  async function handleImageChange(id: string, file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploadingId(id);
    try {
      await uploadCategoryImage(id, file);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload image");
    } finally {
      setUploadingId(null);
    }
  }

  async function saveMenuGroup(id: string) {
    const value = drafts[id]?.menuGroup.trim() ?? "";
    try {
      await updateCategory(id, { menuGroup: value || null });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update menu group");
    }
  }

  async function savePosition(id: string) {
    const value = Number(drafts[id]?.position ?? 0);
    try {
      await updateCategory(id, { position: Number.isFinite(value) ? value : 0 });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update position");
    }
  }

  async function toggleFeatured(id: string, featuredInMenu: boolean) {
    try {
      await updateCategory(id, { featuredInMenu });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update featured category");
    }
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description={
          <>
            A category with an image appears as a card in the homepage &quot;Browse Our Category&quot; showcase.{" "}
            <strong className="text-ink">Menu Group</strong> is the column heading this category appears under in
            the header&apos;s &quot;The Shop&quot; dropdown (e.g. &quot;Shop By Gender&quot;); leave blank to keep it
            out of the dropdown entirely. <strong className="text-ink">Position</strong> orders categories within
            their group, lowest first. <strong className="text-ink">Featured</strong> puts one category&apos;s image
            up as the dropdown&apos;s promo tile — it needs an image set first.
          </>
        }
      />

      <form onSubmit={handleCreate} className="mb-6 flex max-w-md gap-2">
        <input
          required
          placeholder="Category name (e.g. Men)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
        <Button type="submit" disabled={submitting}>
          Add
        </Button>
      </form>
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <Card>
        <Table>
          <TableHead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Menu Group</th>
              <th>Position</th>
              <th>Featured</th>
              <th />
            </tr>
          </TableHead>
          <tbody className="divide-y divide-border">
            {categories.map((c) => (
              <tr key={c.id}>
                <td>
                  <label className="group relative block h-12 w-12 cursor-pointer overflow-hidden rounded-md bg-cream-dark">
                    {c.image ? (
                      <Image src={c.image} alt={c.name} fill sizes="48px" className="object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-[10px] text-ink-soft">None</span>
                    )}
                    <span className="absolute inset-0 hidden items-center justify-center bg-black/40 text-[10px] text-cream group-hover:flex">
                      {uploadingId === c.id ? "…" : "Change"}
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => handleImageChange(c.id, e.target.files?.[0])}
                    />
                  </label>
                </td>
                <td className="text-ink">{c.name}</td>
                <td className="text-ink-soft">{c.slug}</td>
                <td>
                  <input
                    placeholder="e.g. Shop By Gender"
                    value={drafts[c.id]?.menuGroup ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [c.id]: { ...d[c.id], menuGroup: e.target.value } }))}
                    onBlur={() => saveMenuGroup(c.id)}
                    className={`${inputClass} w-40 py-1.5 text-xs`}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={drafts[c.id]?.position ?? "0"}
                    onChange={(e) => setDrafts((d) => ({ ...d, [c.id]: { ...d[c.id], position: e.target.value } }))}
                    onBlur={() => savePosition(c.id)}
                    className={`${inputClass} w-16 py-1.5 text-xs`}
                  />
                </td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={c.featuredInMenu}
                    disabled={!c.image && !c.featuredInMenu}
                    title={!c.image ? "Add an image first" : undefined}
                    onChange={(e) => toggleFeatured(c.id, e.target.checked)}
                    style={{ accentColor: "var(--color-ink)" }}
                  />
                </td>
                <td className="text-right">
                  <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
