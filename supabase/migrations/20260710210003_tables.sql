-- Sprint 03A — 003: Tables
--
-- Columns, primary keys, defaults, nullability and timestamps only.
-- Foreign keys, UNIQUE and CHECK constraints are added in
-- 004_constraints.sql so that dependency ordering and business-rule
-- validation are reviewable as a separate, self-contained migration.

-- ---------------------------------------------------------------------------
-- themes — static reference data (Sprint 03 Deliverable 3, §3.1)
-- ---------------------------------------------------------------------------
create table public.themes (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  is_active boolean not null default true,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- orders — business transaction domain (§3.2)
-- ---------------------------------------------------------------------------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null,
  theme_id uuid not null,
  sender_name text not null,
  receiver_name text not null,
  event_type text not null,
  buyer_whatsapp text,
  admin_notes text,
  status public.order_status not null default 'draft',
  scheduled_delivery_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- experiences — the digital gift domain (§3.3). Includes the 5 Phase 03C
-- additions: theme_id snapshot, greeting_name, closing_name, event_type
-- snapshot, content_locked_at.
-- ---------------------------------------------------------------------------
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  theme_id uuid not null,
  experience_token text not null,
  greeting_name text not null,
  closing_name text not null,
  event_type text not null,
  letter_content text not null,
  letter_closing text not null,
  memory_key_hash text not null,
  status public.experience_status not null default 'draft',
  is_opened boolean not null default false,
  is_locked boolean not null default false,
  locked_reason text,
  qr_storage_path text,
  content_locked_at timestamptz,
  first_opened_at timestamptz,
  last_accessed_at timestamptz,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- experience_photos — permanent memory-photo gallery, up to 6 per
-- experience (§3.4). No updated_at: photos are immutable once uploaded.
-- ---------------------------------------------------------------------------
create table public.experience_photos (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null,
  storage_path text not null,
  sort_order integer not null,
  caption text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- preview_links — admin-controlled buyer-approval workflow (§3.5)
-- ---------------------------------------------------------------------------
create table public.preview_links (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null,
  preview_token text not null,
  is_active boolean not null default true,
  created_by uuid not null,
  disabled_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- experience_sessions — trusted-device cookie backing (§3.6)
-- ---------------------------------------------------------------------------
create table public.experience_sessions (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null,
  session_token_hash text not null,
  ip_hash text,
  user_agent_hash text,
  verified_at timestamptz not null default now(),
  expires_at timestamptz not null,
  last_seen_at timestamptz not null default now(),
  is_revoked boolean not null default false
);

-- ---------------------------------------------------------------------------
-- access_attempts — Access Code rate-limiting data (§3.7). Never stores
-- the code itself, only the outcome.
-- ---------------------------------------------------------------------------
create table public.access_attempts (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null,
  ip_hash text not null,
  was_successful boolean not null,
  attempted_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- experience_analytics — privacy-respecting engagement events (§3.8)
-- ---------------------------------------------------------------------------
create table public.experience_analytics (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null,
  event_type public.analytics_event not null,
  device_type text,
  occurred_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- audit_logs — immutable record of admin + system actions (§3.9).
-- actor_type/actor_id shape reflects the founder-approved revision to
-- Sprint 03 Deliverable 11 (explicit ADMIN/SYSTEM actor_type instead of a
-- bare-nullable actor_id).
-- ---------------------------------------------------------------------------
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_type public.audit_actor_type not null default 'admin',
  actor_id uuid,
  action text not null,
  target_table text not null,
  target_id uuid not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- security_events — security-relevant events for monitoring (§3.10)
-- ---------------------------------------------------------------------------
create table public.security_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  experience_id uuid,
  ip_hash text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- app_settings — Studio runtime configuration key/value store (§3.11)
-- ---------------------------------------------------------------------------
create table public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  value text not null,
  updated_by uuid,
  updated_at timestamptz not null default now()
);
