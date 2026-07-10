-- Sprint 03A — 008: Row Level Security
--
-- Implements the authorization matrix from Sprint 03 Deliverable 6 exactly.
-- Core principle (Deliverable 6 conflict resolution, founder-approved):
-- `anon` has ZERO policies anywhere in the Gift domain (experiences,
-- experience_photos, preview_links, experience_sessions, access_attempts,
-- experience_analytics). Every recipient/buyer-facing read is mediated
-- server-side via service_role, which bypasses RLS entirely and enforces
-- the Access Code gate in application code before any content is
-- returned. RLS here is defense-in-depth for the admin surface, not the
-- primary access-control mechanism for gated content.
--
-- `authenticated` = the single administrator. No separate role/claims
-- table is introduced (no multi-admin support), per founder decision.

-- ---------------------------------------------------------------------------
-- themes — public reference data
-- ---------------------------------------------------------------------------
alter table public.themes enable row level security;

create policy themes_select_public
  on public.themes for select
  to anon, authenticated
  using (true);

create policy themes_admin_insert
  on public.themes for insert
  to authenticated
  with check (true);

create policy themes_admin_update
  on public.themes for update
  to authenticated
  using (true)
  with check (true);

-- No delete policy: themes are never deleted (Phase 03A). Deletion is
-- blocked by default for anon/authenticated; service_role can still
-- physically delete if ever truly required for data correction.

-- ---------------------------------------------------------------------------
-- orders — admin-only, no public access under any condition
-- ---------------------------------------------------------------------------
alter table public.orders enable row level security;

create policy orders_admin_select
  on public.orders for select
  to authenticated
  using (true);

create policy orders_admin_insert
  on public.orders for insert
  to authenticated
  with check (true);

create policy orders_admin_update
  on public.orders for update
  to authenticated
  using (true)
  with check (true);

-- No delete policy: "Orders have no deletion mechanism" (Phase 03B).

-- ---------------------------------------------------------------------------
-- experiences — the gated Gift content. NO anon policy (see header note).
-- Admin (authenticated) gets full CRUD because that is the Studio
-- authoring surface, not the recipient-facing surface — the anon leak
-- risk found in Deliverable 6 only concerned unauthenticated visitors.
-- ---------------------------------------------------------------------------
alter table public.experiences enable row level security;

create policy experiences_admin_select
  on public.experiences for select
  to authenticated
  using (true);

create policy experiences_admin_insert
  on public.experiences for insert
  to authenticated
  with check (true);

create policy experiences_admin_update
  on public.experiences for update
  to authenticated
  using (true)
  with check (true);

-- No delete policy: experiences are never deleted, only disabled.
-- No anon policy of any kind: recipient access is entirely server-mediated
-- via service_role after the Access Code / trusted-session gate passes.

-- ---------------------------------------------------------------------------
-- experience_photos — same gating logic as experiences
-- ---------------------------------------------------------------------------
alter table public.experience_photos enable row level security;

create policy experience_photos_admin_select
  on public.experience_photos for select
  to authenticated
  using (true);

create policy experience_photos_admin_insert
  on public.experience_photos for insert
  to authenticated
  with check (true);

create policy experience_photos_admin_delete
  on public.experience_photos for delete
  to authenticated
  using (true);

-- No update policy: photos are immutable once uploaded — a replacement is
-- a delete + insert, never an update (Phase 03A). No anon policy.

-- ---------------------------------------------------------------------------
-- preview_links — admin manages links; buyers view previews via a
-- server-mediated route keyed by preview_token, never via direct table
-- access, so no anon policy exists here either.
-- ---------------------------------------------------------------------------
alter table public.preview_links enable row level security;

create policy preview_links_admin_select
  on public.preview_links for select
  to authenticated
  using (true);

create policy preview_links_admin_insert
  on public.preview_links for insert
  to authenticated
  with check (true);

create policy preview_links_admin_update
  on public.preview_links for update
  to authenticated
  using (true)
  with check (true);

-- No delete policy: previews are disabled (is_active = false), never
-- deleted — preserves the audit trail per Phase 03A.

-- ---------------------------------------------------------------------------
-- experience_sessions — service_role only. Even the admin does not touch
-- this table directly; "revoke session" is a Server Action using
-- service_role, not a client-side table mutation.
-- ---------------------------------------------------------------------------
alter table public.experience_sessions enable row level security;
-- Intentionally no policies for anon or authenticated: default-deny.

-- ---------------------------------------------------------------------------
-- access_attempts — service_role only (rate-limiting bookkeeping)
-- ---------------------------------------------------------------------------
alter table public.access_attempts enable row level security;
-- Intentionally no policies for anon or authenticated: default-deny.

-- ---------------------------------------------------------------------------
-- experience_analytics — service_role writes (even client-triggered
-- events are recorded via a Server Action, never a direct anon insert);
-- admin can read for dashboards.
-- ---------------------------------------------------------------------------
alter table public.experience_analytics enable row level security;

create policy experience_analytics_admin_select
  on public.experience_analytics for select
  to authenticated
  using (true);

-- No insert/update/delete policy for anon or authenticated.

-- ---------------------------------------------------------------------------
-- audit_logs — insert-only via service_role (no policy needed, it
-- bypasses RLS); admin can read; nobody can update or delete via RLS, and
-- the immutability trigger from 007_triggers.sql additionally blocks
-- update/delete even for service_role.
-- ---------------------------------------------------------------------------
alter table public.audit_logs enable row level security;

create policy audit_logs_admin_select
  on public.audit_logs for select
  to authenticated
  using (true);

-- No insert/update/delete policy for anon or authenticated.

-- ---------------------------------------------------------------------------
-- security_events — same shape as audit_logs, minus the immutability
-- trigger (this table's rows are deleted by the 90-day retention job).
-- ---------------------------------------------------------------------------
alter table public.security_events enable row level security;

create policy security_events_admin_select
  on public.security_events for select
  to authenticated
  using (true);

-- No insert/update/delete policy for anon or authenticated.

-- ---------------------------------------------------------------------------
-- app_settings — admin can read and update; no insert/delete via RLS
-- (setting keys are structural and added via migration/seed, not runtime
-- CRUD), matching Phase 03A's literal "SELECT/UPDATE: authenticated admin
-- only" intent.
-- ---------------------------------------------------------------------------
alter table public.app_settings enable row level security;

create policy app_settings_admin_select
  on public.app_settings for select
  to authenticated
  using (true);

create policy app_settings_admin_update
  on public.app_settings for update
  to authenticated
  using (true)
  with check (true);
