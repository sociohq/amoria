"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  getShopTheLookAdmin,
  upsertShopTheLookSection,
  uploadShopTheLookImage,
  createHotspot,
  updateHotspot,
  deleteHotspot,
} from "@/lib/admin";
import { listProducts } from "@/lib/products";
import { ShopTheLookSection, Product } from "@/lib/types";
import { ApiError } from "@/lib/api";

const inputClass = "border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-royal";

export default function AdminShopTheLookPage() {
  const [section, setSection] = useState<ShopTheLookSection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [active, setActive] = useState(true);
  const [savingMeta, setSavingMeta] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // A click on empty image area stages a hotspot here until a product is
  // picked and confirmed — nothing is created until "Add Hotspot".
  const [pending, setPending] = useState<{ x: number; y: number } | null>(null);
  const [pendingProductId, setPendingProductId] = useState("");
  const [addingHotspot, setAddingHotspot] = useState(false);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  const [dragId, setDragId] = useState<string | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const latestDragPos = useRef<{ x: number; y: number } | null>(null);
  const justDraggedRef = useRef(false);

  function refresh() {
    getShopTheLookAdmin()
      .then(({ section }) => {
        setSection(section);
        if (section) {
          setTitle(section.title);
          setSubtitle(section.subtitle ?? "");
          setActive(section.active);
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
        setPendingProductId((id) => id || products[0]?.id || "");
      })
      .catch(() => {});
  }, []);

  async function saveMeta(e: React.FormEvent) {
    e.preventDefault();
    setSavingMeta(true);
    setError(null);
    try {
      await upsertShopTheLookSection({ title, subtitle: subtitle || undefined, active });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save");
    } finally {
      setSavingMeta(false);
    }
  }

  async function handleUploadImage() {
    if (!imageFile) return;
    setUploadingImage(true);
    setError(null);
    try {
      await uploadShopTheLookImage(imageFile);
      setImageFile(null);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  }

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (justDraggedRef.current) {
      // The pointerup that ends a drag is immediately followed by a native
      // click on the same element — without this it'd also register as
      // "clicking empty space" and stage a second, unwanted hotspot.
      justDraggedRef.current = false;
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    setPending({ x, y });
    setSelectedHotspotId(null);
  }

  async function confirmAddHotspot() {
    if (!pending || !pendingProductId || !section) return;
    setAddingHotspot(true);
    setError(null);
    try {
      await createHotspot({
        productId: pendingProductId,
        x: pending.x,
        y: pending.y,
        position: section.hotspots.length,
      });
      setPending(null);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add hotspot");
    } finally {
      setAddingHotspot(false);
    }
  }

  async function handleReassign(hotspotId: string, productId: string) {
    try {
      await updateHotspot(hotspotId, { productId });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update hotspot");
    }
  }

  async function savePosition(hotspotId: string, position: number) {
    try {
      await updateHotspot(hotspotId, { position });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update position");
    }
  }

  async function handleDeleteHotspot(id: string) {
    if (!confirm("Remove this hotspot?")) return;
    try {
      await deleteHotspot(id);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete hotspot");
    }
  }

  function startDrag(hotspotId: string) {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      latestDragPos.current = null;
      setSelectedHotspotId(hotspotId);
      setDragId(hotspotId);
    };
  }

  // Dragging an existing dot to reposition it — same pointer-events
  // pattern as PriceRangeSlider: live local state while dragging, one
  // committed PATCH on release.
  useEffect(() => {
    if (!dragId) return;

    function move(e: PointerEvent) {
      const box = imageRef.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
      latestDragPos.current = { x, y };
      setSection((s) => (s ? { ...s, hotspots: s.hotspots.map((h) => (h.id === dragId ? { ...h, x, y } : h)) } : s));
    }
    function up() {
      const pos = latestDragPos.current;
      const id = dragId;
      setDragId(null);
      if (pos && id) {
        justDraggedRef.current = true;
        updateHotspot(id, { x: Math.round(pos.x * 10) / 10, y: Math.round(pos.y * 10) / 10 }).catch(() =>
          setError("Could not save the new position")
        );
      }
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragId]);

  if (loading) {
    return <p className="text-ink-soft">Loading…</p>;
  }

  return (
    <div>
      <h1 className="mb-2 font-serif text-2xl text-ink">Shop The Look</h1>
      <p className="mb-6 max-w-2xl text-sm text-ink-soft">
        One lifestyle image on the homepage with clickable hotspot dots pinned to it, each tied to a real product.
        Click anywhere on the image to place a new hotspot, drag an existing dot to reposition it, or reassign /
        remove one from the list below.
      </p>
      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <div className="mb-8 border border-border p-5">
        <p className="label-caps mb-3 text-ink-soft">Banner Image</p>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <button
            onClick={handleUploadImage}
            disabled={!imageFile || uploadingImage}
            className="border border-ink px-4 py-2 label-caps text-ink hover:bg-ink hover:text-cream disabled:opacity-50"
          >
            {uploadingImage ? "Uploading…" : section?.image ? "Replace" : "Upload"}
          </button>
        </div>
      </div>

      {section && (
        <>
          <form onSubmit={saveMeta} className="mb-8 flex max-w-2xl flex-wrap items-end gap-3 border border-border p-5">
            <div className="flex-1" style={{ minWidth: 200 }}>
              <label className="label-caps mb-1 block text-ink-soft">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputClass} w-full`} />
            </div>
            <div className="flex-1" style={{ minWidth: 200 }}>
              <label className="label-caps mb-1 block text-ink-soft">Subtitle</label>
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={`${inputClass} w-full`} />
            </div>
            <label className="flex items-center gap-2 pb-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                style={{ accentColor: "var(--color-ink)" }}
              />
              Active
            </label>
            <button
              disabled={savingMeta}
              className="bg-ink px-5 py-2 label-caps text-cream hover:opacity-90 disabled:opacity-50"
            >
              Save
            </button>
          </form>

          {section.image && (
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div>
                <div
                  ref={imageRef}
                  onClick={handleImageClick}
                  className="relative aspect-[4/5] max-w-md cursor-crosshair select-none overflow-hidden bg-cream-dark sm:aspect-square"
                >
                  <Image src={section.image} alt="" fill sizes="400px" className="pointer-events-none object-cover" />
                  {section.hotspots.map((h, i) => (
                    <button
                      key={h.id}
                      type="button"
                      onPointerDown={startDrag(h.id)}
                      onClick={(e) => e.stopPropagation()}
                      title={h.product.name}
                      className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 text-[11px] font-medium text-cream shadow active:cursor-grabbing ${
                        selectedHotspotId === h.id ? "border-crimson bg-crimson" : "border-royal bg-royal"
                      }`}
                      style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  {pending && (
                    <span
                      className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-ink"
                      style={{ left: `${pending.x}%`, top: `${pending.y}%` }}
                    />
                  )}
                </div>

                {pending && (
                  <div className="mt-3 flex max-w-md flex-wrap items-center gap-2 border border-border bg-cream-dark/40 p-3">
                    <p className="text-xs text-ink-soft">
                      New hotspot at {pending.x}%, {pending.y}% —
                    </p>
                    <select
                      value={pendingProductId}
                      onChange={(e) => setPendingProductId(e.target.value)}
                      className={inputClass}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={confirmAddHotspot}
                      disabled={addingHotspot}
                      className="bg-ink px-4 py-2 label-caps text-cream hover:opacity-90 disabled:opacity-50"
                    >
                      Add Hotspot
                    </button>
                    <button onClick={() => setPending(null)} className="text-sm text-ink-soft underline hover:text-royal">
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <table className="h-fit w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-ink-soft">
                    <th className="py-2">#</th>
                    <th className="py-2">Product</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {section.hotspots.map((h, i) => (
                    <tr
                      key={h.id}
                      onMouseEnter={() => setSelectedHotspotId(h.id)}
                      className={`border-b border-border ${selectedHotspotId === h.id ? "bg-cream-dark/50" : ""}`}
                    >
                      <td className="py-2">
                        <input
                          type="number"
                          defaultValue={h.position}
                          onBlur={(e) => savePosition(h.id, Number(e.target.value))}
                          className="w-12 border border-border bg-cream px-2 py-1 text-xs outline-none focus:border-royal"
                        />
                      </td>
                      <td className="py-2">
                        <select
                          value={h.productId}
                          onChange={(e) => handleReassign(h.id, e.target.value)}
                          className={inputClass}
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 text-right">
                        <button onClick={() => handleDeleteHotspot(h.id)} className="text-crimson hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {section.hotspots.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-ink-soft">
                        Click the image to add your first hotspot.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
