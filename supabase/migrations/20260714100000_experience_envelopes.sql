-- Sprint 09B Phase 1 — Treasures envelopes + recipient open progress (FD-T1–FD-T4)
--
-- experience_envelopes: Studio-authored envelope content (FD-T5 — message, photo, or both).
-- experience_envelope_opens: server-side progress — one row per opened envelope (FD-T2).
-- No UPDATE policies — draft edits use delete + insert (match experience_match_pairs pattern).
-- service_role SELECT/INSERT included from day one (Sprint 08 MED-06 lesson).

-- ---------------------------------------------------------------------------
-- experience_envelopes
-- ---------------------------------------------------------------------------
create table public.experience_envelopes (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null,
  sort_order integer not null,
  message_text text,
  photo_sort_order integer,
  is_final boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.experience_envelopes
  add constraint experience_envelopes_experience_id_fkey
    foreign key (experience_id) references public.experiences (id) on delete cascade,
  add constraint experience_envelopes_sort_order_range
    check (sort_order between 1 and 6),
  add constraint experience_envelopes_photo_sort_order_range
    check (photo_sort_order is null or photo_sort_order between 1 and 6),
  add constraint experience_envelopes_content_present_check
    check (
      (
        message_text is not null
        and char_length(trim(message_text)) > 0
      )
      or photo_sort_order is not null
    ),
  add constraint experience_envelopes_experience_id_sort_order_key
    unique (experience_id, sort_order);

create index experience_envelopes_experience_id_idx
  on public.experience_envelopes (experience_id);

-- ---------------------------------------------------------------------------
-- experience_envelope_opens — FD-T2 server progress (FD-T1 any order)
-- ---------------------------------------------------------------------------
create table public.experience_envelope_opens (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null,
  envelope_sort_order integer not null,
  opened_at timestamptz not null default now()
);

alter table public.experience_envelope_opens
  add constraint experience_envelope_opens_experience_id_fkey
    foreign key (experience_id) references public.experiences (id) on delete cascade,
  add constraint experience_envelope_opens_sort_order_range
    check (envelope_sort_order between 1 and 6),
  add constraint experience_envelope_opens_experience_id_sort_order_key
    unique (experience_id, envelope_sort_order);

create index experience_envelope_opens_experience_id_idx
  on public.experience_envelope_opens (experience_id);

-- ---------------------------------------------------------------------------
-- RLS — experience_envelopes (Studio admin)
-- ---------------------------------------------------------------------------
alter table public.experience_envelopes enable row level security;

create policy experience_envelopes_admin_select
  on public.experience_envelopes for select
  to authenticated
  using (true);

create policy experience_envelopes_admin_insert
  on public.experience_envelopes for insert
  to authenticated
  with check (true);

create policy experience_envelopes_admin_delete
  on public.experience_envelopes for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- RLS — experience_envelope_opens (recipient progress via service_role)
-- ---------------------------------------------------------------------------
alter table public.experience_envelope_opens enable row level security;

create policy experience_envelope_opens_admin_delete
  on public.experience_envelope_opens for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Privileges
-- ---------------------------------------------------------------------------
revoke select, insert, update, delete on public.experience_envelopes from anon;
revoke select, insert, update, delete on public.experience_envelope_opens from anon;

grant select, insert, delete on public.experience_envelopes to authenticated;
grant delete on public.experience_envelope_opens to authenticated;

grant select on public.experience_envelopes to service_role;
grant select, insert on public.experience_envelope_opens to service_role;
