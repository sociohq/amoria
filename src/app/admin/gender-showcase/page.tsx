"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getGenderShowcaseAdmin,
  upsertGenderShowcaseSection,
  uploadGenderShowcaseImage,
  GenderShowcaseSectionInput,
} from "@/lib/admin";
import { GenderShowcaseSection } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { PageHeader, Card, Button, Label, inputClass } from "@/components/admin/ui";

type Side = "him" | "her";

export default function AdminGenderShowcasePage() {
  const [section, setSection] = useState<GenderShowcaseSection | null>(null);
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

  useEffect(refresh, []);

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

  if (loading) {
    return <p className="text-sm text-ink-soft">Loading…</p>;
  }

  return (
    <div>
      <PageHeader
        title="For Him / For Her"
        description={
          <>
            The homepage-only tabbed banner. Each tab&apos;s background photo and copy is set here; the products
            shown underneath are simply the newest active products in the existing &quot;For Him&quot; / &quot;For
            Her&quot; categories — assign a product to that category from the product editor to feature it here.
          </>
        }
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
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="min-w-0 flex-1 text-xs"
                />
                <Button variant="secondary" size="sm" onClick={() => handleUpload(side)} disabled={!file || uploading === side}>
                  {uploading === side ? "Uploading…" : image ? "Replace" : "Upload"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {section && (section.him.length === 0 || section.her.length === 0) && (
        <p className="mt-6 max-w-2xl text-sm text-crimson">
          {section.him.length === 0 && 'No active products are in the "For Him" category yet — that tab will show an empty row. '}
          {section.her.length === 0 && 'No active products are in the "For Her" category yet — that tab will show an empty row. '}
          The whole section only hides itself if both sides are empty.
        </p>
      )}
    </div>
  );
}
