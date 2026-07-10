-- Sprint 03A — 006: Functions
--
-- Only functions required to enforce already-approved Sprint 03 rules.
-- No speculative or Sprint 04 business-logic functions.

-- ---------------------------------------------------------------------------
-- set_updated_at — generic trigger function for the four tables that have
-- an updated_at column (themes, orders, experiences, app_settings).
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- generate_order_number — produces the human-readable admin-facing
-- identifier ("ORD-2026-001"). A database sequence is used instead of
-- application-side generation to guarantee uniqueness without a race
-- condition, since order_number must be unique and Postgres sequences are
-- inherently concurrency-safe.
--
-- Implementation note (flagged, not a design change): the sequence is a
-- single global counter, not one that resets to 001 every calendar year.
-- Sprint 03 did not specify whether numbering resets annually; a global
-- counter was chosen as the simpler, race-condition-free option. Numbers
-- remain unique and human-readable either way. Flag if annual reset is
-- actually required — that would need a different (more complex)
-- mechanism.
-- ---------------------------------------------------------------------------
create sequence if not exists public.order_number_seq;

create or replace function public.generate_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null then
    new.order_number := 'ORD-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('public.order_number_seq')::text, 3, '0');
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- prevent_audit_log_mutation — enforces "audit_logs is immutable" at a
-- level that RLS cannot reach. RLS policies never apply to service_role
-- (Supabase's service_role bypasses RLS by design), and service_role is
-- the only role that ever writes to audit_logs. Without this function,
-- "never updated, never deleted" (Phase 03B) would only hold for anon/
-- authenticated, not for the role that actually performs the writes.
-- This was flagged as a Sprint 03 Deliverable 12 finding and approved as
-- a required implementation mechanism.
-- ---------------------------------------------------------------------------
create or replace function public.prevent_audit_log_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_logs is immutable: % is not permitted', tg_op;
end;
$$;
