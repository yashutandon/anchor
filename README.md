# Anchor

A stability + accessibility layer for AI-generated (dynamic) UIs.

An LLM proposes small patches to a typed UI spec (`@anchor/spec`), deterministic gates (`@anchor/gates`) validate schema, accessibility, churn/stability, and policy invariants, and `@anchor/renderer` renders the approved spec into semantic, shadcn/ui-based React components.

## Workspace Layout

- `apps/demo-app`: Next.js (App Router) support-ticket dashboard rendering three hardcoded specs (`/novice`, `/senior`, `/manager`, with `/` redirecting to `/novice`) using mock data.
- `packages/spec`: Pure TypeScript Zod schemas (`Node`, `UISpec`), inferred types, and typed stubs for `diffSpecs` and `computeChurn` (`TODO`).
- `packages/gates`: Pure TypeScript deterministic gate stubs (`runSchemaGate`, `runA11yGate`, `runStabilityGate`, `runPolicyGate`, `runAllGates`) (`TODO`).
- `packages/renderer`: `<SpecRenderer />` mapping node types to accessible shadcn/ui components with named slots and per-node error boundaries.
- `packages/db`: Prisma 7 schema (`prisma/schema.prisma`), `prisma.config.ts`, and repository stubs enforcing `UISpec.parse()` at read/write boundaries (no migrations or live DB connection yet).

## Prerequisites

- Node.js 24+
- pnpm 11+

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy `.env.example` if configuring Prisma CLI locally (not required for running tests or the demo app):

   ```bash
   cp .env.example packages/db/.env
   ```

3. Generate Prisma Client types (no database connection or migration required):

   ```bash
   pnpm --filter @anchor/db db:generate
   ```

4. Install Playwright Chromium browser (first time only for E2E + axe tests):

   ```bash
   pnpm exec playwright install chromium
   ```

## Common Commands

- Start the demo app in dev mode:

  ```bash
  pnpm --filter demo-app dev
  ```

- Typecheck all workspaces:

  ```bash
  pnpm typecheck
  ```

- Lint (ESLint + `eslint-plugin-jsx-a11y`):

  ```bash
  pnpm lint
  ```

- Check formatting:

  ```bash
  pnpm format:check
  ```

- Run Vitest unit tests:

  ```bash
  pnpm test
  ```

- Build the demo app and run Playwright + `@axe-core/playwright` accessibility tests against the production build:

  ```bash
  pnpm build
  pnpm test:e2e
  ```
