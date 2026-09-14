"use client";

import { Product, BlogBlock } from "@/lib/types";

const inputClass = "w-full border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-royal";

const BLOCK_DEFAULTS: Record<BlogBlock["type"], BlogBlock> = {
  heading: { type: "heading", text: "" },
  paragraph: { type: "paragraph", text: "" },
  image: { type: "image", url: "", aspect: "landscape" },
  video: { type: "video", url: "" },
  product: { type: "product", productId: "", product: null },
  quote: { type: "quote", text: "" },
};

// A minimal but functional block editor — not a rich text editor, just
// structured fields per block type. Reorder/remove/add, with a live
// preview-free but WYSIWYG-adjacent list. Kept intentionally simple.
export function PostBlockEditor({
  blocks,
  onChange,
  products,
}: {
  blocks: BlogBlock[];
  onChange: (blocks: BlogBlock[]) => void;
  products: Product[];
}) {
  function updateBlock(i: number, patch: Record<string, unknown>) {
    onChange(blocks.map((b, idx) => (idx === i ? ({ ...b, ...patch } as BlogBlock) : b)));
  }
  function removeBlock(i: number) {
    onChange(blocks.filter((_, idx) => idx !== i));
  }
  function moveBlock(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function addBlock(type: BlogBlock["type"]) {
    onChange([...blocks, BLOCK_DEFAULTS[type]]);
  }

  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <div key={i} className="border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="label-caps text-ink-soft">{b.type}</span>
            <div className="flex items-center gap-3 text-xs">
              <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0} className="text-ink-soft hover:text-ink disabled:opacity-30">
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveBlock(i, 1)}
                disabled={i === blocks.length - 1}
                className="text-ink-soft hover:text-ink disabled:opacity-30"
              >
                ↓
              </button>
              <button type="button" onClick={() => removeBlock(i)} className="text-crimson hover:underline">
                Remove
              </button>
            </div>
          </div>

          {(b.type === "heading" || b.type === "paragraph" || b.type === "quote") && (
            <textarea
              placeholder={b.type === "heading" ? "Heading text" : b.type === "quote" ? "Quote text" : "Paragraph text"}
              rows={b.type === "paragraph" ? 4 : 2}
              value={b.text}
              onChange={(e) => updateBlock(i, { text: e.target.value })}
              className={inputClass}
            />
          )}
          {b.type === "quote" && (
            <input
              placeholder="Attribution (optional)"
              value={b.attribution ?? ""}
              onChange={(e) => updateBlock(i, { attribution: e.target.value })}
              className={`${inputClass} mt-2`}
            />
          )}

          {(b.type === "image" || b.type === "video") && (
            <>
              <input
                placeholder={b.type === "image" ? "Image URL" : "Video URL (file, or a YouTube/Vimeo link)"}
                value={b.url}
                onChange={(e) => updateBlock(i, { url: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Caption (optional)"
                value={b.caption ?? ""}
                onChange={(e) => updateBlock(i, { caption: e.target.value })}
                className={`${inputClass} mt-2`}
              />
            </>
          )}
          {b.type === "image" && (
            <select
              value={b.aspect}
              onChange={(e) => updateBlock(i, { aspect: e.target.value })}
              className={`${inputClass} mt-2`}
            >
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
              <option value="square">Square</option>
            </select>
          )}

          {b.type === "product" && (
            <select value={b.productId} onChange={(e) => updateBlock(i, { productId: e.target.value })} className={inputClass}>
              <option value="">Select a product…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {(Object.keys(BLOCK_DEFAULTS) as BlogBlock["type"][]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => addBlock(t)}
            className="border border-border px-3 py-1.5 text-xs text-ink-soft hover:border-royal hover:text-royal"
          >
            + {t}
          </button>
        ))}
      </div>
    </div>
  );
}
