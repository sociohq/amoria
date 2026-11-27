"use client";

import { useState } from "react";
import { botProtectionPayload, isTurnstileEnabled, type BotProtectionPayload } from "@/lib/botProtection";

// Token gate for the public forms. Refs stay in the form: this hook only
// tracks the Turnstile token so submit can stay disabled until one exists.
// With no site key (local development), submit is not gated.
export function useBotProtection() {
  const [token, setToken] = useState<string | null>(null);
  const enabled = isTurnstileEnabled();

  return {
    setToken,
    canSubmit: !enabled || Boolean(token),
    payload(companyFax: string): BotProtectionPayload {
      return botProtectionPayload(token, companyFax);
    },
    clearToken() {
      setToken(null);
    },
  };
}
