-- Sprint 03A — 004: Constraints
--
-- Foreign keys, UNIQUE constraints and CHECK constraints, per Sprint 03
-- Deliverable 4 (Database Integrity) and Deliverable 9 (referential
-- integrity / ON DELETE policy). The partial unique index for
-- preview_links is NOT here — Postgres requires partial uniqueness to be
-- expressed as a unique INDEX, not a table constraint. It lives in
-- 005_indexes.sql.

-- ---------------------------------------------------------------------------
-- themes
-- ---------------------------------------------------------------------------
alter table public.themes
  add constraint themes_slug_key unique (slug),
  add constraint themes_slug_format_check check (slug ~ '^[a-z0-9-]+$');

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
alter table public.orders
  add constraint orders_order_number_key unique (order_number),
  add constraint orders_theme_id_fkey
    foreign key (theme_id) references public.themes (id) on delete restrict,
  add constraint orders_sender_name_not_blank check (btrim(sender_name) <> ''),
  add constraint orders_receiver_name_not_blank check (btrim(receiver_name) <> ''),
  add constraint orders_event_type_check
    check (event_type in ('birthday', 'anniversary', 'graduation', 'friendship', 'custom')),
  -- delivered_at may only be set once the order has actually reached (or
  -- passed) the delivered stage — Sprint 03 Deliverable 4.
  add constraint orders_delivered_at_requires_status check (
    delivered_at is null or status in ('delivered', 'completed')
  );

-- ---------------------------------------------------------------------------
-- experiences
-- ---------------------------------------------------------------------------
alter table public.experiences
  add constraint experiences_order_id_key unique (order_id), -- enforces 1:1 with orders
  add constraint experiences_experience_token_key unique (experience_token),
  add constraint experiences_order_id_fkey
    foreign key (order_id) references public.orders (id) on delete restrict,
  add constraint experiences_theme_id_fkey
    foreign key (theme_id) references public.themes (id) on delete restrict,
  add constraint experiences_greeting_name_not_blank check (btrim(greeting_name) <> ''),
  add constraint experiences_closing_name_not_blank check (btrim(closing_name) <> ''),
  add constraint experiences_letter_content_not_blank check (btrim(letter_content) <> ''),
  add constraint experiences_event_type_check
    check (event_type in ('birthday', 'anniversary', 'graduation', 'friendship', 'custom')),
  -- is_opened is a first-scan flag, not a derived value — it must always
  -- agree with first_opened_at (Sprint 03 Deliverable 4).
  add constraint experiences_is_opened_consistency check (
    (is_opened = false and first_opened_at is null) or
    (is_opened = true and first_opened_at is not null)
  ),
  -- locked_reason only makes sense while is_locked is true.
  add constraint experiences_locked_reason_requires_lock check (
    is_locked = true or locked_reason is null
  ),
  -- Memory Integrity (Phase 03C): content can only be locked once the
  -- experience has been published at least once.
  add constraint experiences_content_lock_requires_publish check (
    content_locked_at is null or status in ('published', 'archived', 'disabled')
  ),
  -- published_at must exist for every status except draft, and must be
  -- absent while still draft (Sprint 03 lifecycle, Deliverable 4).
  add constraint experiences_published_at_consistency check (
    (status = 'draft' and published_at is null) or
    (status <> 'draft' and published_at is not null)
  ),
  -- archived_at reflects only the current archived state — restoring an
  -- experience clears it (Sprint 03 Deliverable 4/8).
  add constraint experiences_archived_at_consistency check (
    (status = 'archived' and archived_at is not null) or
    (status <> 'archived' and archived_at is null)
  );

-- ---------------------------------------------------------------------------
-- experience_photos
-- ---------------------------------------------------------------------------
alter table public.experience_photos
  add constraint experience_photos_experience_id_fkey
    foreign key (experience_id) references public.experiences (id) on delete cascade,
  add constraint experience_photos_sort_order_range check (sort_order between 1 and 6),
  -- Composite uniqueness on (experience_id, sort_order) is also what
  -- structurally caps an experience at 6 photos (Sprint 03 Deliverable 4).
  add constraint experience_photos_experience_id_sort_order_key
    unique (experience_id, sort_order);

-- ---------------------------------------------------------------------------
-- preview_links
-- ---------------------------------------------------------------------------
alter table public.preview_links
  add constraint preview_links_preview_token_key unique (preview_token),
  add constraint preview_links_experience_id_fkey
    foreign key (experience_id) references public.experiences (id) on delete cascade,
  add constraint preview_links_created_by_fkey
    foreign key (created_by) references auth.users (id) on delete restrict,
  add constraint preview_links_disabled_at_consistency check (
    (is_active = true and disabled_at is null) or
    (is_active = false and disabled_at is not null)
  );

-- ---------------------------------------------------------------------------
-- experience_sessions
-- ---------------------------------------------------------------------------
alter table public.experience_sessions
  add constraint experience_sessions_experience_id_fkey
    foreign key (experience_id) references public.experiences (id) on delete cascade,
  add constraint experience_sessions_expires_after_verified check (expires_at > verified_at);

-- ---------------------------------------------------------------------------
-- access_attempts
-- ---------------------------------------------------------------------------
alter table public.access_attempts
  add constraint access_attempts_experience_id_fkey
    foreign key (experience_id) references public.experiences (id) on delete cascade;

-- ---------------------------------------------------------------------------
-- experience_analytics
-- ---------------------------------------------------------------------------
alter table public.experience_analytics
  add constraint experience_analytics_experience_id_fkey
    foreign key (experience_id) references public.experiences (id) on delete cascade,
  add constraint experience_analytics_device_type_check check (
    device_type is null or device_type in ('mobile', 'tablet', 'desktop')
  );

-- ---------------------------------------------------------------------------
-- audit_logs
--
-- action / target_table are intentionally left as free TEXT with no CHECK:
-- Phase 03B documents the action vocabulary as an "initial set" meant to
-- grow as new admin actions are introduced, without requiring a migration
-- every time (Sprint 03 Deliverable 4).
-- ---------------------------------------------------------------------------
alter table public.audit_logs
  add constraint audit_logs_actor_id_fkey
    foreign key (actor_id) references auth.users (id) on delete restrict,
  -- Founder-approved revision (Sprint 03 Deliverable 11): actor_type makes
  -- system-initiated actions (e.g. automatic 365-day archival) queryable
  -- without relying on a bare NULL actor_id.
  add constraint audit_logs_actor_consistency check (
    (actor_type = 'admin' and actor_id is not null) or
    (actor_type = 'system' and actor_id is null)
  );

-- ---------------------------------------------------------------------------
-- security_events
--
-- event_type uses a closed CHECK (not an enum) because Phase 03B presents
-- this vocabulary as final for MVP, and TEXT + CHECK is cheaper to extend
-- later than an enum if that assumption changes.
-- ---------------------------------------------------------------------------
alter table public.security_events
  add constraint security_events_experience_id_fkey
    foreign key (experience_id) references public.experiences (id) on delete cascade,
  add constraint security_events_event_type_check check (
    event_type in (
      'memory_key_failed',
      'memory_key_exhausted',
      'experience_locked',
      'experience_brute_forced',
      'rate_limit_triggered',
      'suspicious_multi_device_access',
      'admin_login_failed',
      'admin_session_expired'
    )
  );

-- ---------------------------------------------------------------------------
-- app_settings
-- ---------------------------------------------------------------------------
alter table public.app_settings
  add constraint app_settings_key_key unique (key),
  add constraint app_settings_updated_by_fkey
    foreign key (updated_by) references auth.users (id) on delete set null;
