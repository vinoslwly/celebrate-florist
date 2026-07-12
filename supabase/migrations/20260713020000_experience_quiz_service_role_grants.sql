-- Sprint 08 hotfix — service_role grants for quiz tables (Migration 017 gap)
--
-- Buyer preview and recipient quiz grading load quiz data via createAdminClient()
-- (service_role). Migration 017 granted authenticated only; service_role was omitted.

grant select on public.experience_quiz_questions to service_role;
grant select on public.experience_quiz_score_bands to service_role;
