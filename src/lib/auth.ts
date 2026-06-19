import { createHmac, timingSafeEqual, createHash } from "node:crypto";

export const SESSION_COOKIE = "lpd_admin";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours (seconds)

const secret = () => process.env.SESSION_SECRET || "";

/** Constant-time comparison of the submitted password against ADMIN_PASSWORD. */
export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD || "";
  if (!pw || !input) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(pw).digest();
  return timingSafeEqual(a, b);
}

/** Signed, expiring session token: "<expiryMs>.<hmac>". */
export function createSessionToken(): string {
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const sig = createHmac("sha256", secret()).update(String(exp)).digest("hex");
  return `${exp}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !secret()) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = createHmac("sha256", secret()).update(expStr).digest("hex");
  if (expected.length !== sig.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  } catch {
    return false;
  }
}
