"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/types";
import { uploadProductImages, removeProductImage } from "@/lib/admin";
import { Button } from "@/components/admin/ui";

export function ImageManager({
  productId,
  images,
  onChange,
}: {
  productId: string;
  images: ProductImage[];
  onChange: () => void;
}) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      await uploadProductImages(productId, Array.from(files));
      setFiles(null);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove(imageId: string) {
    try {
      await removeProductImage(productId, imageId);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove image");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((img) => (
          <div key={img.id} className="group relative h-24 w-24 overflow-hidden rounded-lg bg-cream-dark">
            <Image src={img.url} alt={img.altText ?? ""} fill sizes="96px" className="object-cover" />
            <button
              onClick={() => handleRemove(img.id)}
              className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-crimson text-xs text-cream group-hover:flex"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(e) => setFiles(e.target.files)} className="text-sm" />
        <Button variant="secondary" size="sm" onClick={handleUpload} disabled={!files || uploading}>
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-crimson">{error}</p>}
    </div>
  );
}
