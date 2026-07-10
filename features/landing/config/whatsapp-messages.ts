import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * Single source of truth for the "Order Now" WhatsApp link. Sprint 01B
 * defined this same string independently inside HeroSection and
 * FinalCtaSection — fixed during the Sprint 01C review so the CTA
 * copy can only ever be changed in one place.
 */
export const ORDER_LINK = buildWhatsAppLink(
  "Hai Celebrate Florist, aku mau order Celebrate Experience 🌸",
);
