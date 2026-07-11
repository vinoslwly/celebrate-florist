# 01 — Project Context

> **Related:** [Architecture](./02_ARCHITECTURE.md) · [Database](./03_DATABASE.md) · [Security](./04_SECURITY.md) · [Founder Decisions](./05_FOUNDER_DECISIONS.md) · [AI Guide](./07_AI_GUIDE.md)

---

## Project Overview

**Celebrate Florist** is a single-brand florist in Surakarta, Indonesia, that pairs physical flower bouquets with a **digital Greeting Experience** — a private, themed web page containing a personal letter, memory photos, and an ephemeral photobooth.

The product is **not** a marketplace, SaaS platform, or multi-tenant system. It is a bespoke gift experience for one florist, operated by one administrator.

### What the Customer Gets

1. A physical bouquet (ordered offline via WhatsApp).
2. A QR code on the bouquet that opens a private digital experience.
3. A themed greeting page with a personal letter and up to 6 memory photos.
4. An in-browser photobooth (photos never stored server-side).

### What the Admin Gets

1. **Studio** — an internal dashboard to manage orders, design experiences, send preview links, and publish gifts.
2. Full control over the order lifecycle from draft to delivery.
3. Audit logs and security events for accountability.

---

## Product Vision

Celebrate Florist turns a flower delivery into a **lasting memory**. The physical bouquet is the hook; the digital experience is the emotional payload.

Design principles (from implementation):

- **Warm, personal, not corporate** — typography and copy reflect a friendly florist, not a tech startup.
- **Privacy by default** — recipients need an Access Code on new devices; content is never publicly browsable.
- **Simplicity over features** — every feature must earn its complexity.
- **Offline-first commerce** — no payment gateway; human relationship via WhatsApp.

---

## Business Model

| Aspect       | Decision                                                        |
| ------------ | --------------------------------------------------------------- |
| Revenue      | Direct bouquet sales (offline payment)                          |
| Pricing      | Manually set per bouquet in static catalog config               |
| Orders       | Placed via WhatsApp — no checkout flow                          |
| Customers    | No accounts — buyers and recipients are anonymous to the system |
| Admin        | Single administrator (`ADMIN_EMAIL` in `.env.local`)            |
| Scale target | Single-store beachhead in Surakarta                             |

See [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md) for the full list of locked decisions and rationale.

---

## Founder Decisions (Summary)

These are non-negotiable without explicit founder approval:

- Single florist, single admin, no multi-tenant
- No payment gateway — WhatsApp/offline orders only
- No customer accounts
- One Order → One Experience (1:1 enforced in database)
- Preview Link ≠ Experience Link (separate tokens and workflows)
- Access Code required on new devices (hashed, never stored plaintext)
- Maximum 6 memory photos per experience
- Photobooth photos **never** stored in Supabase
- Gifts archived after 365 days of inactivity
- `anon` role has **zero** direct access to Gift domain tables
- All recipient reads mediated server-side via `service_role`

Full rationale: [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md)

---

## Current Implementation Status

### Completed

| Sprint     | Deliverable                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| Sprint 00  | Next.js 16 App Router scaffold, TypeScript strict, Tailwind 4, shadcn/ui, Husky + lint-staged, Supabase connectivity script |
| Sprint 01  | Full landing page — hero, bouquet catalog, theme showcase, FAQ, WhatsApp CTAs, scroll animations                            |
| Sprint 02  | Approved folder structure, Zod env validation, feature module scaffolding                                                   |
| Sprint 02B | `proxy.ts` session refresh, CSP, security headers, Supabase image domains                                                   |
| Sprint 03A | 15 migration files (remote history: 16 entries), RLS, storage buckets, 5 seeded themes, privilege hardening                 |

### Not Yet Built

| Area                                 | Status                                                               |
| ------------------------------------ | -------------------------------------------------------------------- |
| Studio dashboard (`/studio/*`)       | Route group and feature folders exist; no pages or logic             |
| Experience delivery (`/e/[token]/*`) | Route group planned; proxy matcher ready; no implementation          |
| Admin authentication gate            | `ADMIN_EMAIL` in `.env.example`; not wired in `config/env.server.ts` |
| Service role client                  | Referenced in comments; `lib/supabase/admin.ts` does not exist       |
| Memory Key verification              | Schema ready (`memory_key_hash`); application logic not built        |
| Preview link flow                    | Schema ready; no UI or server actions                                |
| Photobooth                           | Feature folder scaffolded; no implementation                         |
| QR generation                        | `experience-qr` bucket exists; no generation code                    |

---

## Current Sprint

**Sprint 04** is next. Expected scope (from codebase comments and env setup — not yet implemented):

- Wire `ADMIN_EMAIL` into server env validation
- Create `lib/supabase/admin.ts` (service role client)
- Implement Studio authentication and route protection in `proxy.ts`
- Begin Studio order management UI

Confirm scope with founder before starting — this section reflects codebase signals only.

---

## High-Level Architecture

```mermaid
flowchart TB
    subgraph Public["Public Surface"]
        LP["Landing Page<br/>(public) route group"]
        WA["WhatsApp Order Flow"]
    end

    subgraph Studio["Admin Surface (Future)"]
        SD["Studio Dashboard<br/>/studio/*"]
        AUTH["Supabase Auth<br/>Single Admin"]
    end

    subgraph Experience["Recipient Surface (Future)"]
        EXP["Greeting Experience<br/>/e/[token]"]
        AC["Access Code Gate"]
        TD["Trusted Device Cookie"]
    end

    subgraph Server["Next.js Server"]
        PROXY["proxy.ts<br/>Session Refresh"]
        SA["Server Actions"]
        RH["Route Handlers"]
        SR["service_role Client"]
    end

    subgraph Supabase["Supabase"]
        DB[(PostgreSQL + RLS)]
        STG["Storage<br/>experience-photos<br/>experience-qr"]
        SBAUTH["Auth"]
    end

    LP --> WA
    SD --> AUTH
    AUTH --> SBAUTH
    EXP --> AC
    AC --> TD
    AC --> SR
    TD --> SR
    SR --> DB
    SR --> STG
    SD --> SA
    SA --> DB
    PROXY --> SBAUTH
```

**Key architectural rule:** Recipients never read Gift domain data via the `anon` key. The server uses `service_role` after verifying Access Code or trusted session. See [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) and [04_SECURITY.md](./04_SECURITY.md).

---

## Repository Structure

```
celebrate-florist/
├── app/
│   ├── layout.tsx              # Root layout, brand fonts, metadata
│   ├── globals.css             # Tailwind 4 + design tokens
│   └── (public)/               # ✅ Implemented — marketing site
│       ├── layout.tsx          # Navbar, footer, MotionProvider
│       └── page.tsx            # Landing page sections
│
├── components/
│   ├── providers/              # MotionProvider (Framer Motion)
│   ├── shared/                 # PhotoSlot, ScrollReveal, SectionHeading
│   └── ui/                     # shadcn: Button, Sheet, Accordion
│
├── config/
│   ├── env.ts                  # Public env (Zod validated)
│   └── env.server.ts           # Server-only env (server-only guard)
│
├── features/
│   ├── landing/                # ✅ Landing page sections + static config
│   ├── themes/                 # ✅ 5 theme configs (bloom, sky, pure, warm, play)
│   ├── studio/                 # 📁 Scaffolded — actions, components, hooks, repos, services
│   ├── experience/             # 📁 Scaffolded
│   ├── access/                 # 📁 Scaffolded — Access Code, sessions
│   ├── preview/                # 📁 Scaffolded
│   ├── photobooth/             # 📁 Scaffolded
│   └── analytics/              # 📁 Scaffolded
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client (anon key)
│   │   └── server.ts           # Server client (anon key + cookies)
│   ├── utils.ts                # cn() helper
│   └── whatsapp.ts             # WhatsApp deep-link builder
│
├── proxy.ts                    # Session refresh (Next.js 16 convention)
├── next.config.ts              # CSP, security headers, image domains
├── scripts/
│   └── verify-supabase.ts      # Connectivity health check
├── supabase/
│   └── migrations/             # 15 SQL migration files (remote history: 16 entries)
├── types/
│   └── theme.ts                # Theme type for landing page
└── docs/                       # This documentation
```

**Legend:** ✅ = has implementation code · 📁 = folder structure only

---

## Tech Stack

| Layer      | Technology                      | Version   |
| ---------- | ------------------------------- | --------- |
| Framework  | Next.js (App Router)            | 16.2.10   |
| UI         | React                           | 19.2.4    |
| Language   | TypeScript (strict)             | 5.x       |
| Styling    | Tailwind CSS                    | 4.x       |
| Components | shadcn/ui + Radix UI            | —         |
| Animation  | Framer Motion                   | 12.x      |
| Forms      | React Hook Form + Zod           | 7.x / 4.x |
| Database   | Supabase (PostgreSQL)           | —         |
| Auth       | Supabase Auth                   | —         |
| Storage    | Supabase Storage                | —         |
| Deployment | Vercel                          | —         |
| Linting    | ESLint (next config) + Prettier | —         |
| Git hooks  | Husky + lint-staged             | —         |

### TypeScript Compiler Options (Notable)

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitOverride: true`
- Path alias: `@/*` → project root

---

## Deployment Target

- **Platform:** Vercel
- **Branch:** `rebuild/foundation` (active development)
- **Production URL:** Set via `NEXT_PUBLIC_APP_URL`
- **Supabase region:** `ap-southeast-1`
- **Image optimization:** `next/image` with Supabase storage remote patterns configured

The landing page (`(public)` route group) is deployable today. Studio and Experience routes will require additional environment variables (`SUPABASE_SERVICE_ROLE_KEY`, `MEMORY_KEY_PEPPER`, `ADMIN_EMAIL`) once implemented.

---

## Coding Philosophy

Derived from codebase conventions and sprint comments:

1. **Validate env at build time** — never read `process.env` directly outside `config/env.ts` and `config/env.server.ts`.
2. **Guard secrets with `server-only`** — importing server env from a Client Component must fail the build.
3. **Feature modules own their domain** — `features/<domain>/` contains components, hooks, actions, services for that domain.
4. **Static config for V1 content** — bouquet catalog, FAQ, nav items live in `features/landing/config/`; not database-driven yet.
5. **Comments explain _why_, not _what_** — especially for security and non-obvious business rules.
6. **No speculative code** — proxy has no auth redirect yet because no protected routes exist; do not add them early.
7. **Database is source of truth for Gift domain** — landing content is static; orders/experiences are relational.

---

## Future Work

Items referenced in design docs or folder structure but **not yet implemented**:

- Studio dashboard and admin auth gate (Sprint 04+)
- Experience delivery pages and Access Code flow
- `lib/supabase/admin.ts` service role client
- `lib/crypto/`, `lib/tokens/`, `lib/validation/` modules (folders may exist empty)
- `IP_HASH_PEPPER` environment variable (referenced in security design; not in `.env.example` yet)
- Photobooth canvas rendering and browser-only export
- QR code generation at publish time
- 365-day automatic archival cron/job
- Real theme preview images in `/public/themes/`
- Supabase TypeScript type generation (`supabase gen types`)
- Automated test suite (no tests exist today)
- README update (still describes Sprint 00 only)

---

## Related Documents

- [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) — technical architecture details
- [03_DATABASE.md](./03_DATABASE.md) — full schema reference
- [04_SECURITY.md](./04_SECURITY.md) — security model
- [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md) — locked business rules
- [06_DEVELOPMENT_GUIDE.md](./06_DEVELOPMENT_GUIDE.md) — how to run and contribute
- [07_AI_GUIDE.md](./07_AI_GUIDE.md) — rules for AI assistants
