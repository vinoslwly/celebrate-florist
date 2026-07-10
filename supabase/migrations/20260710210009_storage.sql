-- Sprint 03A — 009: Storage
--
-- Two private buckets, per Sprint 03 Deliverable 7:
--  - experience-photos: permanent memory-photo gallery
--  - experience-qr: printable QR code per experience (bucket/path
--    convention proposed in Deliverable 7 since Phase 03A never specified
--    one; flagged for founder confirmation, now approved)
--
-- No photobooth bucket exists, and none is created here — by design,
-- photobooth photos never touch Supabase Storage at all.
--
-- Both buckets are private. Recipients never read from these buckets via
-- the anon key directly; every read is a signed URL minted server-side
-- (service_role) only after the Access Code / trusted-session gate has
-- passed, consistent with the RLS strategy in 008_rls.sql.

insert into storage.buckets (id, name, public)
values
  ('experience-photos', 'experience-photos', false),
  ('experience-qr', 'experience-qr', false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- experience-photos — admin manages via Studio (upload/replace/delete).
-- No anon policy: recipients view via signed URLs generated server-side.
-- ---------------------------------------------------------------------------
create policy experience_photos_bucket_admin_select
  on storage.objects for select
  to authenticated
  using (bucket_id = 'experience-photos');

create policy experience_photos_bucket_admin_insert
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'experience-photos');

create policy experience_photos_bucket_admin_delete
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'experience-photos');

-- No update policy: a photo replacement is a delete + insert, matching
-- the immutable-once-uploaded rule for experience_photos rows.

-- ---------------------------------------------------------------------------
-- experience-qr — generated server-side (service_role) at publish time;
-- admin views/downloads from Studio. No anon policy.
-- ---------------------------------------------------------------------------
create policy experience_qr_bucket_admin_select
  on storage.objects for select
  to authenticated
  using (bucket_id = 'experience-qr');

create policy experience_qr_bucket_admin_insert
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'experience-qr');

create policy experience_qr_bucket_admin_delete
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'experience-qr');
