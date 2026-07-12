import { z } from "zod";

import { uuidSchema } from "@/schemas/common";

export const sendPreviewSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
});

export type SendPreviewInput = z.infer<typeof sendPreviewSchema>;

export const skipPreviewSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  confirmOverride: z.literal(true),
});

export type SkipPreviewInput = z.infer<typeof skipPreviewSchema>;

export const publishExperienceSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
  skipPreview: z.boolean().optional(),
});

export type PublishExperienceInput = z.infer<typeof publishExperienceSchema>;

export const approvePreviewSchema = z.object({
  previewToken: z.string().trim().min(8).max(128),
});

export type ApprovePreviewInput = z.infer<typeof approvePreviewSchema>;

export const getPublishChecklistSchema = z.object({
  orderId: uuidSchema,
  experienceId: uuidSchema,
});

export type GetPublishChecklistInput = z.infer<
  typeof getPublishChecklistSchema
>;
