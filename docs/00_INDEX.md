# Celebrate Florist Documentation

This folder is the **single source of truth** for the Celebrate Florist project. Every AI assistant and developer working on this repository should start here.

> **Repository:** [vinoslwly/celebrate-florist](https://github.com/vinoslwly/celebrate-florist)  
> **Active branch:** `rebuild/foundation`  
> **Supabase project:** `celebrate-florist-prod` (`jobknyooffpouniyqpkp`, `ap-southeast-1`)

---

## Reading Order

Read these documents in order. Each file builds on the previous one.

| #   | Document                                             | Purpose                                                        |
| --- | ---------------------------------------------------- | -------------------------------------------------------------- |
| 1   | [01_PROJECT_CONTEXT.md](./01_PROJECT_CONTEXT.md)     | What the product is, why it exists, current status, tech stack |
| 2   | [02_ARCHITECTURE.md](./02_ARCHITECTURE.md)           | System design, Next.js patterns, data and security flows       |
| 3   | [03_DATABASE.md](./03_DATABASE.md)                   | Every table, constraint, index, RLS policy, storage bucket     |
| 4   | [04_SECURITY.md](./04_SECURITY.md)                   | Threat model, auth, RLS strategy, headers, secrets             |
| 5   | [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md) | Locked business rules and their rationale                      |
| 6   | [06_DEVELOPMENT_GUIDE.md](./06_DEVELOPMENT_GUIDE.md) | Install, run, git workflow, migrations, deployment             |
| 7   | [07_AI_GUIDE.md](./07_AI_GUIDE.md)                   | Rules for AI coding assistants — **read before writing code**  |

---

## Current Project Status

| Area                        | Status                                                                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Development phase**       | Foundation rebuild — database complete, application features not yet built                                                                |
| **Current sprint**          | Sprint 04 (not started)                                                                                                                   |
| **Latest completed sprint** | Sprint 03A — Database Implementation (audited 53/53, production-ready)                                                                    |
| **Deployment**              | Vercel project linked (`.vercel/` present); landing page deployable; Studio and Experience routes not yet implemented                     |
| **Database**                | 15 migrations applied locally and on remote Supabase; 11 tables, 2 private storage buckets, 5 seeded themes                               |
| **Security**                | Sprint 02B hardening complete (CSP, security headers, proxy session refresh); RLS and privilege hardening complete (migrations 011–015)   |
| **Production readiness**    | **Partial** — schema and landing page are production-grade; Studio auth, Experience delivery, and privileged server paths are future work |

### Sprint History

| Sprint                               | Status      | Summary                                                   |
| ------------------------------------ | ----------- | --------------------------------------------------------- |
| Sprint 00 — Foundation               | ✅ Complete | Next.js 16 scaffold, Supabase connectivity, tooling       |
| Sprint 01 — Landing Page             | ✅ Complete | Full marketing site with 5 themes, bouquet catalog, FAQ   |
| Sprint 02 — Architecture             | ✅ Complete | Folder structure, env validation, feature scaffolding     |
| Sprint 02A — Architecture Audit      | ✅ Complete | Stress test of architecture decisions (audit only)        |
| Sprint 02B — Foundation Hardening    | ✅ Complete | `proxy.ts`, CSP, security headers, image domains          |
| Sprint 03 — Database Design          | ✅ Approved | Schema design in Notion (not duplicated here)             |
| Sprint 03A — Database Implementation | ✅ Complete | 15 SQL migrations, live audit, hardening                  |
| **Sprint 04**                        | ⏳ Next     | Studio auth, admin email gate, privileged Supabase client |

---

## AI Instructions

Every AI assistant working on this repository **MUST**:

1. **Read this file first**, then follow the reading order above.
2. **Never modify architecture** without explicit founder approval.
3. **Respect [Founder Decisions](./05_FOUNDER_DECISIONS.md)** — they override convenience.
4. **Never over-engineer** — prefer the simplest correct solution.
5. **Never introduce features** outside the approved roadmap.
6. **Preserve existing architecture** whenever possible.
7. **Keep documentation synchronized** with implementation when sprints change schema, security, or business rules.
8. **Do not invent information** — use the codebase and these docs as source of truth. Mark unknowns as [Future Work](./01_PROJECT_CONTEXT.md#future-work).

### What Exists Today (Code Reality)

| Layer            | Implemented                                                   | Not Yet Implemented                                                                           |
| ---------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Routes           | `app/(public)/` — landing page only                           | `app/(studio)/`, `app/(experience)/`                                                          |
| Features (code)  | `features/landing/`, `features/themes/`                       | `features/studio/`, `features/experience/`, `features/access/`, etc. (folders exist, no code) |
| Supabase clients | `lib/supabase/client.ts`, `lib/supabase/server.ts` (anon key) | `lib/supabase/admin.ts` (service role)                                                        |
| Auth             | Session cookie refresh via `proxy.ts`                         | Admin login gate, route protection                                                            |
| Database         | Full schema on remote Supabase                                | Application queries and mutations                                                             |

---

## Documentation Maintenance

Whenever a sprint changes architecture, security, database, or business rules:

- Update the corresponding document in this folder.
- Do **not** create duplicate documentation elsewhere.
- Keep this index accurate — especially the **Current Project Status** table.
- Cross-reference between documents instead of copying content.

---

## Quick Links

- [Project context & vision](./01_PROJECT_CONTEXT.md)
- [Architecture & data flow](./02_ARCHITECTURE.md)
- [Database entities & migrations](./03_DATABASE.md)
- [Security model](./04_SECURITY.md)
- [Founder decisions (locked)](./05_FOUNDER_DECISIONS.md)
- [Development workflow](./06_DEVELOPMENT_GUIDE.md)
- [AI coding rules](./07_AI_GUIDE.md)
