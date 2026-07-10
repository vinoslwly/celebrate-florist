-- Sprint 03A — 011: Harden Function Search Path
--
-- Pins search_path on every custom function created in this schema.
-- Supabase advisor lint 0011 (function_search_path_mutable).
-- All three functions already fully-qualify identifiers with `public.`;
-- pg_catalog remains implicitly searched for builtins (now(), to_char(), etc.).

alter function public.set_updated_at() set search_path = '';
alter function public.generate_order_number() set search_path = '';
alter function public.prevent_audit_log_mutation() set search_path = '';
