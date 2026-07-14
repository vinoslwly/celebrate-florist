-- Sprint 10 hotfix — service_role DELETE grant for experience_envelope_opens (CRIT-01)
--
-- CF-R2 replay reset (completeTreasuresJourney) deletes opens via createAdminClient()
-- (service_role). Migration 20260714100000 granted SELECT, INSERT only; DELETE was omitted.
-- Same class of issue as MED-06 / 20260713020000_experience_quiz_service_role_grants.sql.

grant delete on public.experience_envelope_opens to service_role;
