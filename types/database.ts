/**
 * Database row and enum types derived from Sprint 03A migrations.
 * Regenerate when schema changes — do not invent columns here.
 *
 * @see docs/03_DATABASE.md
 */

export type OrderStatus =
  | "draft"
  | "designing"
  | "preview_sent"
  | "approved"
  | "ready"
  | "delivered"
  | "completed";

export type ExperienceStatus = "draft" | "published" | "archived" | "disabled";

export type AnalyticsEvent =
  | "experience_opened"
  | "letter_read"
  | "gallery_viewed"
  | "photobooth_started"
  | "photobooth_completed";

export type AuditActorType = "admin" | "system";

export type EventType =
  "birthday" | "anniversary" | "graduation" | "friendship" | "custom";

export type DeviceType = "mobile" | "tablet" | "desktop";

export type SecurityEventType =
  | "memory_key_failed"
  | "memory_key_exhausted"
  | "experience_locked"
  | "experience_brute_forced"
  | "rate_limit_triggered"
  | "suspicious_multi_device_access"
  | "admin_login_failed"
  | "admin_session_expired";

export type ThemeRow = {
  id: string;
  slug: string;
  name: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type OrderRow = {
  id: string;
  order_number: string;
  theme_id: string;
  sender_name: string;
  receiver_name: string;
  event_type: EventType;
  buyer_whatsapp: string | null;
  admin_notes: string | null;
  status: OrderStatus;
  scheduled_delivery_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ExperienceRow = {
  id: string;
  order_id: string;
  theme_id: string;
  experience_token: string;
  greeting_name: string;
  closing_name: string;
  event_type: EventType;
  letter_content: string;
  letter_closing: string;
  memory_key_hash: string;
  status: ExperienceStatus;
  is_opened: boolean;
  is_locked: boolean;
  locked_reason: string | null;
  qr_storage_path: string | null;
  content_locked_at: string | null;
  first_opened_at: string | null;
  last_accessed_at: string | null;
  published_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ExperiencePhotoRow = {
  id: string;
  experience_id: string;
  storage_path: string;
  sort_order: number;
  caption: string | null;
  created_at: string;
};

export type PreviewLinkRow = {
  id: string;
  experience_id: string;
  preview_token: string;
  is_active: boolean;
  created_by: string;
  disabled_at: string | null;
  created_at: string;
};

export type ExperienceSessionRow = {
  id: string;
  experience_id: string;
  session_token_hash: string;
  ip_hash: string | null;
  user_agent_hash: string | null;
  verified_at: string;
  expires_at: string;
  last_seen_at: string;
  is_revoked: boolean;
};

export type AccessAttemptRow = {
  id: string;
  experience_id: string;
  ip_hash: string;
  was_successful: boolean;
  attempted_at: string;
};

export type ExperienceAnalyticsRow = {
  id: string;
  experience_id: string;
  event_type: AnalyticsEvent;
  device_type: DeviceType | null;
  occurred_at: string;
};

export type AuditLogRow = {
  id: string;
  actor_type: AuditActorType;
  actor_id: string | null;
  action: string;
  target_table: string;
  target_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type SecurityEventRow = {
  id: string;
  event_type: SecurityEventType;
  experience_id: string | null;
  ip_hash: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type AppSettingRow = {
  id: string;
  key: string;
  value: string;
  updated_by: string | null;
  updated_at: string;
};

/** Tables addressable by repositories. */
export type TableName =
  | "themes"
  | "orders"
  | "experiences"
  | "experience_photos"
  | "preview_links"
  | "experience_sessions"
  | "access_attempts"
  | "experience_analytics"
  | "audit_logs"
  | "security_events"
  | "app_settings";
