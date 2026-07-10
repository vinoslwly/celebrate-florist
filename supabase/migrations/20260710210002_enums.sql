-- Sprint 03A — 002: Enum Types
--
-- Only enums that were explicitly designed as native Postgres enums in
-- Sprint 03 Deliverable 4 (ENUM Strategy). `event_type` and
-- `security_events.event_type` are intentionally TEXT + CHECK, not enums —
-- see 004_constraints.sql for the reasoning.

create type public.order_status as enum (
  'draft',
  'designing',
  'preview_sent',
  'approved',
  'ready',
  'delivered',
  'completed'
);

create type public.experience_status as enum (
  'draft',
  'published',
  'archived',
  'disabled'
);

create type public.analytics_event as enum (
  'experience_opened',
  'letter_read',
  'gallery_viewed',
  'photobooth_started',
  'photobooth_completed'
);

-- Added during Sprint 03 Deliverable 11 review: audit_logs needs to
-- distinguish admin-initiated actions from system-initiated actions
-- (e.g. automatic 365-day archival has no human actor). Founder-approved
-- revision: explicit actor_type column instead of a bare-nullable actor_id.
create type public.audit_actor_type as enum (
  'admin',
  'system'
);
