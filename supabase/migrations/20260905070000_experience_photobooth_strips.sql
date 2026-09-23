-- Custom photobooth strip PNGs per experience (Studio upload).
-- Captured photobooth photos stay client-only. This bucket stores overlay art only.

alter table public.experiences
  add column if not exists photobooth_strip_source text not null default 'catalog';

alter table public.experiences
  drop constraint if exists experiences_photobooth_strip_source_check;

alter table public.experiences
  add constraint experiences_photobooth_strip_source_check
    check (photobooth_strip_source in ('catalog', 'custom'));

create table if not exists public.experience_photobooth_strips (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null,
  storage_path text not null,
  sort_order integer not null,
  layout_id text not null,
  created_at timestamptz not null default now()
);

alter table public.experience_photobooth_strips
  drop constraint if exists experience_photobooth_strips_experience_id_fkey;

alter table public.experience_photobooth_strips
  add constraint experience_photobooth_strips_experience_id_fkey
    foreign key (experience_id) references public.experiences (id) on delete cascade;

alter table public.experience_photobooth_strips
  drop constraint if exists experience_photobooth_strips_sort_order_range;

alter table public.experience_photobooth_strips
  add constraint experience_photobooth_strips_sort_order_range
    check (sort_order between 1 and 6);

alter table public.experience_photobooth_strips
  drop constraint if exists experience_photobooth_strips_layout_id_check;

alter table public.experience_photobooth_strips
  add constraint experience_photobooth_strips_layout_id_check
    check (layout_id in ('B', 'K'));

alter table public.experience_photobooth_strips
  drop constraint if exists experience_photobooth_strips_experience_id_sort_order_key;

alter table public.experience_photobooth_strips
  add constraint experience_photobooth_strips_experience_id_sort_order_key
    unique (experience_id, sort_order);

create index if not exists experience_photobooth_strips_experience_id_idx
  on public.experience_photobooth_strips (experience_id);

alter table public.experience_photobooth_strips enable row level security;

drop policy if exists experience_photobooth_strips_admin_select
  on public.experience_photobooth_strips;
create policy experience_photobooth_strips_admin_select
  on public.experience_photobooth_strips for select
  to authenticated
  using (true);

drop policy if exists experience_photobooth_strips_admin_insert
  on public.experience_photobooth_strips;
create policy experience_photobooth_strips_admin_insert
  on public.experience_photobooth_strips for insert
  to authenticated
  with check (true);

drop policy if exists experience_photobooth_strips_admin_delete
  on public.experience_photobooth_strips;
create policy experience_photobooth_strips_admin_delete
  on public.experience_photobooth_strips for delete
  to authenticated
  using (true);

revoke select, insert, update, delete on public.experience_photobooth_strips from anon;
grant select, insert, delete on public.experience_photobooth_strips to authenticated;
-- Recipient /e/[token] loads strips via createAdminClient() (service_role).
grant select, insert, delete on public.experience_photobooth_strips to service_role;

insert into storage.buckets (id, name, public)
values ('photobooth-strips', 'photobooth-strips', false)
on conflict (id) do nothing;

drop policy if exists photobooth_strips_bucket_admin_select on storage.objects;
create policy photobooth_strips_bucket_admin_select
  on storage.objects for select
  to authenticated
  using (bucket_id = 'photobooth-strips');

drop policy if exists photobooth_strips_bucket_admin_insert on storage.objects;
create policy photobooth_strips_bucket_admin_insert
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'photobooth-strips');

drop policy if exists photobooth_strips_bucket_admin_delete on storage.objects;
create policy photobooth_strips_bucket_admin_delete
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'photobooth-strips');
