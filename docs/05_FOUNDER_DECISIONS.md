# 05 — Founder Decisions

> **Related:** [Project Context](./01_PROJECT_CONTEXT.md) · [Database](./03_DATABASE.md) · [Security](./04_SECURITY.md) · [AI Guide](./07_AI_GUIDE.md)

---

## Purpose

This document records **locked business and product decisions** made by the founder. These are not suggestions — they are constraints that every developer and AI assistant must respect unless the founder explicitly approves a change.

Each decision includes the **what**, the **why**, and where it is **enforced** in the codebase.

---

## Business Model

### Single Florist, Single Brand

|              |                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Celebrate Florist is one florist in Surakarta — not a platform, marketplace, or franchise.                                    |
| **Why**      | The product is a bespoke emotional gift experience tied to a specific brand identity. Multi-brand dilutes the personal touch. |
| **Enforced** | No multi-tenant schema, no `florist_id` column, no partner tables.                                                            |

### No Payment Gateway

|              |                                                                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Orders are placed offline via WhatsApp. No checkout, no Stripe, no payment processing.                                                                          |
| **Why**      | Target market (Surakarta) operates on personal relationships and offline payment (transfer, cash). Payment gateways add complexity without value at this stage. |
| **Enforced** | Landing page CTAs link to WhatsApp (`lib/whatsapp.ts`). No payment tables or API integrations.                                                                  |

### No Customer Accounts

|              |                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Neither buyers nor recipients create accounts.                                                                                |
| **Why**      | The gift is the identity — adding account creation friction kills the emotional moment. Admin is the only authenticated user. |
| **Enforced** | No `customers` table. Supabase Auth has one admin user only. Recipients authenticate via Access Code, not accounts.           |

### Single Administrator

|              |                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| **Decision** | One admin (`ADMIN_EMAIL`). No multi-admin, no role hierarchy.                                               |
| **Why**      | The founder operates the business solo. Role systems add complexity for a team that doesn't exist.          |
| **Enforced** | No roles/claims table. RLS uses `authenticated` as admin. Email verified server-side against `ADMIN_EMAIL`. |

---

## Product Architecture

### One Order → One Experience

|              |                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Every order maps to exactly one digital experience. 1:1 relationship.                                               |
| **Why**      | A bouquet is a single gift for a single person. Multiple experiences per order would confuse the product narrative. |
| **Enforced** | `experiences.order_id` has UNIQUE constraint in migration 004.                                                      |

### Preview Link ≠ Experience Link

|              |                                                                                                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Buyer preview and recipient experience use separate tokens and workflows.                                                                                               |
| **Why**      | The buyer approves the design before delivery. The recipient gets a different, more protected link with Access Code. Mixing them would leak content or bypass approval. |
| **Enforced** | Separate tables: `preview_links.preview_token` and `experiences.experience_token`. Partial unique index ensures one active preview per experience.                      |

### Experience Immutable After Publish

|              |                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Once published, letter content and photos cannot be edited.                                                                                                      |
| **Why**      | The recipient receives a promise — "this is your gift." Allowing post-publish edits breaks trust. Admin can disable or archive, but not silently change content. |
| **Enforced** | `experiences.content_locked_at` set on publish. CHECK constraint requires publish status. Application layer must reject edits when `content_locked_at` is set.   |

### Maximum 6 Memory Photos

|              |                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------- |
| **Decision** | Each experience allows at most 6 permanent memory photos.                                          |
| **Why**      | Quality over quantity. Six curated photos tell a story; unlimited uploads become a dumping ground. |
| **Enforced** | `experience_photos.sort_order` CHECK (1–6). UNIQUE `(experience_id, sort_order)`.                  |

### Photobooth Photos Never Stored

|              |                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Photobooth images exist only in the browser. Never uploaded to Supabase Storage.                                                                                               |
| **Why**      | Photobooth is ephemeral fun — a moment captured in the session, not a permanent record. Storing them increases liability, storage cost, and privacy risk for no product value. |
| **Enforced** | No photobooth storage bucket in migration 009. `analytics_event` tracks `photobooth_started`/`photobooth_completed` but no photo table exists.                                 |

### Gifts Archived After 365 Days Inactivity

|              |                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Experiences with no access for 365 days are automatically archived.                                                      |
| **Why**      | Storage and data minimization. Old gifts that nobody visits shouldn't consume resources indefinitely. Admin can restore. |
| **Enforced** | `experiences.status = 'archived'` with `archived_at` timestamp. Archival job not yet implemented (Future Work).          |

---

## Security Decisions

### Access Code Required on New Device

|              |                                                                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Recipients must enter an Access Code on first visit from each new device.                                                                                                            |
| **Why**      | The QR code on a bouquet is physically accessible to anyone who picks it up. The Access Code (shared separately by the sender) ensures only the intended recipient sees the content. |
| **Enforced** | `experiences.memory_key_hash` stores hashed code. `experience_sessions` backs trusted-device cookies.                                                                                |

### Memory Key Never Stored Plaintext

|              |                                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Access Code is hashed with `MEMORY_KEY_PEPPER` before storage. Never logged, never displayed after setup.                                               |
| **Why**      | If the database is compromised, plaintext codes would expose all gifts. Hashing with a server-side pepper means the attacker needs both DB and env var. |
| **Enforced** | Column named `memory_key_hash`. `MEMORY_KEY_PEPPER` in server-only env.                                                                                 |

### anon Has Zero Gift Domain Access

|              |                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | The Supabase `anon` role has no RLS policies on experiences, photos, sessions, or analytics.                                                           |
| **Why**      | The anon key is bundled into the browser. Any RLS policy granting anon read access would expose all gift content to anyone inspecting network traffic. |
| **Enforced** | Migration 008: intentionally no anon policies on Gift domain. Migration 013: revoked anon DML grants.                                                  |

### All Recipient Reads via service_role

|              |                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Server-side code using `service_role` fetches gift content only after Access Code or session verification.            |
| **Why**      | Application-layer gate is the primary control. RLS is defense in depth, not the access mechanism for recipients.      |
| **Enforced** | Architecture documented in `lib/supabase/server.ts` comments. `lib/supabase/admin.ts` (future) will use service role. |

### Audit Logs Are Immutable

|              |                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Decision** | `audit_logs` rows can never be updated or deleted — by any role.                                                      |
| **Why**      | Audit integrity. If an admin (or attacker with service_role) could delete audit entries, accountability is destroyed. |
| **Enforced** | `prevent_audit_log_mutation()` trigger in migration 007. Fires for all roles including service_role.                  |

### Admin Email Never in Version Control

|              |                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Decision** | The real admin email exists only in `.env.local` and remote `app_settings`. Never committed to Git.              |
| **Why**      | Email in Git history is a permanent leak. Even in a private repo, it violates data minimization.                 |
| **Enforced** | Migration 015 has no INSERT. `.env.example` uses placeholder. Commit `264b2e9` removed email from tracked files. |

---

## Content & Design Decisions

### Landing Page Content Is Static Config (V1)

|              |                                                                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Bouquet catalog, FAQ, nav items, and hero content live in TypeScript config files, not the database.                                           |
| **Why**      | Landing page changes infrequently and is edited by developers, not the admin via Studio. Database-driven CMS adds complexity without V1 value. |
| **Enforced** | `features/landing/config/` files. No `bouquets` or `faq` tables.                                                                               |

### Theme Visual Config in Application Code

|              |                                                                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Colors, emoji, flower, feeling, accent classes live in `features/themes/config/`. Database only stores slug, name, sort_order.   |
| **Why**      | Visual theming is a code concern (Tailwind classes, animations). Database themes are identity references for orders/experiences. |
| **Enforced** | Migration 010 seeds slug/name only. `types/theme.ts` defines the app-side type.                                                  |

### Five Themes, Fixed Set

|              |                                                                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Exactly 5 themes: Bloom, Sky, Pure, Warm, Play. No custom theme creation.                                                                                      |
| **Why**      | Each theme is a designed experience with specific colors, animations, and mood. Open-ended theme creation would require a theme builder — far beyond V1 scope. |
| **Enforced** | Migration 010 seeds 5 rows. `features/themes/config/` has 5 files.                                                                                             |

---

## Operational Decisions

### No Order Deletion

|              |                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------- |
| **Decision** | Orders are never deleted from the database.                                                 |
| **Why**      | Business records and audit trail. An order represents a real transaction even if cancelled. |
| **Enforced** | No delete RLS policy on `orders`.                                                           |

### No Experience Deletion

|              |                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Experiences are disabled or archived, never deleted.                                                               |
| **Why**      | A published experience may have been opened by a recipient. Deletion would orphan analytics and break audit trail. |
| **Enforced** | No delete RLS policy on `experiences`. Status `disabled` available.                                                |

### No Preview Link Deletion

|              |                                                                     |
| ------------ | ------------------------------------------------------------------- |
| **Decision** | Preview links are deactivated (`is_active = false`), never deleted. |
| **Why**      | Audit trail of what was sent to buyers and when.                    |
| **Enforced** | No delete RLS policy on `preview_links`. `disabled_at` timestamp.   |

### Orders via WhatsApp Only

|              |                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------- |
| **Decision** | The only order entry point is a WhatsApp conversation initiated from the landing page.   |
| **Why**      | Personal florist relationship. WhatsApp is the dominant messaging platform in Indonesia. |
| **Enforced** | `lib/whatsapp.ts` builds deep links. No order form on the website.                       |

---

## Complexity Decisions

### No Multi-Tenant

|              |                                                                                                                             |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | No `tenant_id`, no florist partners, no white-label.                                                                        |
| **Why**      | See "Single Florist" above. Multi-tenant architecture is the most common source of accidental complexity in early products. |
| **Enforced** | Schema has no tenant columns.                                                                                               |

### No Marketplace

|              |                                                                     |
| ------------ | ------------------------------------------------------------------- |
| **Decision** | No florist directory, no comparison shopping, no vendor onboarding. |
| **Why**      | Celebrate is a brand, not a platform.                               |
| **Enforced** | No vendor/partner tables or routes.                                 |

### No Unnecessary Abstraction

|              |                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------- |
| **Decision** | No generic CRUD framework, no plugin system, no event bus, no message queue.                |
| **Why**      | Every abstraction has a maintenance cost. Build exactly what the product needs.             |
| **Enforced** | Codebase uses direct Supabase queries in feature modules. No ORM, no repository base class. |

### No Speculative Features

|              |                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| **Decision** | Do not build features, routes, or middleware behavior until the sprint that needs them.                     |
| **Why**      | Speculative code rots, adds review burden, and often guesses wrong.                                         |
| **Enforced** | `proxy.ts` has no auth redirect. `env.server.ts` has optional secrets. Feature folders exist but are empty. |

---

## How to Challenge a Decision

If you believe a founder decision should change:

1. **Document the problem** — what specifically doesn't work?
2. **Propose an alternative** — with trade-offs, not just "let's use X instead."
3. **Get explicit founder approval** — a comment in a PR is not approval.
4. **Update this document** if the decision changes.

AI assistants must **never** unilaterally override a decision listed here.

---

## Related Documents

- [01_PROJECT_CONTEXT.md](./01_PROJECT_CONTEXT.md) — how decisions shape the product
- [03_DATABASE.md](./03_DATABASE.md) — schema enforcement of decisions
- [04_SECURITY.md](./04_SECURITY.md) — security decisions and implementation
- [07_AI_GUIDE.md](./07_AI_GUIDE.md) — how AI assistants must respect these decisions
