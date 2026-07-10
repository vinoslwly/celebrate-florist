-- Sprint 03A — 014: Revoke Public Execute on Trigger Functions
--
-- Trigger functions must never be callable directly via the REST RPC API.
-- Postgres grants EXECUTE to PUBLIC by default on function creation.
-- These three functions are only invoked by their respective triggers.

revoke execute on function public.set_updated_at() from public;
revoke execute on function public.generate_order_number() from public;
revoke execute on function public.prevent_audit_log_mutation() from public;
