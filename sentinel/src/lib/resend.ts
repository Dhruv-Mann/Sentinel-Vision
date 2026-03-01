import { Resend } from "resend";

/**
 * Resend client for sending email notifications.
 *
 * SETUP:
 * 1. Sign up at https://resend.com
 * 2. Create an API key
 * 3. Add RESEND_API_KEY to your .env.local
 * 4. (Optional) Verify your domain for custom "from" address
 *
 * Without a verified domain, use "onboarding@resend.dev" as the sender
 * (works for testing / dev only).
 */
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/** Default sender — change once you verify your own domain in Resend. */
export const SENDER_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Sentinel <onboarding@resend.dev>";
