# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Project: 성림교구 (Sunglim Educational Supply) Website

A modern website rebuild for (주)성림교구, an educational supplies company.

### Pages
- `/` - Home: Hero, product categories, company overview, contact CTA
- `/company` - Company intro, CEO greeting, values/certifications
- `/products` - Product grid with category filter (교구/교재, 학용품, 체육용품, 학교가구)
- `/contact` - Contact form + two office location maps
- `/admin/contacts` - Admin view for contact submissions

### Company Info
- 서울 본사: 서울특별시 은평구 역촌동 34, Tel: 02-383-5181, Fax: 02-383-5183
- 경기 창고: 경기도 고양시 덕양구 행신동 46-3

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── sunglim/            # React + Vite frontend (성림교구 website)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/sunglim` (`@workspace/sunglim`)

React + Vite frontend for 성림교구 website.

- Entry: `src/main.tsx`
- App: `src/App.tsx` — routing with wouter, served at `/`
- Pages: `src/pages/` — Home, Company, Products, Contact, admin/ContactList
- Components: `src/components/layout/` — Navbar, Footer, Layout

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` health check; `src/routes/contact.ts` contact form API
- Depends on: `@workspace/db`, `@workspace/api-zod`

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

- `src/schema/contacts.ts` — contacts table for customer inquiries

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec with endpoints:
- `GET /api/healthz`
- `POST /api/contact`
- `GET /api/contact/list`

Run codegen: `pnpm --filter @workspace/api-spec run codegen`
