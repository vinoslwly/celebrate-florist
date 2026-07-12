-- Sprint 06 — 016: experience_mode, quiz_title, atomic order+experience RPC
--
-- Product Revision V2: four experience modes on orders and experiences.
-- RPC guarantees atomic create — no orphan orders.

-- ---------------------------------------------------------------------------
-- experience_mode + quiz_title columns
-- ---------------------------------------------------------------------------
alter table public.orders
  add column experience_mode text not null default 'moments';

alter table public.orders
  add constraint orders_experience_mode_check check (
    experience_mode in ('moments', 'connection', 'memories', 'treasures')
  );

alter table public.experiences
  add column experience_mode text not null default 'moments',
  add column quiz_title text;

alter table public.experiences
  add constraint experiences_experience_mode_check check (
    experience_mode in ('moments', 'connection', 'memories', 'treasures')
  );

create index experiences_experience_mode_idx on public.experiences (experience_mode);

create index orders_experience_mode_idx on public.orders (experience_mode);

-- ---------------------------------------------------------------------------
-- create_order_with_experience — atomic order + experience bootstrap
-- ---------------------------------------------------------------------------
create or replace function public.create_order_with_experience(
  p_theme_id uuid,
  p_sender_name text,
  p_receiver_name text,
  p_event_type text,
  p_experience_mode text,
  p_memory_key_hash text,
  p_buyer_whatsapp text default null,
  p_admin_notes text default null,
  p_scheduled_delivery_at timestamptz default null
)
returns table (
  order_id uuid,
  experience_id uuid,
  order_number text
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_experience_id uuid;
  v_order_number text;
  v_experience_token text;
begin
  if p_experience_mode not in ('moments', 'connection', 'memories', 'treasures') then
    raise exception 'invalid experience_mode: %', p_experience_mode;
  end if;

  if btrim(p_sender_name) = '' or btrim(p_receiver_name) = '' then
    raise exception 'sender_name and receiver_name must not be blank';
  end if;

  if btrim(p_memory_key_hash) = '' then
    raise exception 'memory_key_hash must not be blank';
  end if;

  insert into public.orders (
    theme_id,
    sender_name,
    receiver_name,
    event_type,
    experience_mode,
    buyer_whatsapp,
    admin_notes,
    scheduled_delivery_at,
    status
  ) values (
    p_theme_id,
    btrim(p_sender_name),
    btrim(p_receiver_name),
    p_event_type,
    p_experience_mode,
    nullif(btrim(coalesce(p_buyer_whatsapp, '')), ''),
    nullif(btrim(coalesce(p_admin_notes, '')), ''),
    p_scheduled_delivery_at,
    'draft'
  )
  returning public.orders.id, public.orders.order_number
  into v_order_id, v_order_number;

  v_experience_token := encode(extensions.gen_random_bytes(16), 'hex');

  insert into public.experiences (
    order_id,
    theme_id,
    experience_token,
    greeting_name,
    closing_name,
    event_type,
    experience_mode,
    letter_content,
    letter_closing,
    memory_key_hash,
    status
  ) values (
    v_order_id,
    p_theme_id,
    v_experience_token,
    btrim(p_receiver_name),
    btrim(p_sender_name),
    p_event_type,
    p_experience_mode,
    'Draft letter — edit in Studio.',
    'Draft closing — edit in Studio.',
    p_memory_key_hash,
    'draft'
  )
  returning public.experiences.id into v_experience_id;

  return query select v_order_id, v_experience_id, v_order_number;
end;
$$;

revoke all on function public.create_order_with_experience(
  uuid, text, text, text, text, text, text, text, timestamptz
) from public;

grant execute on function public.create_order_with_experience(
  uuid, text, text, text, text, text, text, text, timestamptz
) to authenticated;
