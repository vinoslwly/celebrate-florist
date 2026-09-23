-- Recipient /e/[token] loads custom strip metadata via createAdminClient()
-- (service_role). The table migration granted authenticated only; service_role
-- still needs table privileges even though it bypasses RLS.

grant select, insert, delete on public.experience_photobooth_strips to service_role;
