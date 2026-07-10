-- Sprint 03A — 015: Seed Admin Email Lock
--
-- Celebrate follows a single-admin operational model. This setting is the
-- database-level source of truth for which email may access the Studio
-- admin surface. Sprint 04 auth middleware must reject any authenticated
-- user whose email does not match this value.
--
-- The corresponding Supabase Auth user (varrelakun@gmail.com) must exist
-- in auth.users before preview_links or admin audit_logs can be created.

insert into public.app_settings (key, value)
values ('admin_email', 'varrelakun@gmail.com')
on conflict (key) do update set value = excluded.value;
