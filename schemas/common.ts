import { z } from "zod";

import type {
  AnalyticsEvent,
  AuditActorType,
  DeviceType,
  EventType,
  ExperienceStatus,
  OrderStatus,
  SecurityEventType,
} from "@/types/database";

const slugPattern = /^[a-z0-9-]+$/;

export const uuidSchema = z.string().uuid("Must be a valid UUID");

export const emailSchema = z.string().email("Must be a valid email address");

export const slugSchema = z
  .string()
  .min(1)
  .regex(
    slugPattern,
    "Slug must contain only lowercase letters, numbers, and hyphens",
  );

export const nonEmptyStringSchema = z
  .string()
  .trim()
  .min(1, "Must not be empty");

export const orderStatusSchema = z.enum([
  "draft",
  "designing",
  "preview_sent",
  "approved",
  "ready",
  "delivered",
  "completed",
]) satisfies z.ZodType<OrderStatus>;

export const experienceStatusSchema = z.enum([
  "draft",
  "published",
  "archived",
  "disabled",
]) satisfies z.ZodType<ExperienceStatus>;

export const eventTypeSchema = z.enum([
  "birthday",
  "anniversary",
  "graduation",
  "friendship",
  "custom",
]) satisfies z.ZodType<EventType>;

export const analyticsEventSchema = z.enum([
  "experience_opened",
  "letter_read",
  "gallery_viewed",
  "photobooth_started",
  "photobooth_completed",
]) satisfies z.ZodType<AnalyticsEvent>;

export const auditActorTypeSchema = z.enum([
  "admin",
  "system",
]) satisfies z.ZodType<AuditActorType>;

export const deviceTypeSchema = z.enum([
  "mobile",
  "tablet",
  "desktop",
]) satisfies z.ZodType<DeviceType>;

export const securityEventTypeSchema = z.enum([
  "memory_key_failed",
  "memory_key_exhausted",
  "experience_locked",
  "experience_brute_forced",
  "rate_limit_triggered",
  "suspicious_multi_device_access",
  "admin_login_failed",
  "admin_session_expired",
]) satisfies z.ZodType<SecurityEventType>;

/** Memory photo sort_order — database enforces 1–6. */
export const photoSortOrderSchema = z.number().int().min(1).max(6);

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
