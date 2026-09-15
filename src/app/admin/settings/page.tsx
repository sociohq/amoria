"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getSettings, updateSettings, uploadNewsletterPopupImage } from "@/lib/admin";
import { Settings } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { PageHeader, Card, Button, Label, FileInput, inputClass } from "@/components/admin/ui";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    getSettings().then(({ settings }) => setSettings(settings));
  }, []);

  async function handleUploadImage() {
    if (!imageFile) return;
    setUploadingImage(true);
    setError(null);
    try {
      const { settings: updated } = await uploadNewsletterPopupImage(imageFile);
      setSettings(updated);
      setImageFile(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setError(null);
    setSaved(false);
    setSubmitting(true);
    try {
      const { settings: updated } = await updateSettings(settings);
      setSettings(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (!settings) return <p className="text-sm text-ink-soft">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4 p-6">
          <p className="text-sm font-medium text-ink">Fulfillment & Shipping</p>
          <div>
            <Label>Order Cutoff Hour (0–23, local time)</Label>
            <input
              type="number"
              min={0}
              max={23}
              value={settings.orderCutoffHour}
              onChange={(e) => setSettings({ ...settings, orderCutoffHour: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min Lead Days</Label>
              <input
                type="number"
                min={0}
                value={settings.minLeadDays}
                onChange={(e) => setSettings({ ...settings, minLeadDays: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
            <div>
              <Label>Max Lead Days</Label>
              <input
                type="number"
                min={0}
                value={settings.maxLeadDays}
                onChange={(e) => setSettings({ ...settings, maxLeadDays: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Free Shipping Threshold (AED)</Label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
            <div>
              <Label>Standard Shipping Fee (AED)</Label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <p className="text-sm font-medium text-ink">Newsletter Popup</p>
            <p className="mt-1 text-sm text-ink-soft">
              Shown once per visitor, after the delay below, unless they&apos;ve already dismissed it or signed up.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={settings.newsletterPopupEnabled}
              onChange={(e) => setSettings({ ...settings, newsletterPopupEnabled: e.target.checked })}
              style={{ accentColor: "var(--color-ink)" }}
            />
            Enabled
          </label>
          <div>
            <Label>Delay Before Showing (seconds)</Label>
            <input
              type="number"
              min={0}
              value={settings.newsletterPopupDelaySeconds}
              onChange={(e) => setSettings({ ...settings, newsletterPopupDelaySeconds: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <Label>Eyebrow</Label>
            <input
              value={settings.newsletterPopupEyebrow}
              onChange={(e) => setSettings({ ...settings, newsletterPopupEyebrow: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <Label>Headline</Label>
            <input
              value={settings.newsletterPopupHeadline}
              onChange={(e) => setSettings({ ...settings, newsletterPopupHeadline: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <Label>Subtext</Label>
            <textarea
              rows={3}
              value={settings.newsletterPopupSubtext}
              onChange={(e) => setSettings({ ...settings, newsletterPopupSubtext: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <input
              value={settings.newsletterPopupButtonText}
              onChange={(e) => setSettings({ ...settings, newsletterPopupButtonText: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <Label>Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                {settings.newsletterPopupImage && (
                  <Image src={settings.newsletterPopupImage} alt="" fill sizes="80px" className="object-cover" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                <FileInput
                  key={settings.newsletterPopupImage ?? "none"}
                  accept="image/png,image/jpeg,image/webp"
                  onSelect={(files) => setImageFile(files?.[0] ?? null)}
                />
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleUploadImage}
                  disabled={!imageFile || uploadingImage}
                >
                  {uploadingImage ? "Uploading…" : "Replace"}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <p className="text-sm font-medium text-ink">Social Media</p>
            <p className="mt-1 text-sm text-ink-soft">
              Shown as icons on the left of the header logo row and in the footer. Leave blank to hide an icon.
            </p>
          </div>
          <div>
            <Label>Instagram URL</Label>
            <input
              placeholder="https://instagram.com/amoria"
              value={settings.instagramUrl ?? ""}
              onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <Label>Facebook URL</Label>
            <input
              placeholder="https://facebook.com/amoria"
              value={settings.facebookUrl ?? ""}
              onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <Label>TikTok URL</Label>
            <input
              placeholder="https://tiktok.com/@amoria"
              value={settings.tiktokUrl ?? ""}
              onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <Label>X (Twitter) URL</Label>
            <input
              placeholder="https://x.com/amoria"
              value={settings.twitterUrl ?? ""}
              onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
              className={inputClass}
            />
          </div>
        </Card>

        {error && <p className="text-sm text-crimson">{error}</p>}
        {saved && <p className="text-sm text-royal">Saved.</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
