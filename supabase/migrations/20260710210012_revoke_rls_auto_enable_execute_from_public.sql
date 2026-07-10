-- Sprint 03A — 012: Revoke Public Execute on rls_auto_enable
--
-- rls_auto_enable() is a Supabase platform-managed event-trigger function
-- (auto-enables RLS on newly created public tables). It has no legitimate
-- direct-call use case via the REST RPC API.
--
-- EXECUTE was granted to the PUBLIC pseudo-role by default on creation.
-- Revoking from PUBLIC closes the anon/authenticated RPC surface without
-- affecting automatic event-trigger operation (runs as trigger owner).

revoke execute on function public.rls_auto_enable() from public;
