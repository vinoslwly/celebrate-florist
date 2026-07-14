-- Sprint 09A — Memories mode match pairs + final_unlock_message
--
-- experience_match_pairs for Match The Memory game.
-- experiences.final_unlock_message shown when all pairs matched correctly.
-- No UPDATE policies — draft edits use delete + insert (match experience_photos / quiz).
-- service_role SELECT included from day one (Sprint 08 MED-06 lesson).

-- ---------------------------------------------------------------------------
-- experiences.final_unlock_message (Memories mode)
-- ---------------------------------------------------------------------------
alter table public.experiences
  add column if not exists final_unlock_message text;

-- ---------------------------------------------------------------------------
-- experience_match_pairs
-- ---------------------------------------------------------------------------
create table public.experience_match_pairs (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null,
  sort_order integer not null,
  story_text text not null,
  photo_sort_order integer not null,
  created_at timestamptz not null default now()
);

alter table public.experience_match_pairs
  add constraint experience_match_pairs_experience_id_fkey
    foreign key (experience_id) references public.experiences (id) on delete cascade,
  add constraint experience_match_pairs_sort_order_range
    check (sort_order between 1 and 6),
  add constraint experience_match_pairs_photo_sort_order_range
    check (photo_sort_order between 1 and 6),
  add constraint experience_match_pairs_experience_id_sort_order_key
    unique (experience_id, sort_order),
  add constraint experience_match_pairs_experience_id_photo_sort_order_key
    unique (experience_id, photo_sort_order);

create index experience_match_pairs_experience_id_idx
  on public.experience_match_pairs (experience_id);

-- ---------------------------------------------------------------------------
-- RLS — anon zero; authenticated SELECT/INSERT/DELETE; no UPDATE
-- ---------------------------------------------------------------------------
alter table public.experience_match_pairs enable row level security;

create policy experience_match_pairs_admin_select
  on public.experience_match_pairs for select
  to authenticated
  using (true);

create policy experience_match_pairs_admin_insert
  on public.experience_match_pairs for insert
  to authenticated
  with check (true);

create policy experience_match_pairs_admin_delete
  on public.experience_match_pairs for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Privileges — Gift domain hardening + service_role for admin/recipient paths
-- ---------------------------------------------------------------------------
revoke select, insert, update, delete on public.experience_match_pairs from anon;

grant select, insert, delete on public.experience_match_pairs to authenticated;
grant select on public.experience_match_pairs to service_role;
