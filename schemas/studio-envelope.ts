import { z } from "zod";

import {
  nonEmptyStringSchema,
  photoSortOrderSchema,
  uuidSchema,
} from "@/schemas/common";

/** Treasures — min 2 at publish, max 6 envelopes (founder decision). */
export const ENVELOPE_MIN_COUNT = 2;
export const ENVELOPE_MAX_COUNT = 6;

export const envelopeSortOrderSchema = photoSortOrderSchema;

export const envelopeMessageTextSchema = nonEmptyStringSchema.max(
  2_000,
  "Envelope message must be 2,000 characters or fewer",
);

/** FD-T5 — message only, photo only, or both; never neither. */
export const envelopeItemSchema = z
  .object({
    sortOrder: envelopeSortOrderSchema,
    messageText: z
      .string()
      .trim()
      .max(2_000, "Envelope message must be 2,000 characters or fewer")
      .nullable(),
    photoSortOrder: photoSortOrderSchema.nullable(),
    isFinal: z.boolean(),
  })
  .superRefine((item, ctx) => {
    const hasMessage = Boolean(item.messageText?.trim());
    const hasPhoto = item.photoSortOrder !== null;

    if (!hasMessage && !hasPhoto) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each envelope must include a message, a photo, or both",
      });
    }
  });

export type EnvelopeItemInput = z.infer<typeof envelopeItemSchema>;

function assertUniqueEnvelopeSortOrders(
  envelopes: EnvelopeItemInput[],
  ctx: z.RefinementCtx,
): void {
  const seen = new Set<number>();

  for (const [index, envelope] of envelopes.entries()) {
    if (seen.has(envelope.sortOrder)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each envelope must have a unique sortOrder",
        path: [index, "sortOrder"],
      });
      return;
    }

    seen.add(envelope.sortOrder);
  }
}

function assertExactlyOneFinalEnvelope(
  envelopes: EnvelopeItemInput[],
  ctx: z.RefinementCtx,
): void {
  const finalCount = envelopes.filter((envelope) => envelope.isFinal).length;

  if (finalCount !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Exactly one envelope must be marked as final",
    });
  }
}

/** Draft save — allows empty array while admin is building; max 6 when present. */
export const envelopesDraftArraySchema = z
  .array(envelopeItemSchema)
  .max(ENVELOPE_MAX_COUNT)
  .superRefine(assertUniqueEnvelopeSortOrders);

/** Publish-ready envelopes — min 2 required; exactly one final. */
export const envelopesPublishArraySchema = envelopesDraftArraySchema
  .min(
    ENVELOPE_MIN_COUNT,
    `At least ${ENVELOPE_MIN_COUNT} envelopes are required`,
  )
  .superRefine(assertExactlyOneFinalEnvelope);

export const saveEnvelopeConfigSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  envelopes: envelopesDraftArraySchema,
});

export type SaveEnvelopeConfigInput = z.infer<typeof saveEnvelopeConfigSchema>;

export const fetchEnvelopeByExperienceSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
});

export type FetchEnvelopeByExperienceInput = z.infer<
  typeof fetchEnvelopeByExperienceSchema
>;
