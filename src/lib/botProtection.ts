// Fields the API requires on public POST routes that accept visitor input:
// contact, newsletter, welcome, register, and resend-set-password-link.
// `turnstileToken` is an accepted alias of `cf-turnstile-response`.

export interface BotProtectionPayload {
  "cf-turnstile-response": string;
  turnstileToken: string;
  company_fax: string;
}

export const TURNSTILE_SITE_KEY = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "").trim();

// The widget is shown only when a site key was provided at build time.
// With no key — the local development default — callers leave submit enabled.
export function isTurnstileEnabled(): boolean {
  return TURNSTILE_SITE_KEY.length > 0;
}

export function botProtectionPayload(token: string | null, companyFax: string): BotProtectionPayload {
  const value = token ?? "";
  return {
    "cf-turnstile-response": value,
    turnstileToken: value,
    company_fax: companyFax,
  };
}
