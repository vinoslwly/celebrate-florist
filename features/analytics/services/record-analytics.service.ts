import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

import type { AnalyticsEvent, DeviceType } from "@/types/database";

import { ExperienceAnalyticsRepository } from "@/features/analytics/repositories/experience-analytics.repository";

/**
 * Records coarse business analytics events.
 *
 * OD-1 (Sprint 08): Do not add `experience_completed` or migration 020.
 * Segment by mode when querying: JOIN `experience_analytics.experience_id`
 * → `experiences.experience_mode`. Event rows store only `experience_id`
 * and `event_type` (e.g. `experience_opened`).
 */
export async function recordAnalyticsEvent(params: {
  experienceId: string;
  eventType: AnalyticsEvent;
  deviceType?: DeviceType | null;
}): Promise<void> {
  const admin = createAdminClient();
  const repo = new ExperienceAnalyticsRepository(admin);
  await repo.insertEvent(params);
}
