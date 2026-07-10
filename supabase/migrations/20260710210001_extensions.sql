-- Sprint 03A — 001: Extensions
--
-- pgcrypto: provides gen_random_uuid(), used as the PK default for every
-- table in this schema (Sprint 03 Deliverable 9 — UUID v4 identifier
-- strategy).
--
-- pg_trgm: provides GIN trigram indexes. Used only by the admin recipient
-- search index on orders.receiver_name (Sprint 03 Deliverable 5). Not used
-- anywhere else in this schema.
create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_trgm with schema extensions;
