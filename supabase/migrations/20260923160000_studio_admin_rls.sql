-- Studio admin is a specific identity, not every authenticated user.
--
-- is_studio_admin() is true only when the JWT email claim matches
-- app_settings.admin_email. That claim is issued by GoTrue from auth.users.
-- It is not user_metadata and cannot be set by the client.
--
-- The allowlisted address is written only by the server service_role client
-- from ADMIN_EMAIL (see ensureStudioAdminEmail). An empty setting fails closed.
--
-- Apply this migration only after that sync has run in the deployed app.
-- Until admin_email is set, Studio queries from the admin JWT return no rows.
--
-- anon stays denied on the Gift domain. Public reads stay limited to themes
-- and the two public marketing buckets. service_role bypasses RLS and remains
-- the recipient path after the access gate.

create or replace function public.is_studio_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    auth.uid() is not null
    and exists (
      select 1
      from public.app_settings
      where key = 'admin_email'
        and length(btrim(value)) > 0
        and lower(btrim(value)) = lower(btrim(coalesce(auth.jwt() ->> 'email', '')))
    );
$$;

revoke all on function public.is_studio_admin() from public;
revoke all on function public.is_studio_admin() from anon;
grant execute on function public.is_studio_admin() to authenticated;

-- themes: public catalog read stays open. Writes become admin-only.
drop policy if exists themes_admin_insert on public.themes;
create policy themes_admin_insert
  on public.themes for insert
  to authenticated
  with check (public.is_studio_admin());

drop policy if exists themes_admin_update on public.themes;
create policy themes_admin_update
  on public.themes for update
  to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

drop policy if exists orders_admin_select on public.orders;
create policy orders_admin_select
  on public.orders for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists orders_admin_insert on public.orders;
create policy orders_admin_insert
  on public.orders for insert
  to authenticated
  with check (public.is_studio_admin());

drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update
  on public.orders for update
  to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

drop policy if exists experiences_admin_select on public.experiences;
create policy experiences_admin_select
  on public.experiences for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists experiences_admin_insert on public.experiences;
create policy experiences_admin_insert
  on public.experiences for insert
  to authenticated
  with check (public.is_studio_admin());

drop policy if exists experiences_admin_update on public.experiences;
create policy experiences_admin_update
  on public.experiences for update
  to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

drop policy if exists experience_photos_admin_select on public.experience_photos;
create policy experience_photos_admin_select
  on public.experience_photos for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists experience_photos_admin_insert on public.experience_photos;
create policy experience_photos_admin_insert
  on public.experience_photos for insert
  to authenticated
  with check (public.is_studio_admin());

drop policy if exists experience_photos_admin_delete on public.experience_photos;
create policy experience_photos_admin_delete
  on public.experience_photos for delete
  to authenticated
  using (public.is_studio_admin());

drop policy if exists preview_links_admin_select on public.preview_links;
create policy preview_links_admin_select
  on public.preview_links for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists preview_links_admin_insert on public.preview_links;
create policy preview_links_admin_insert
  on public.preview_links for insert
  to authenticated
  with check (public.is_studio_admin());

drop policy if exists preview_links_admin_update on public.preview_links;
create policy preview_links_admin_update
  on public.preview_links for update
  to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

drop policy if exists experience_analytics_admin_select on public.experience_analytics;
create policy experience_analytics_admin_select
  on public.experience_analytics for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists audit_logs_admin_select on public.audit_logs;
create policy audit_logs_admin_select
  on public.audit_logs for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists security_events_admin_select on public.security_events;
create policy security_events_admin_select
  on public.security_events for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists app_settings_admin_select on public.app_settings;
create policy app_settings_admin_select
  on public.app_settings for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists app_settings_admin_update on public.app_settings;
create policy app_settings_admin_update
  on public.app_settings for update
  to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

drop policy if exists experience_quiz_questions_admin_select on public.experience_quiz_questions;
create policy experience_quiz_questions_admin_select
  on public.experience_quiz_questions for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists experience_quiz_questions_admin_insert on public.experience_quiz_questions;
create policy experience_quiz_questions_admin_insert
  on public.experience_quiz_questions for insert
  to authenticated
  with check (public.is_studio_admin());

drop policy if exists experience_quiz_questions_admin_delete on public.experience_quiz_questions;
create policy experience_quiz_questions_admin_delete
  on public.experience_quiz_questions for delete
  to authenticated
  using (public.is_studio_admin());

drop policy if exists experience_quiz_score_bands_admin_select on public.experience_quiz_score_bands;
create policy experience_quiz_score_bands_admin_select
  on public.experience_quiz_score_bands for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists experience_quiz_score_bands_admin_insert on public.experience_quiz_score_bands;
create policy experience_quiz_score_bands_admin_insert
  on public.experience_quiz_score_bands for insert
  to authenticated
  with check (public.is_studio_admin());

drop policy if exists experience_quiz_score_bands_admin_delete on public.experience_quiz_score_bands;
create policy experience_quiz_score_bands_admin_delete
  on public.experience_quiz_score_bands for delete
  to authenticated
  using (public.is_studio_admin());

drop policy if exists experience_match_pairs_admin_select on public.experience_match_pairs;
create policy experience_match_pairs_admin_select
  on public.experience_match_pairs for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists experience_match_pairs_admin_insert on public.experience_match_pairs;
create policy experience_match_pairs_admin_insert
  on public.experience_match_pairs for insert
  to authenticated
  with check (public.is_studio_admin());

drop policy if exists experience_match_pairs_admin_delete on public.experience_match_pairs;
create policy experience_match_pairs_admin_delete
  on public.experience_match_pairs for delete
  to authenticated
  using (public.is_studio_admin());

drop policy if exists experience_envelopes_admin_select on public.experience_envelopes;
create policy experience_envelopes_admin_select
  on public.experience_envelopes for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists experience_envelopes_admin_insert on public.experience_envelopes;
create policy experience_envelopes_admin_insert
  on public.experience_envelopes for insert
  to authenticated
  with check (public.is_studio_admin());

drop policy if exists experience_envelopes_admin_delete on public.experience_envelopes;
create policy experience_envelopes_admin_delete
  on public.experience_envelopes for delete
  to authenticated
  using (public.is_studio_admin());

drop policy if exists experience_envelope_opens_admin_delete on public.experience_envelope_opens;
create policy experience_envelope_opens_admin_delete
  on public.experience_envelope_opens for delete
  to authenticated
  using (public.is_studio_admin());

drop policy if exists experience_photobooth_strips_admin_select on public.experience_photobooth_strips;
create policy experience_photobooth_strips_admin_select
  on public.experience_photobooth_strips for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists experience_photobooth_strips_admin_insert on public.experience_photobooth_strips;
create policy experience_photobooth_strips_admin_insert
  on public.experience_photobooth_strips for insert
  to authenticated
  with check (public.is_studio_admin());

drop policy if exists experience_photobooth_strips_admin_delete on public.experience_photobooth_strips;
create policy experience_photobooth_strips_admin_delete
  on public.experience_photobooth_strips for delete
  to authenticated
  using (public.is_studio_admin());

drop policy if exists catalog_photobooth_strips_admin_select on public.catalog_photobooth_strips;
create policy catalog_photobooth_strips_admin_select
  on public.catalog_photobooth_strips for select
  to authenticated
  using (public.is_studio_admin());

drop policy if exists catalog_photobooth_strips_admin_insert on public.catalog_photobooth_strips;
create policy catalog_photobooth_strips_admin_insert
  on public.catalog_photobooth_strips for insert
  to authenticated
  with check (public.is_studio_admin());

drop policy if exists catalog_photobooth_strips_admin_update on public.catalog_photobooth_strips;
create policy catalog_photobooth_strips_admin_update
  on public.catalog_photobooth_strips for update
  to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

drop policy if exists catalog_photobooth_strips_admin_delete on public.catalog_photobooth_strips;
create policy catalog_photobooth_strips_admin_delete
  on public.catalog_photobooth_strips for delete
  to authenticated
  using (public.is_studio_admin());

-- Storage. Public SELECT on marketing buckets is unchanged.
drop policy if exists experience_photos_bucket_admin_select on storage.objects;
create policy experience_photos_bucket_admin_select
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'experience-photos'
    and public.is_studio_admin()
  );

drop policy if exists experience_photos_bucket_admin_insert on storage.objects;
create policy experience_photos_bucket_admin_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'experience-photos'
    and public.is_studio_admin()
  );

drop policy if exists experience_photos_bucket_admin_delete on storage.objects;
create policy experience_photos_bucket_admin_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'experience-photos'
    and public.is_studio_admin()
  );

drop policy if exists experience_qr_bucket_admin_select on storage.objects;
create policy experience_qr_bucket_admin_select
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'experience-qr'
    and public.is_studio_admin()
  );

drop policy if exists experience_qr_bucket_admin_insert on storage.objects;
create policy experience_qr_bucket_admin_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'experience-qr'
    and public.is_studio_admin()
  );

drop policy if exists experience_qr_bucket_admin_delete on storage.objects;
create policy experience_qr_bucket_admin_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'experience-qr'
    and public.is_studio_admin()
  );

drop policy if exists photobooth_strips_bucket_admin_select on storage.objects;
create policy photobooth_strips_bucket_admin_select
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'photobooth-strips'
    and public.is_studio_admin()
  );

drop policy if exists photobooth_strips_bucket_admin_insert on storage.objects;
create policy photobooth_strips_bucket_admin_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'photobooth-strips'
    and public.is_studio_admin()
  );

drop policy if exists photobooth_strips_bucket_admin_delete on storage.objects;
create policy photobooth_strips_bucket_admin_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'photobooth-strips'
    and public.is_studio_admin()
  );

drop policy if exists website_assets_admin_insert on storage.objects;
create policy website_assets_admin_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'website-assets'
    and public.is_studio_admin()
  );

drop policy if exists website_assets_admin_update on storage.objects;
create policy website_assets_admin_update
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'website-assets'
    and public.is_studio_admin()
  )
  with check (
    bucket_id = 'website-assets'
    and public.is_studio_admin()
  );

drop policy if exists website_assets_admin_delete on storage.objects;
create policy website_assets_admin_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'website-assets'
    and public.is_studio_admin()
  );

drop policy if exists catalog_photobooth_strips_bucket_admin_insert on storage.objects;
create policy catalog_photobooth_strips_bucket_admin_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'catalog-photobooth-strips'
    and public.is_studio_admin()
  );

drop policy if exists catalog_photobooth_strips_bucket_admin_update on storage.objects;
create policy catalog_photobooth_strips_bucket_admin_update
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'catalog-photobooth-strips'
    and public.is_studio_admin()
  )
  with check (
    bucket_id = 'catalog-photobooth-strips'
    and public.is_studio_admin()
  );

drop policy if exists catalog_photobooth_strips_bucket_admin_delete on storage.objects;
create policy catalog_photobooth_strips_bucket_admin_delete
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'catalog-photobooth-strips'
    and public.is_studio_admin()
  );
