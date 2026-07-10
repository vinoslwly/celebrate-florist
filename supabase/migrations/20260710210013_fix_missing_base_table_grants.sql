-- Sprint 03A — 013: Fix Base Table Grants
--
-- Supabase grants SELECT/INSERT/UPDATE/DELETE to anon by default on every
-- new public table. Sprint 03 Deliverable 6 requires ZERO anon access to
-- the Gift domain. RLS alone is not enough here — revoke table-level DML
-- so anon receives permission denied before RLS is even evaluated.
--
-- themes is the sole exception: public reference data (Deliverable 6).
-- authenticated receives only the grants that match the RLS admin surface.

-- ---------------------------------------------------------------------------
-- anon — revoke all DML on sensitive tables
-- ---------------------------------------------------------------------------
revoke select, insert, update, delete on public.orders from anon;
revoke select, insert, update, delete on public.experiences from anon;
revoke select, insert, update, delete on public.experience_photos from anon;
revoke select, insert, update, delete on public.preview_links from anon;
revoke select, insert, update, delete on public.experience_sessions from anon;
revoke select, insert, update, delete on public.access_attempts from anon;
revoke select, insert, update, delete on public.experience_analytics from anon;
revoke select, insert, update, delete on public.audit_logs from anon;
revoke select, insert, update, delete on public.security_events from anon;
revoke select, insert, update, delete on public.app_settings from anon;

-- themes: anon may read public reference data only
grant select on public.themes to anon;

-- ---------------------------------------------------------------------------
-- authenticated — admin Studio surface (matches 008_rls.sql policies)
-- ---------------------------------------------------------------------------
grant select, insert, update on public.orders to authenticated;
grant select, insert, update on public.experiences to authenticated;
grant select, insert, delete on public.experience_photos to authenticated;
grant select, insert, update on public.preview_links to authenticated;
grant select, update on public.app_settings to authenticated;
grant select on public.audit_logs to authenticated;
grant select on public.experience_analytics to authenticated;
grant select on public.security_events to authenticated;
grant select, insert, update on public.themes to authenticated;

-- experience_sessions and access_attempts: intentionally no authenticated
-- grants — service_role only (Deliverable 6).
