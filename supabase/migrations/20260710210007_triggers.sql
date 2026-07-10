-- Sprint 03A — 007: Triggers
--
-- Only triggers required to enforce already-approved Sprint 03 rules.
-- Status-consistency and timestamp-consistency rules that can be expressed
-- as single-row CHECK constraints were implemented that way instead
-- (see 004_constraints.sql) — a CHECK is simpler and sufficient whenever
-- no cross-row or generated-value logic is needed, so no extra triggers
-- were created for those.

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create trigger themes_set_updated_at
  before update on public.themes
  for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create trigger experiences_set_updated_at
  before update on public.experiences
  for each row execute function public.set_updated_at();

create trigger app_settings_set_updated_at
  before update on public.app_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- order_number generation
-- ---------------------------------------------------------------------------
create trigger orders_generate_order_number
  before insert on public.orders
  for each row execute function public.generate_order_number();

-- ---------------------------------------------------------------------------
-- audit_logs immutability guard — fires regardless of role, including
-- service_role, which is the specific gap RLS cannot close on its own.
-- ---------------------------------------------------------------------------
create trigger audit_logs_prevent_update
  before update on public.audit_logs
  for each row execute function public.prevent_audit_log_mutation();

create trigger audit_logs_prevent_delete
  before delete on public.audit_logs
  for each row execute function public.prevent_audit_log_mutation();
