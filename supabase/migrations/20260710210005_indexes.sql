-- Sprint 03A — 005: Indexes
--
-- Every index below maps to a specific real-world query identified in
-- Sprint 03 Deliverable 5 (Query & Index Strategy). No speculative
-- indexes. Indexes already implied by UNIQUE constraints (order_number,
-- experience_token, preview_token, themes.slug, app_settings.key,
-- experience_photos(experience_id, sort_order)) are NOT repeated here.

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------

-- "Waiting orders" dashboard query (status IN (...)).
create index orders_status_idx on public.orders (status);

-- "Today's deliveries" query.
create index orders_scheduled_delivery_at_idx on public.orders (scheduled_delivery_at);

-- FK join performance (Postgres does not auto-index FK columns).
create index orders_theme_id_idx on public.orders (theme_id);

-- Admin recipient-search query. Classified "nice to have" in Deliverable 5
-- (current order volume makes a sequential scan fast enough already) —
-- included now because it is cheap to create and the query pattern is
-- already an approved, real admin workflow.
create index orders_receiver_name_trgm_idx
  on public.orders using gin (receiver_name extensions.gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- experiences
-- ---------------------------------------------------------------------------

-- "Published gifts" / "archive lookup" listing queries in Studio.
create index experiences_status_idx on public.experiences (status);

-- FK join performance.
create index experiences_theme_id_idx on public.experiences (theme_id);

-- Note: experience_token and order_id already have UNIQUE-constraint-backed
-- btree indexes from 004_constraints.sql — the single most critical read
-- path (public experience lookup by token) is already covered.

-- ---------------------------------------------------------------------------
-- experience_photos
-- ---------------------------------------------------------------------------
-- No additional index: the UNIQUE (experience_id, sort_order) constraint
-- already provides a composite btree usable for "all photos for this
-- experience" lookups via leftmost-prefix matching. A dedicated
-- single-column index would be redundant.

-- ---------------------------------------------------------------------------
-- preview_links
-- ---------------------------------------------------------------------------

-- Full history lookup ("all preview links ever issued for this
-- experience"). The partial unique index below only covers active rows,
-- so this general index is still required.
create index preview_links_experience_id_idx on public.preview_links (experience_id);

-- Enforces "at most one active preview link per experience" at the
-- database level (Phase 03C refinement) AND serves as the index for
-- "find the currently active preview for this experience".
create unique index preview_links_one_active_per_experience_idx
  on public.preview_links (experience_id)
  where is_active;

-- ---------------------------------------------------------------------------
-- experience_sessions
-- ---------------------------------------------------------------------------

-- Trusted-device cookie verification — the single most frequent query on
-- this table (runs on every experience page load from a returning device).
create index experience_sessions_session_token_hash_idx
  on public.experience_sessions (session_token_hash);

-- Scheduled cleanup job ("expires_at < now()").
create index experience_sessions_expires_at_idx on public.experience_sessions (expires_at);

-- Admin "revoke all sessions for this experience" action.
create index experience_sessions_experience_id_idx on public.experience_sessions (experience_id);

-- ---------------------------------------------------------------------------
-- access_attempts
-- ---------------------------------------------------------------------------

-- Rate-limiting query, verbatim from Phase 03A §4.7: count failed attempts
-- for (experience_id, ip_hash) within the last hour.
create index access_attempts_rate_limit_idx
  on public.access_attempts (experience_id, ip_hash, attempted_at);

-- ---------------------------------------------------------------------------
-- experience_analytics
-- ---------------------------------------------------------------------------

-- Admin engagement-stats dashboard query.
create index experience_analytics_experience_id_event_type_idx
  on public.experience_analytics (experience_id, event_type);

-- ---------------------------------------------------------------------------
-- audit_logs
-- ---------------------------------------------------------------------------

-- "History for this record" admin query.
create index audit_logs_target_idx on public.audit_logs (target_table, target_id);

-- Chronological listing / pagination.
create index audit_logs_created_at_idx on public.audit_logs (created_at);

-- ---------------------------------------------------------------------------
-- security_events
-- ---------------------------------------------------------------------------

-- Retention cleanup job + chronological review.
create index security_events_created_at_idx on public.security_events (created_at);
create index security_events_experience_id_idx on public.security_events (experience_id);

-- ---------------------------------------------------------------------------
-- themes / app_settings
-- ---------------------------------------------------------------------------
-- Deliberately no additional indexes:
--  - themes has 5 rows; a sequential scan is faster than an index lookup.
--  - app_settings.key already has a UNIQUE-constraint-backed index, which
--    is the only lookup pattern this table has.
