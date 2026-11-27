import { ApiError } from "./api";

const VERIFY = "We couldn't verify that submission. Please try again.";
const TOO_MANY = "Too many attempts. Please wait a moment and try again.";
const SERVER = "Something went wrong on our side. Please try again in a moment.";
const GENERIC = "Something went wrong. Please try again.";

// Turnstile and honeypot failures come back as 400s with implementation
// wording. Real validation messages (a bad email, a short password) stay.
function friendly400(message: string | undefined): string {
  const msg = message?.trim() ?? "";
  if (!msg || /request failed/i.test(msg)) return VERIFY;
  if (/turnstile|captcha|honeypot|company_fax|cf-turnstile|verification|robot|bot check/i.test(msg)) {
    return VERIFY;
  }
  return msg;
}

export function friendlySubmitError(err: unknown): string {
  if (!(err instanceof ApiError)) return GENERIC;
  if (err.status === 429) return TOO_MANY;
  if (err.status >= 500) return SERVER;
  if (err.status === 400) return friendly400(err.message);
  return err.message || GENERIC;
}
