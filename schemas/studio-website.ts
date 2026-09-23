import { z } from "zod";

import { ValidationError } from "@/lib/errors";

import { isSafePublicHref } from "@/features/website/config/safe-href";

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a hex color");

const safeHrefSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .refine(isSafePublicHref, "Link must be a site path or an https URL");

const themeCardSchema = z.object({
  slug: z.enum(["bloom", "warm", "sky"]),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(400),
  imageUrl: safeHrefSchema,
});

const faqItemSchema = z.object({
  id: z.string().trim().min(1).max(80),
  question: z.string().trim().min(1).max(200),
  answer: z.string().trim().min(1).max(2000),
});

export const websiteContentSchema = z.object({
  brand: z.object({
    logoUrl: safeHrefSchema,
    faviconUrl: safeHrefSchema,
    siteTitle: z.string().trim().min(1).max(120),
    siteDescription: z.string().trim().min(1).max(300),
  }),
  colors: z.object({
    cream: hexColorSchema,
    rose: hexColorSchema,
    gold: hexColorSchema,
    ink: hexColorSchema,
  }),
  whatsapp: z.object({
    number: z
      .string()
      .trim()
      .regex(/^\d{10,15}$/, "WhatsApp number must be 10–15 digits"),
    orderMessage: z.string().trim().min(1).max(500),
  }),
  links: z.object({
    bouquetUrl: safeHrefSchema,
    instagramUrl: safeHrefSchema,
    demoHref: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .refine(isSafePublicHref, "Link must be a site path or an https URL"),
  }),
  hero: z.object({
    eyebrow: z.string().trim().min(1).max(80),
    title: z.string().trim().min(1).max(160),
    lead: z.string().trim().min(1).max(800),
    ctaLabel: z.string().trim().min(1).max(80),
    demoLabel: z.string().trim().min(1).max(80),
    imageUrl: safeHrefSchema,
    caption: z.string().trim().min(1).max(80),
  }),
  whatIs: z.object({
    eyebrow: z.string().trim().min(1).max(80),
    title: z.string().trim().min(1).max(160),
    body: z.string().trim().min(1).max(2000),
  }),
  whyUs: z.object({
    eyebrow: z.string().trim().min(1).max(80),
    title: z.string().trim().min(1).max(160),
  }),
  bouquet: z.object({
    eyebrow: z.string().trim().min(1).max(80),
    title: z.string().trim().min(1).max(160),
    body: z.string().trim().min(1).max(800),
    ctaLabel: z.string().trim().min(1).max(80),
  }),
  experience: z.object({
    eyebrow: z.string().trim().min(1).max(80),
    title: z.string().trim().min(1).max(160),
    intro: z.string().trim().min(1).max(800),
    themes: z.array(themeCardSchema).length(3),
  }),
  demo: z.object({
    eyebrow: z.string().trim().min(1).max(80),
    title: z.string().trim().min(1).max(160),
    body: z.string().trim().min(1).max(400),
    ctaLabel: z.string().trim().min(1).max(80),
  }),
  faq: z.object({
    eyebrow: z.string().trim().min(1).max(80),
    title: z.string().trim().min(1).max(160),
    items: z.array(faqItemSchema).min(1).max(12),
  }),
  finalCta: z.object({
    eyebrow: z.string().trim().min(1).max(80),
    title: z.string().trim().min(1).max(160),
    body: z.string().trim().min(1).max(400),
    ctaLabel: z.string().trim().min(1).max(80),
  }),
  footer: z.object({
    copyright: z.string().trim().min(1).max(160),
  }),
});

export type WebsiteContentInput = z.infer<typeof websiteContentSchema>;

export const websiteAssetKindSchema = z.enum([
  "logo",
  "favicon",
  "hero",
  "theme-bloom",
  "theme-warm",
  "theme-sky",
]);

export type WebsiteAssetKind = z.infer<typeof websiteAssetKindSchema>;

const MAX_WEBSITE_ASSET_BYTES = 8 * 1024 * 1024;

const LOGO_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

const RASTER_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

export function validateWebsiteAssetFile(
  file: File,
  kind: WebsiteAssetKind,
): void {
  if (file.size > MAX_WEBSITE_ASSET_BYTES) {
    throw new ValidationError("Image must be 8 MB or smaller.");
  }
  if (file.type.toLowerCase() === "image/svg+xml") {
    throw new ValidationError("Image must be PNG, JPEG, or WebP.");
  }
  if (kind === "logo" && !LOGO_TYPES.has(file.type)) {
    throw new ValidationError("Logo must be PNG, JPEG, or WebP.");
  }
  if (kind === "favicon" && !RASTER_TYPES.has(file.type)) {
    throw new ValidationError("Favicon must be PNG, JPEG, or WebP.");
  }
  if (
    (kind === "hero" || kind.startsWith("theme-")) &&
    !RASTER_TYPES.has(file.type)
  ) {
    throw new ValidationError("Image must be PNG, JPEG, or WebP.");
  }
}
