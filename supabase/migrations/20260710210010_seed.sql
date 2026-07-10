-- Sprint 03A — 010: Seed Data
--
-- Minimal reference data only, per explicit scope: the 5 Experience
-- Themes, in their canonical display order (matches
-- features/themes/config/all-themes.ts). No dummy orders, experiences, or
-- users are created.
--
-- Visual configuration (colors, fonts, illustrations, emoji, feeling,
-- flower) intentionally stays in application code
-- (features/themes/config/*.ts) — the database only tracks identity and
-- availability (Phase 03A §4.1).

insert into public.themes (slug, name, sort_order) values
  ('bloom', 'Bloom', 1),
  ('sky', 'Sky', 2),
  ('pure', 'Pure', 3),
  ('warm', 'Warm', 4),
  ('play', 'Play', 5)
on conflict (slug) do nothing;
