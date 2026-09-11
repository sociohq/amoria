"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/lib/admin";
import { Settings } from "@/lib/types";
import { ApiError } from "@/lib/api";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getSettings().then(({ settings }) => setSettings(settings));
  }, []);

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

  if (!settings) return <p className="text-ink-soft">Loading…</p>;

  const inputClass = "w-full border border-border bg-cream px-3 py-2 text-sm outline-none focus:border-emerald";

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-ink">Settings</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Order Cutoff Hour (0–23, local time)</label>
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
            <label className="label-caps mb-1 block text-ink-soft">Min Lead Days</label>
            <input
              type="number"
              min={0}
              value={settings.minLeadDays}
              onChange={(e) => setSettings({ ...settings, minLeadDays: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="label-caps mb-1 block text-ink-soft">Max Lead Days</label>
            <input
              type="number"
              min={0}
              value={settings.maxLeadDays}
              onChange={(e) => setSettings({ ...settings, maxLeadDays: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Free Shipping Threshold (AED)</label>
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
          <label className="label-caps mb-1 block text-ink-soft">Standard Shipping Fee (AED)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={settings.standardShippingFee}
            onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
            className={inputClass}
          />
        </div>

        <h2 className="pt-4 font-serif text-xl text-ink">Newsletter Popup</h2>
        <p className="!mt-1 text-sm text-ink-soft">
          Shown once per visitor, after the delay below, unless they&apos;ve already dismissed it or signed up.
        </p>
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
          <label className="label-caps mb-1 block text-ink-soft">Delay Before Showing (seconds)</label>
          <input
            type="number"
            min={0}
            value={settings.newsletterPopupDelaySeconds}
            onChange={(e) => setSettings({ ...settings, newsletterPopupDelaySeconds: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Eyebrow</label>
          <input
            value={settings.newsletterPopupEyebrow}
            onChange={(e) => setSettings({ ...settings, newsletterPopupEyebrow: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Headline</label>
          <input
            value={settings.newsletterPopupHeadline}
            onChange={(e) => setSettings({ ...settings, newsletterPopupHeadline: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Subtext</label>
          <textarea
            rows={3}
            value={settings.newsletterPopupSubtext}
            onChange={(e) => setSettings({ ...settings, newsletterPopupSubtext: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Button Text</label>
          <input
            value={settings.newsletterPopupButtonText}
            onChange={(e) => setSettings({ ...settings, newsletterPopupButtonText: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="label-caps mb-1 block text-ink-soft">Image Path or URL</label>
          <input
            value={settings.newsletterPopupImage}
            onChange={(e) => setSettings({ ...settings, newsletterPopupImage: e.target.value })}
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-crimson">{error}</p>}
        {saved && <p className="text-sm text-emerald">Saved.</p>}
        <button disabled={submitting} className="bg-emerald px-6 py-3 label-caps text-cream hover:opacity-90 disabled:opacity-50">
          {submitting ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
