"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadProductThumbnail } from "@/lib/admin";
import { Button, FileInput } from "@/components/admin/ui";

// The one listing/card image — deliberately its own upload slot,
// separate from the gallery managed by ImageManager below it, so an
// admin can pick exactly which shot represents the product in grids
// without it having to also be gallery image #1.
export function ThumbnailManager({
  productId,
  thumbnailImage,
  onChange,
}: {
  productId: string;
  thumbnailImage: string | null;
  onChange: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadProductThumbnail(productId, file);
      setFile(null);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
          {thumbnailImage ? (
            <Image src={thumbnailImage} alt="" fill sizes="96px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-center text-[10px] text-ink-soft">
              No thumbnail
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <FileInput
            key={thumbnailImage ?? "none"}
            accept="image/png,image/jpeg,image/webp"
            onSelect={(files) => setFile(files?.[0] ?? null)}
          />
          <Button variant="primary" size="sm" onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? "Uploading…" : thumbnailImage ? "Replace" : "Upload"}
          </Button>
        </div>
      </div>
      {!thumbnailImage && (
        <p className="mt-2 text-xs text-ink-soft">
          Falls back to the first gallery image below until a dedicated thumbnail is set.
        </p>
      )}
      {error && <p className="mt-2 text-sm text-crimson">{error}</p>}
    </div>
  );
}
