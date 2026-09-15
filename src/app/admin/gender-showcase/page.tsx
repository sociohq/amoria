"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getGenderShowcaseAdmin,
  upsertGenderShowcaseSection,
  uploadGenderShowcaseImage,
  addGenderShowcaseItem,
  updateGenderShowcaseItem,
  deleteGenderShowcaseItem,
  GenderShowcaseSectionInput,
} from "@/lib/admin";
import { listProducts } from "@/lib/products";
import { GenderShowcaseSection, GenderShowcaseItem, Product } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { PageHeader, Card, Button, Table, TableHead, Badge, Label, FileInput, inputClass } from "@/components/admin/ui";

type Side = "him" | "her";

export default function AdminGenderShowcasePage() {
  const [section, setSection] = useState<GenderShowcaseSection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [active, setActive] = useState(true);
  const [intro, setIntro] = useState("");
  const [himEyebrow, setHimEyebrow] = useState("");
  const [himHeading, setHimHeading] = useState("");
  const [himSubheading, setHimSubheading] = useState("");
  const [herEyebrow, setHerEyebrow] = useState("");
  const [herHeading, setHerHeading] = useState("");
  const [herSubheading, setHerSubheading] = useState("");

  const [himFile, setHimFile] = useState<File | null>(null);
  const [herFile, setHerFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<Side | null>(null);

  const [pickHim, setPickHim] = useState("");
  const [pickHer, setPickHer] = useState("");
  const [adding, setAdding] = useState<Side | null>(null);

  function refresh() {
    getGenderShowcaseAdmin()
      .then(({ section }) => {
        setSection(section);
        if (section) {
          setActive(section.active);
          setIntro(section.intro ?? "");
          setHimEyebrow(section.himEyebrow);
          setHimHeading(section.himHeading);
          setHimSubheading(section.himSubheading ?? "");
          setHerEyebrow(section.herEyebrow);
          setHerHeading(section.herHeading);
          setHerSubheading(section.herSubheading ?? "");
        }
      })
      .catch(() => setError("Could not load the section"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
    listProducts({ limit: 100 })
      .then(({ products }) => {
        setProducts(products);
        setPickHim((id) => id || products[0]?.id || "");
        setPickHer((id) => id || products[0]?.id || "");
      })
      .catch(() => {});
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data: GenderShowcaseSectionInput = {
        active,
        intro: intro || undefined,
        himEyebrow,
        himHeading,
        himSubheading: himSubheading || undefined,
        herEyebrow,
        herHeading,
        herSubheading: herSubheading || undefined,
      };
      await upsertGenderShowcaseSection(data);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(side: Side) {
    const file = side === "him" ? himFile : herFile;
    if (!file) return;
    setUploading(side);
    setError(null);
    try {
      await uploadGenderShowcaseImage(side, file);
      (side === "him" ? setHimFile : setHerFile)(null);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function handleAddItem(side: Side) {
    const productId = side === "him" ? pickHim : pickHer;
    if (!productId) return;
    setAdding(side);
    setError(null);
    try {
      const position = (section?.items ?? []).filter((i) => i.side === side).length;
      await addGenderShowcaseItem({ productId, side, position });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add product");
    } finally {
      setAdding(null);
    }
  }

  async function handleRemoveItem(id: string) {
    try {
      await deleteGenderShowcaseItem(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not remove product");
    }
  }

  async function handleSavePosition(id: string, position: number) {
    try {
      await updateGenderShowcaseItem(id, { position });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update position");
    }
  }

  if (loading) {
    return <p className="text-sm text-ink-soft">Loading…</p>;
  }

  const items = section?.items ?? [];

  return (
    <div>
      <PageHeader
        title="For Him / For Her"
        description="The homepage-only tabbed banner. Each tab's background photo, copy, and products are all set here — assign exactly which products show on each side below, in whatever order you like."
      />
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <Card as="form" onSubmit={handleSave} className="mb-6 max-w-2xl space-y-6 p-5">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            style={{ accentColor: "var(--color-ink)" }}
          />
          Active (visible on the homepage)
        </label>

        <div>
          <Label>Intro Line (above the tabs)</Label>
          <input value={intro} onChange={(e) => setIntro(e.target.value)} className={inputClass} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gold">For Him</p>
            <div>
              <Label>Eyebrow</Label>
              <input value={himEyebrow} onChange={(e) => setHimEyebrow(e.target.value)} className={inputClass} />
            </div>
            <div>
              <Label>Heading</Label>
              <input value={himHeading} onChange={(e) => setHimHeading(e.target.value)} className={inputClass} />
            </div>
            <div>
              <Label>Subheading</Label>
              <input value={himSubheading} onChange={(e) => setHimSubheading(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gold">For Her</p>
            <div>
              <Label>Eyebrow</Label>
              <input value={herEyebrow} onChange={(e) => setHerEyebrow(e.target.value)} className={inputClass} />
            </div>
            <div>
              <Label>Heading</Label>
              <input value={herHeading} onChange={(e) => setHerHeading(e.target.value)} className={inputClass} />
            </div>
            <div>
              <Label>Subheading</Label>
              <input value={herSubheading} onChange={(e) => setHerSubheading(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </Card>

      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        {(["him", "her"] as const).map((side) => {
          const image = side === "him" ? section?.himImage : section?.herImage;
          const file = side === "him" ? himFile : herFile;
          const setFile = side === "him" ? setHimFile : setHerFile;
          return (
            <Card key={side} className="p-5">
              <p className="mb-3 text-sm font-medium text-ink">{side === "him" ? "For Him" : "For Her"} Background</p>
              {image && (
                <div className="relative mb-3 aspect-video overflow-hidden rounded-md bg-cream-dark">
                  <Image src={image} alt="" fill sizes="320px" className="object-cover" />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <FileInput
                  key={`${side}-${image ?? "none"}`}
                  accept="image/png,image/jpeg,image/webp"
                  onSelect={(files) => setFile(files?.[0] ?? null)}
                  className="flex-1"
                />
                <Button variant="primary" size="sm" onClick={() => handleUpload(side)} disabled={!file || uploading === side}>
                  {uploading === side ? "Uploading…" : image ? "Replace" : "Upload"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid max-w-4xl gap-6 sm:grid-cols-2">
        {(["him", "her"] as const).map((side) => {
          const sideItems = items.filter((i) => i.side === side).sort((a, b) => a.position - b.position);
          const pick = side === "him" ? pickHim : pickHer;
          const setPick = side === "him" ? setPickHim : setPickHer;
          return (
            <div key={side}>
              <p className="mb-2 text-sm font-medium text-ink">{side === "him" ? "For Him" : "For Her"} Products</p>
              <div className="mb-3 flex gap-2">
                <select value={pick} onChange={(e) => setPick(e.target.value)} className={`${inputClass} flex-1`}>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <Button variant="secondary" size="sm" onClick={() => handleAddItem(side)} disabled={!pick || adding === side}>
                  {adding === side ? "Adding…" : "Add"}
                </Button>
              </div>
              <Card>
                <Table>
                  <TableHead>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </TableHead>
                  <tbody className="divide-y divide-border">
                    {sideItems.map((item: GenderShowcaseItem) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="number"
                            defaultValue={item.position}
                            onBlur={(e) => handleSavePosition(item.id, Number(e.target.value))}
                            className={`${inputClass} w-14 py-1.5 text-xs`}
                          />
                        </td>
                        <td className="text-ink">{item.product.name}</td>
                        <td>
                          <Badge tone={item.product.status === "ACTIVE" ? "success" : "neutral"}>
                            {item.product.status}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <Button variant="danger" size="sm" onClick={() => handleRemoveItem(item.id)}>
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {sideItems.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-ink-soft">
                          No products assigned yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card>
            </div>
          );
        })}
      </div>

      {(items.filter((i) => i.side === "him" && i.product.status === "ACTIVE").length === 0 ||
        items.filter((i) => i.side === "her" && i.product.status === "ACTIVE").length === 0) && (
        <p className="mt-6 max-w-2xl text-sm text-crimson">
          One or both sides have no assigned products that are Active — that tab will show an empty row on the
          homepage, and the whole section hides itself only if both sides are empty.
        </p>
      )}
    </div>
  );
}
