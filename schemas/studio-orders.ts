import { z } from "zod";

import {
  eventTypeSchema,
  letterClosingSchema,
  letterContentSchema,
  personNameSchema,
  uuidSchema,
} from "@/schemas/common";
import { experienceModeSchema } from "@/schemas/experience-mode";
import { memoryCodePinSchema } from "@/schemas/studio-memory-code";

export const createOrderSchema = z.object({
  experienceMode: experienceModeSchema,
  senderName: personNameSchema,
  receiverName: personNameSchema,
  themeId: uuidSchema,
  eventType: eventTypeSchema,
  buyerWhatsapp: z.string().trim().optional(),
  adminNotes: z.string().trim().optional(),
  scheduledDeliveryAt: z
    .string()
    .datetime({ offset: true })
    .optional()
    .nullable(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateExperienceDraftSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  greetingName: personNameSchema,
  closingName: personNameSchema,
  letterContent: letterContentSchema,
  letterClosing: letterClosingSchema,
  quizTitle: z.string().trim().max(200).optional().nullable(),
  endingMessage: letterClosingSchema.optional(),
  memoryCode: memoryCodePinSchema.optional(),
});

export type UpdateExperienceDraftInput = z.infer<
  typeof updateExperienceDraftSchema
>;

export const changeExperienceModeSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  experienceMode: experienceModeSchema,
});

export type ChangeExperienceModeInput = z.infer<
  typeof changeExperienceModeSchema
>;
