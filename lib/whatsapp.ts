/**
 * Builds a wa.me deep link with a pre-filled message. Ordering happens
 * entirely through WhatsApp per the founder's business model decision
 * (Phase 0) — there is no checkout flow in this codebase.
 *
 * TODO(founder): replace with the real Celebrate Florist business
 * WhatsApp number before this goes live. This placeholder is
 * intentionally obvious so it is never mistaken for a real number.
 */
const WHATSAPP_BUSINESS_NUMBER = "6280000000000";

export function buildWhatsAppLink(
  message: string,
  number = WHATSAPP_BUSINESS_NUMBER,
): string {
  const digits = number.replace(/\D/g, "") || WHATSAPP_BUSINESS_NUMBER;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encodedMessage}`;
}
