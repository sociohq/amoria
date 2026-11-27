"use client";

import Script from "next/script";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/botProtection";

export const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

const WIDGET_WIDTH = 300;
const WIDGET_HEIGHT = 65;

type TurnstileApi = {
  ready?: (callback: () => void) => void;
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileHandle = {
  reset: () => void;
};

type TurnstileProps = {
  ref?: React.Ref<TurnstileHandle>;
  onToken: (token: string | null) => void;
  className?: string;
};

function useFitScale(slotRef: React.RefObject<HTMLDivElement | null>, active: boolean) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!active) return;
    const el = slotRef.current;
    if (!el) return;

    const apply = () => {
      const width = el.clientWidth;
      if (!width) return;
      const next = width >= WIDGET_WIDTH ? 1 : width / WIDGET_WIDTH;
      setScale((prev) => (Math.abs(prev - next) < 0.01 ? prev : next));
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, [active, slotRef]);

  return scale;
}

// Explicit render of Cloudflare's normal widget. The site key is public.
// When it is missing (local development), this renders nothing so the form
// can still be submitted.
export function Turnstile({ ref, onToken, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const [scriptReady, setScriptReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const enabled = TURNSTILE_SITE_KEY.length > 0;
  const scale = useFitScale(slotRef, enabled);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  // next/script's onReady does not fire reliably when several forms each
  // include the same script. Poll until the API is on the page.
  useEffect(() => {
    if (!enabled || scriptReady) return;
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (typeof window.turnstile?.render === "function") {
        window.clearInterval(timer);
        setScriptReady(true);
      } else if (attempts > 50) {
        window.clearInterval(timer);
        setFailed(true);
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [enabled, scriptReady]);

  useImperativeHandle(ref, () => ({
    reset() {
      const id = widgetIdRef.current;
      if (!id || !window.turnstile) return;
      try {
        window.turnstile.reset(id);
      } catch {
        // The widget was already removed with the form.
      }
    },
  }));

  useEffect(() => {
    if (!enabled || !scriptReady) return;
    const container = containerRef.current;
    if (!container) return;

    let removed = false;
    let retry: number | undefined;
    let attempts = 0;

    const tryRender = () => {
      if (removed) return;
      const api = window.turnstile;
      if (!api) {
        attempts += 1;
        if (attempts > 40) {
          setFailed(true);
          return;
        }
        retry = window.setTimeout(tryRender, 50);
        return;
      }

      // next/script loads this URL with async. turnstile.ready() throws in
      // that case ("Remove async/defer … before using turnstile.ready()"),
      // so render once the API is actually on the page.
      if (typeof api.render !== "function") {
        attempts += 1;
        if (attempts > 40) {
          setFailed(true);
          return;
        }
        retry = window.setTimeout(tryRender, 50);
        return;
      }
      if (widgetIdRef.current) return;
      try {
        widgetIdRef.current = api.render(container, {
          sitekey: TURNSTILE_SITE_KEY,
          size: "normal",
          theme: "light",
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
        });
      } catch {
        setFailed(true);
      }
    };

    tryRender();

    return () => {
      removed = true;
      if (retry) window.clearTimeout(retry);
      const id = widgetIdRef.current;
      widgetIdRef.current = null;
      if (!id) return;
      try {
        window.turnstile?.remove(id);
      } catch {
        // Already removed.
      }
    };
  }, [enabled, scriptReady]);

  if (!enabled) return null;

  const fitted = scale < 1;

  return (
    <div ref={slotRef} className={["w-full max-w-[300px] overflow-hidden", className].filter(Boolean).join(" ")}>
      <Script
        src={TURNSTILE_SCRIPT_SRC}
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setFailed(true)}
      />
      <div className={fitted ? "overflow-hidden" : undefined} style={fitted ? { height: WIDGET_HEIGHT * scale } : { minHeight: WIDGET_HEIGHT }}>
        <div style={fitted ? { width: WIDGET_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" } : undefined}>
          <div ref={containerRef} />
        </div>
      </div>
      {failed && <p className="mt-2 text-xs text-crimson">Verification couldn&apos;t load. Refresh the page and try again.</p>}
    </div>
  );
}
