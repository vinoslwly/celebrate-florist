-- Website CMS (app_settings.website) + global photobooth strip catalog.
-- app_settings has SELECT/UPDATE for authenticated but no INSERT — seed the key.
-- Public landing reads settings via service_role. Catalog PNGs are public assets.

insert into public.app_settings (key, value)
values ('website', '{}')
on conflict (key) do nothing;

grant select, insert, update on public.app_settings to service_role;

create table if not exists public.catalog_photobooth_strips (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  storage_path text not null,
  sort_order integer not null,
  layout_id text not null default 'B',
  created_at timestamptz not null default now()
);

alter table public.catalog_photobooth_strips
  drop constraint if exists catalog_photobooth_strips_display_name_check;

alter table public.catalog_photobooth_strips
  add constraint catalog_photobooth_strips_display_name_check
    check (btrim(display_name) <> '');

alter table public.catalog_photobooth_strips
  drop constraint if exists catalog_photobooth_strips_sort_order_range;

alter table public.catalog_photobooth_strips
  add constraint catalog_photobooth_strips_sort_order_range
    check (sort_order between 1 and 60);

alter table public.catalog_photobooth_strips
  drop constraint if exists catalog_photobooth_strips_layout_id_check;

alter table public.catalog_photobooth_strips
  add constraint catalog_photobooth_strips_layout_id_check
    check (layout_id = 'B');

create index if not exists catalog_photobooth_strips_sort_order_idx
  on public.catalog_photobooth_strips (sort_order, created_at);

alter table public.catalog_photobooth_strips enable row level security;

drop policy if exists catalog_photobooth_strips_admin_select
  on public.catalog_photobooth_strips;
create policy catalog_photobooth_strips_admin_select
  on public.catalog_photobooth_strips for select
  to authenticated
  using (true);

drop policy if exists catalog_photobooth_strips_admin_insert
  on public.catalog_photobooth_strips;
create policy catalog_photobooth_strips_admin_insert
  on public.catalog_photobooth_strips for insert
  to authenticated
  with check (true);

drop policy if exists catalog_photobooth_strips_admin_update
  on public.catalog_photobooth_strips;
create policy catalog_photobooth_strips_admin_update
  on public.catalog_photobooth_strips for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists catalog_photobooth_strips_admin_delete
  on public.catalog_photobooth_strips;
create policy catalog_photobooth_strips_admin_delete
  on public.catalog_photobooth_strips for delete
  to authenticated
  using (true);

revoke select, insert, update, delete on public.catalog_photobooth_strips from anon;
grant select, insert, update, delete on public.catalog_photobooth_strips to authenticated;
grant select, insert, update, delete on public.catalog_photobooth_strips to service_role;

insert into storage.buckets (id, name, public)
values
  ('website-assets', 'website-assets', true),
  ('catalog-photobooth-strips', 'catalog-photobooth-strips', true)
on conflict (id) do update
  set public = excluded.public;

drop policy if exists website_assets_public_select on storage.objects;
create policy website_assets_public_select
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'website-assets');

drop policy if exists website_assets_admin_insert on storage.objects;
create policy website_assets_admin_insert
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'website-assets');

drop policy if exists website_assets_admin_update on storage.objects;
create policy website_assets_admin_update
  on storage.objects for update
  to authenticated
  using (bucket_id = 'website-assets')
  with check (bucket_id = 'website-assets');

drop policy if exists website_assets_admin_delete on storage.objects;
create policy website_assets_admin_delete
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'website-assets');

drop policy if exists catalog_photobooth_strips_bucket_public_select on storage.objects;
create policy catalog_photobooth_strips_bucket_public_select
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'catalog-photobooth-strips');

drop policy if exists catalog_photobooth_strips_bucket_admin_insert on storage.objects;
create policy catalog_photobooth_strips_bucket_admin_insert
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'catalog-photobooth-strips');

drop policy if exists catalog_photobooth_strips_bucket_admin_update on storage.objects;
create policy catalog_photobooth_strips_bucket_admin_update
  on storage.objects for update
  to authenticated
  using (bucket_id = 'catalog-photobooth-strips')
  with check (bucket_id = 'catalog-photobooth-strips');

drop policy if exists catalog_photobooth_strips_bucket_admin_delete on storage.objects;
create policy catalog_photobooth_strips_bucket_admin_delete
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'catalog-photobooth-strips');
