"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  listHeroSlidesAdmin,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  uploadHeroSlideImage,
} from "@/lib/admin";
import { HeroSlide } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { PageHeader, Card, Button, Label, FileInput, inputClass } from "@/components/admin/ui";

function SlideCard({ slide, onChange }: { slide: HeroSlide; onChange: () => void }) {
  const [heading, setHeading] = useState(slide.heading);
  const [subtext, setSubtext] = useState(slide.subtext ?? "");
  const [ctaText, setCtaText] = useState(slide.ctaText ?? "");
  const [ctaLink, setCtaLink] = useState(slide.ctaLink ?? "");
  const [position, setPosition] = useState(slide.position);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    heading !== slide.heading ||
    subtext !== (slide.subtext ?? "") ||
    ctaText !== (slide.ctaText ?? "") ||
    ctaLink !== (slide.ctaLink ?? "") ||
    position !== slide.position;

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateHeroSlide(slide.id, { heading, subtext, ctaText, ctaLink, position });
      setSaved(true);
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function handleUploadImage() {
    if (!imageFile) return;
    setUploading(true);
    setError(null);
    try {
      await uploadHeroSlideImage(slide.id, imageFile);
      setImageFile(null);
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function toggleActive(active: boolean) {
    try {
      await updateHeroSlide(slide.id, { active });
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this slide?")) return;
    try {
      await deleteHeroSlide(slide.id);
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete slide");
    }
  }

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md bg-cream-dark">
          {slide.image ? (
            <Image src={slide.image} alt="" fill sizes="128px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-center text-[10px] text-ink-soft">
              No image
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <FileInput
            key={slide.image ?? "none"}
            accept="image/png,image/jpeg,image/webp"
            onSelect={(files) => setImageFile(files?.[0] ?? null)}
          />
          <Button variant="primary" size="sm" onClick={handleUploadImage} disabled={!imageFile || uploading}>
            {uploading ? "Uploading…" : slide.image ? "Replace" : "Upload"}
          </Button>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={slide.active}
            onChange={(e) => toggleActive(e.target.checked)}
            style={{ accentColor: "var(--color-ink)" }}
          />
          Active
        </label>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Heading</Label>
          <input value={heading} onChange={(e) => setHeading(e.target.value)} className={inputClass} />
        </div>
        <div>
          <Label>Position</Label>
          <input
            type="number"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <Label>Subtext</Label>
        <textarea rows={2} value={subtext} onChange={(e) => setSubtext(e.target.value)} className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Button Text</Label>
          <input
            placeholder="Shop Amoria Signature"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <Label>Button Link</Label>
          <input
            placeholder="/shop"
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-crimson">{error}</p>}
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleSave} disabled={!dirty || saving}>
          {saving ? "Saving…" : "Save Changes"}
        </Button>
        {saved && !dirty && <p className="text-sm text-royal">Saved.</p>}
      </div>
    </Card>
  );
}

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  function refresh() {
    listHeroSlidesAdmin()
      .then(({ slides }) => setSlides(slides))
      .catch(() => setError("Could not load hero slides"));
  }

  useEffect(refresh, []);

  async function handleAdd() {
    setAdding(true);
    setError(null);
    try {
      // Created inactive with placeholder heading so it never shows on the
      // live site half-configured — the admin fills it in below and
      // flips it active when ready.
      await createHeroSlide({ heading: "New Slide", position: slides.length, active: false });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add slide");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Hero Section"
        description={
          <>
            The homepage&apos;s full-bleed hero slider. Only <strong className="text-ink">Active</strong> slides
            show on the storefront, in order of <strong className="text-ink">Position</strong>. Leave Button Text
            or Link blank to show a slide with no button.
          </>
        }
        action={
          <Button onClick={handleAdd} disabled={adding}>
            {adding ? "Adding…" : "+ Add Slide"}
          </Button>
        }
      />

      {error && <p className="mb-4 text-sm text-crimson">{error}</p>}

      <div className="space-y-4">
        {slides.map((slide) => (
          <SlideCard key={slide.id} slide={slide} onChange={refresh} />
        ))}
        {slides.length === 0 && (
          <Card className="p-10 text-center text-ink-soft">No hero slides yet. Add one to get started.</Card>
        )}
      </div>
    </div>
  );
}
