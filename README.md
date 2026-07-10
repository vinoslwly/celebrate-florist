# Celebrate Florist

Production rebuild of the Celebrate Florist experience. This repository
contains the engineering foundation only — no product features yet.

The single source of truth for product vision, PRD, design system, and all
locked architectural decisions is the Notion workspace (Phase 0 → Phase 05).
This README does not duplicate that documentation.

## Status

**Sprint 00 — Foundation Setup.** See the sprint report delivered alongside
this repository for what is and isn't implemented yet.

## Stack

Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS ·
shadcn/ui · Framer Motion · Supabase · React Hook Form · Zod

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                    | Purpose                                               |
| ------------------------- | ----------------------------------------------------- |
| `npm run dev`             | Start the development server                          |
| `npm run build`           | Production build                                      |
| `npm run start`           | Start the production server (after `build`)           |
| `npm run lint`            | ESLint                                                |
| `npm run lint:fix`        | ESLint with autofix                                   |
| `npm run typecheck`       | TypeScript strict type checking, no emit              |
| `npm run format`          | Prettier — write                                      |
| `npm run format:check`    | Prettier — check only (used in CI)                    |
| `npm run verify:supabase` | Confirms the configured Supabase project is reachable |

## Environment Variables

See `.env.example` for the full list and classification (public / server-only
/ secret). All environment access in application code goes through
`config/env.ts` (public) and `config/env.server.ts` (server-only) — never
`process.env` directly.

## Folder Structure

Follows the Phase 05 Project Architecture & Engineering Standards Blueprint
exactly. See that document for the rationale behind every directory.

## Git Hooks

Husky runs `lint-staged` (ESLint + Prettier on staged files) and a full
`typecheck` before every commit. A commit is blocked if either fails.
