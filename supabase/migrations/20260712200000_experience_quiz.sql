-- Sprint 08 — 017: Connection mode quiz tables
--
-- experience_quiz_questions + experience_quiz_score_bands for Connection mode.
-- Normalized rows; options JSONB auxiliary per 10_DATABASE_REVISION_PLAN.md.
-- No UPDATE policies — draft edits use delete + insert (match experience_photos).

-- ---------------------------------------------------------------------------
-- experience_quiz_questions
-- ---------------------------------------------------------------------------
create table public.experience_quiz_questions (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null,
  sort_order integer not null,
  prompt text not null,
  options jsonb not null,
  correct_option_index integer not null,
  created_at timestamptz not null default now()
);

alter table public.experience_quiz_questions
  add constraint experience_quiz_questions_experience_id_fkey
    foreign key (experience_id) references public.experiences (id) on delete cascade,
  add constraint experience_quiz_questions_sort_order_range
    check (sort_order between 1 and 6),
  add constraint experience_quiz_questions_correct_option_index_nonnegative
    check (correct_option_index >= 0),
  add constraint experience_quiz_questions_options_is_array
    check (jsonb_typeof(options) = 'array'),
  add constraint experience_quiz_questions_experience_id_sort_order_key
    unique (experience_id, sort_order);

create index experience_quiz_questions_experience_id_idx
  on public.experience_quiz_questions (experience_id);

-- ---------------------------------------------------------------------------
-- experience_quiz_score_bands
-- ---------------------------------------------------------------------------
create table public.experience_quiz_score_bands (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null,
  min_percent integer not null,
  max_percent integer not null,
  message text not null
);

alter table public.experience_quiz_score_bands
  add constraint experience_quiz_score_bands_experience_id_fkey
    foreign key (experience_id) references public.experiences (id) on delete cascade,
  add constraint experience_quiz_score_bands_min_percent_range
    check (min_percent between 0 and 100),
  add constraint experience_quiz_score_bands_max_percent_range
    check (max_percent between 0 and 100),
  add constraint experience_quiz_score_bands_percent_order
    check (min_percent <= max_percent);

create index experience_quiz_score_bands_experience_id_idx
  on public.experience_quiz_score_bands (experience_id);

-- ---------------------------------------------------------------------------
-- RLS — anon zero; authenticated SELECT/INSERT/DELETE; no UPDATE
-- ---------------------------------------------------------------------------
alter table public.experience_quiz_questions enable row level security;
alter table public.experience_quiz_score_bands enable row level security;

create policy experience_quiz_questions_admin_select
  on public.experience_quiz_questions for select
  to authenticated
  using (true);

create policy experience_quiz_questions_admin_insert
  on public.experience_quiz_questions for insert
  to authenticated
  with check (true);

create policy experience_quiz_questions_admin_delete
  on public.experience_quiz_questions for delete
  to authenticated
  using (true);

create policy experience_quiz_score_bands_admin_select
  on public.experience_quiz_score_bands for select
  to authenticated
  using (true);

create policy experience_quiz_score_bands_admin_insert
  on public.experience_quiz_score_bands for insert
  to authenticated
  with check (true);

create policy experience_quiz_score_bands_admin_delete
  on public.experience_quiz_score_bands for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Privileges — match Gift domain hardening (migration 013 pattern)
-- ---------------------------------------------------------------------------
revoke select, insert, update, delete on public.experience_quiz_questions from anon;
revoke select, insert, update, delete on public.experience_quiz_score_bands from anon;

grant select, insert, delete on public.experience_quiz_questions to authenticated;
grant select, insert, delete on public.experience_quiz_score_bands to authenticated;
