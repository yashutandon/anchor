# Anchor — AI Project Context & Architecture Reference

> Feed this file to an AI assistant alongside [system.md](system.md) and [AGENTS.md](AGENTS.md) before asking it to plan or write code in this repository.

## 1. Project Summary

**Anchor** is a stability and accessibility layer for AI-adapted user interfaces. An LLM proposes small typed JSON patch operations (`move | hide | restyle | add`) against a user's `UISpec`. Deterministic gates (`schema`, `a11y`, `stability`, `policy`) approve or reject each candidate before it is stored and rendered into semantic, accessible React components via named layout slots, with full decision logging and user `pin` / `revert` controls. The LLM never generates raw JSX or HTML.

### Phase Plan

**Current phase**: **Phase 1** (spec core: patch schemas, `applyPatch`, `diffSpecs`, `computeChurn`).

1. **Phase 1 — Spec core**: `PatchOp` Zod schemas (`move | hide | restyle | add`), `applyPatch`, `diffSpecs`, `computeChurn` (`packages/spec`). Patch op schemas belong to Phase 1, not the AI generator phase.
2. **Phase 2 — Gates**: Deterministic `schema`, `a11y`, `stability`, and `policy` gates + `runAllGates` (`packages/gates`).
3. **Phase 3 — Pipeline + DB + Pin/Revert UI**: End-to-end `parsePatch -> applyPatch -> gates -> renderer` pipeline, Prisma/Postgres persistence (`packages/db`), TanStack Query wiring, and pin/revert controls.
4. **Phase 4 — AI generator**: Constrained LLM patch proposal package (`generator`) with retries, timeouts, and cost caps.
5. **Phase 5 — Simulation + Evals**: Synthetic user simulation (`sim`) and automated evaluation harness (`evals`).
6. **Phase 6 — Polish**: Hardening, accessibility audit, and documentation polish.

---

## 2. Readiness & Completion Matrix

| Area                        | Status                       | What Exists Now                                                                                                                                                                              | What Remains                                                                                                                                    |
| :-------------------------- | :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo & Tooling          | **Ready**                    | `pnpm@11.0.8` workspaces, strict TS (`6.0.3`), ESLint 9 + `jsx-a11y` strict, Prettier, Vitest 5, Playwright + `@axe-core/playwright`, GitHub Actions CI                                      | Ongoing maintenance per phase                                                                                                                   |
| `@anchor/spec`              | **Phase 1 in progress**      | `Node`, `UISpec`, `NodeType`, `AnchorMode`, `A11yMeta` Zod v4 schemas + inferred types; typed stubs for `diffSpecs` & `computeChurn`; 12 `it.todo` tests                                     | Phase 1: `PatchOp` Zod schemas (`move \| hide \| restyle \| add`), `applyPatch`, owner-implemented `diffSpecs` & `computeChurn`, and unit tests |
| `@anchor/gates`             | **Stubbed (Phase 2)**        | Pure TS contracts (`GateName`, `GateInput`, `GateDecision`, `GateSuiteResult`), 5 stub functions throwing `"not implemented"`, 5 `it.todo` tests                                             | Phase 2: implement `runSchemaGate`, `runA11yGate`, `runStabilityGate`, `runPolicyGate`, `runAllGates`, and unit tests                           |
| `@anchor/renderer`          | **Ready (Base renderer)**    | `<SpecRenderer />`, shadcn/ui-styled primitives, registry for all 8 node types, named slot layout, per-node `NodeErrorBoundary`, `UnknownNodeFallback`, interactive context, 3 passing tests | Phase 3: pin/revert controls and adaptation/diff inspection UI                                                                                  |
| `@anchor/db`                | **Schema + Stubs (Phase 3)** | Prisma 7 config + 6-model PostgreSQL schema, generated client types, `.env.example`, `parseSpecColumn()` + 8 repository stubs, 3 `it.todo` tests                                             | Phase 3: wire driver adapter (`@prisma/adapter-pg` / Neon), run migrations against Postgres, implement tenant-scoped repository queries         |
| `apps/demo-app`             | **Ready (Mock data)**        | Next.js 16 App Router dashboard, `/` → `/novice`, static `/novice`, `/senior`, `/manager`, accessible 404 (`not-found.tsx`), persona switcher, Tailwind v4 `@source`                         | Phase 3+: connect API pipeline, TanStack Query, and DB-backed specs                                                                             |
| `generator`, `sim`, `evals` | **Not started (Phases 4–5)** | Intentionally excluded from current scaffold                                                                                                                                                 | Phase 4 (`generator`) and Phase 5 (`sim`, `evals`)                                                                                              |

---

## 3. Rules, Ownership & Architecture Invariants

### Rule Priority

1. The owner's explicit instruction in the current chat wins (unless it conflicts with security or honesty rules in [system.md](system.md), in which case flag the risk and ask for explicit confirmation).
2. [system.md](system.md) — top operating rules file after the owner's instructions.
3. [AGENTS.md](AGENTS.md) — project stack, architecture summary, and working rules.
4. [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) — this architectural reference.

### Ownership (`system.md` Section 2)

- **Owner-implemented (protected stubs)**: `diffSpecs`, `computeChurn`, and every function in `packages/gates`. **Do not implement them**; keep them throwing `new Error("not implemented")` with a `TODO` comment unless the owner explicitly asks in the current chat. You may write tests, types, and reviews for them and suggest edge cases.
- **AI-implementable (after owner plan approval)**: patch schemas (`PatchOp`), `applyPatch`, renderer, demo app, tooling, DB plumbing, docs.
- **Protected rule/CI files**: Never change `AGENTS.md`, `system.md`, or CI permissions without asking.

### Architecture Invariants (`system.md` Section 3)

1. **Pure domain packages**: `packages/spec` and `packages/gates` are pure TypeScript — no Prisma, Next.js, React, filesystem, network, or env access, and no `Date.now()` or `Math.random()` (pass time and randomness in as parameters).
2. **Database isolation & boundary parsing**: Only `packages/db` imports Prisma, and its public API uses types from `@anchor/spec`, never Prisma-generated types. Every spec or patch crossing a boundary (DB `Json` column, LLM output, HTTP, URL params, env) is parsed with Zod first. Every DB query is scoped to a tenant and user (no cross-tenant reads).
3. **Fixed pipeline order**: `parsePatch -> applyPatch -> gates -> renderer`. Never skip a step, and never render a spec that has not passed all gates. If any gate fails, the last safe spec stays live.
4. **Patch & policy separation**: `applyPatch` handles mechanics only (unknown node, duplicate ID). No patch op can change `anchor`, `mustShow`, or `a11y` of an existing node; patches cannot unpin; nodes added by a patch are always `anchor: "free"`, `mustShow: false`. Gates enforce policy (`pinned` nodes never move, `mustShow` nodes are never hidden, churn budget).
5. **Layout & accessibility**: Layout uses named slots (never pixels). Semantic HTML, explicit labels, keyboard operation, visible focus, WCAG AA contrast, and zero `@axe-core/playwright` violations are mandatory.
6. **Code quality & dependencies**: TypeScript strict (no `any`, `@ts-ignore`, `@ts-expect-error`, non-null `!`, or unchecked `as` casts). Ask before adding dependencies; pin exact versions (`pnpm add -E`); never approve build scripts without asking.

---

## 4. Repository Structure

```text
anchor/
├── .env.example                          # Placeholder DATABASE_URL for Neon/Postgres
├── .github/workflows/ci.yml              # CI: install -> db:generate -> typecheck -> lint -> test -> build -> playwright
├── .gitignore                            # Ignores node_modules, .next, dist, .env*, generated Prisma, agent skill dirs, test artifacts
├── .prettierignore
├── .prettierrc.json
├── AGENTS.md                             # Points to system.md; stack & working rules
├── PROJECT_CONTEXT.md                    # This AI handoff & architecture document
├── README.md                             # Local setup & command reference
├── system.md                             # Top operating rules file (priority, ownership, invariants, security, quality)
├── eslint.config.mjs                     # ESLint 9 flat config (@eslint/js + typescript-eslint + jsx-a11y strict)
├── package.json                          # Root scripts (typecheck, lint, format, test, build, test:e2e)
├── playwright.config.ts                  # Runs Chromium against production `next start` on 127.0.0.1:3000
├── pnpm-lock.yaml
├── pnpm-workspace.yaml                   # Workspaces (apps/*, packages/*) + allowBuilds for Prisma
├── tsconfig.base.json                    # Shared strict TS config (ES2022, ESNext, Bundler, strict, noUncheckedIndexedAccess)
├── vitest.config.ts                      # Vitest workspace config (`projects: ["packages/*"]`)
├── e2e/
│   └── personas.spec.ts                  # E2E + @axe-core/playwright tests for /, /novice, /senior, /manager, /abc (404)
├── apps/
│   └── demo-app/                         # Next.js 16 App Router demo dashboard (`demo-app`)
│       ├── components.json               # shadcn/ui metadata (Tailwind v4 mode)
│       ├── next.config.ts                # `transpilePackages: ["@anchor/spec", "@anchor/renderer"]`
│       ├── package.json
│       ├── postcss.config.mjs            # `@tailwindcss/postcss`
│       ├── tsconfig.json
│       └── src/
│           ├── app/
│           │   ├── [persona]/page.tsx    # Static params (novice, senior, manager); calls notFound() otherwise
│           │   ├── globals.css           # `@import "tailwindcss";` + `@source "../../../../packages/renderer/src";`
│           │   ├── layout.tsx            # Root HTML (`lang="en"`) and metadata
│           │   ├── not-found.tsx         # Accessible 404 page with link back to /novice
│           │   └── page.tsx              # Redirects `/` -> `/novice`
│           ├── components/
│           │   ├── DashboardShell.tsx    # Skip link, header, persona metadata, `<main>`, `<SpecRenderer />`
│           │   └── PersonaSwitcher.tsx   # Accessible `<nav>` links with `aria-current="page"`
│           ├── data/
│           │   └── tickets.ts            # 5 mock support tickets (`MOCK_TICKETS`)
│           └── specs/
│               └── personas.ts           # 3 UISpec.parse()-validated specs (`PERSONA_CONFIGS`, `PERSONA_LIST`, `isPersonaId`)
└── packages/
    ├── spec/                             # Pure TS Zod schemas & Phase 1 stubs (`@anchor/spec`)
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── vitest.config.ts
    │   └── src/
    │       ├── churn.test.ts             # 3 it.todo tests
    │       ├── churn.ts                  # Protected stub: `computeChurn(prev, next, opts?)`
    │       ├── diff.test.ts              # 4 it.todo tests
    │       ├── diff.ts                   # Protected stub: `diffSpecs(prev, next)`
    │       ├── index.ts
    │       ├── schema.test.ts            # 5 it.todo tests
    │       └── schema.ts                 # `NodeType`, `AnchorMode`, `A11yMeta`, `Node`, `UISpec` + inferred types
    ├── gates/                            # Pure TS gate pipeline stubs (`@anchor/gates`)
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── vitest.config.ts
    │   └── src/
    │       ├── gates.test.ts             # 5 it.todo tests
    │       ├── gates.ts                  # Protected stubs: `runSchemaGate`, `runA11yGate`, `runStabilityGate`, `runPolicyGate`, `runAllGates`
    │       ├── index.ts
    │       └── types.ts                  # `GateName`, `GateInput`, `GateDecision`, `GateSuiteResult`
    ├── renderer/                         # React + shadcn/ui spec renderer (`@anchor/renderer`)
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── vitest.config.ts
    │   └── src/
    │       ├── NodeErrorBoundary.tsx     # Per-node React ErrorBoundary + `UnknownNodeFallback`
    │       ├── SpecRenderer.test.tsx     # 3 passing unit tests (all node types, unknown fallback, throwing isolation)
    │       ├── SpecRenderer.tsx          # Named-slot renderer, priority sorting, registry merge, `SpecRenderProvider`
    │       ├── context.tsx               # Shared search, status filter, selected ticket ID, live action banner
    │       ├── index.ts
    │       ├── registry.ts               # `defaultNodeRegistry` mapping all 8 `NodeType`s
    │       ├── test-setup.ts             # `@testing-library/jest-dom/vitest` + `cleanup()`
    │       ├── types.ts                  # `SupportTicket`, `NodeRendererProps`, `NodeComponent`, `NodeRegistry`
    │       ├── lib/utils.ts              # `cn()` (`clsx` + `tailwind-merge`)
    │       ├── components/ui/            # `badge.tsx`, `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `table.tsx`, `textarea.tsx`
    │       └── nodes/
    │           ├── ActionNodes.tsx       # `ButtonNode`, `BadgeNode`, `ChartNode`, `ConfirmDialogNode`
    │           ├── NodeFrame.tsx         # Applies `a11y.label`, `a11y.role`, `data-*` attributes
    │           └── TicketNodes.tsx       # `StatCardNode`, `FilterBarNode`, `TicketTableNode`, `ReplyFormNode`
    └── db/                               # Prisma 7 schema & repository stubs (`@anchor/db`)
        ├── .env.example
        ├── package.json                  # Includes `"db:generate": "prisma generate --no-hints"`
        ├── prisma.config.ts              # Prisma 7 config reading `DATABASE_URL` with offline fallback
        ├── tsconfig.json                 # Enables `allowImportingTsExtensions: true` for Prisma 7 generated `.ts` imports
        ├── vitest.config.ts
        ├── prisma/schema.prisma          # Models: `Tenant`, `EndUser`, `UiSpec`, `Adaptation`, `GateResult`, `Pin`
        └── src/
            ├── client.ts                 # `DbClient` type + `getPrismaClient()` stub
            ├── generated/prisma/         # Gitignored generated Prisma Client (created by `db:generate`)
            ├── index.ts
            ├── repositories.test.ts      # 3 it.todo tests
            └── repositories.ts           # `parseSpecColumn()` + 8 repository stubs
```

---

## 5. Key APIs, Schemas & Contracts

### `@anchor/spec` (`packages/spec/src/schema.ts`)

- **Node types**: `"ticket-table"`, `"filter-bar"`, `"stat-card"`, `"button"`, `"reply-form"`, `"chart"`, `"badge"`, `"confirm-dialog"`.
- **`Node` fields**:
  - `id: string`
  - `type: NodeType`
  - `props: Record<string, unknown>` (Zod v4 `z.record(z.string(), z.unknown())`)
  - `slot: string`
  - `anchor: "pinned" | "free"`
  - `priority: number` (`0`..`3`)
  - `a11y: { label: string; role?: string }`
  - `mustShow: boolean` (`.default(false)`)
- **`UISpec` fields**: `{ version: number; appId: string; nodes: Node[] }`.

### `@anchor/renderer` (`packages/renderer/src/SpecRenderer.tsx`)

- **Props**: `<SpecRenderer spec={UISpec} tickets?={SupportTicket[]} registry?={Partial<NodeRegistry>} />`.
- **Slot layout order**: `header` → `metrics` (1–3 col grid) → `toolbar` → `main` + `sidebar` (12-col grid, `lg:col-span-8` / `lg:col-span-4`, expands to 12 cols if one is empty) → `footer` → any unrecognized custom slot names.
- **Within-slot ordering**: Sorted descending by `node.priority` (`3` first).
- **Accessibility invariants**:
  - Every node wraps in `NodeFrame` (`<section aria-label={node.a11y.label}>` for panels, `<div role={node.a11y.role ?? "group"} aria-label={node.a11y.label}>` for inline widgets).
  - Inner controls use distinct accessible names (`<label htmlFor>` via `useId()`, `<caption>`, `<th scope="col">`, Radix `DialogTitle` + `DialogDescription`) so Testing Library `getByLabelText(node.a11y.label)` uniquely resolves one element per node and `axe-core` finds zero violations.

### `@anchor/db` (`packages/db/prisma/schema.prisma`)

- **Models**:
  - `Tenant` (`id`, `name`, `users`)
  - `EndUser` (`id`, `tenantId`, `persona` `novice | senior | manager`, `specs`, `pins`)
  - `UiSpec` (`id`, `endUserId`, `taskKey`, `version`, `parentVersion?`, `spec Json`, `status` `candidate | live | rejected | reverted`, `createdAt`, `@@unique([endUserId, taskKey, version])`)
  - `Adaptation` (`id`, `specId @unique`, `trigger` `session_start | frustration | user_request`, `decisionLog Json`, `churn Float`)
  - `GateResult` (`id`, `specId`, `gate` `schema | a11y | stability | policy`, `passed Boolean`, `details Json`)
  - `Pin` (`id`, `endUserId`, `nodeId`, `@@unique([endUserId, nodeId])`)

---

## 6. Version-Specific Quirks Already Handled

1. **Tailwind v4 monorepo scanning**: Sibling workspace packages are ignored by default; `apps/demo-app/src/app/globals.css` includes `@source "../../../../packages/renderer/src";`.
2. **Zod v4 `z.record()`**: Single-argument `z.record(value)` was removed in Zod v4; `schema.ts` uses `z.record(z.string(), z.unknown())`.
3. **Prisma v7 generator & config**: `schema.prisma` omits `url` from `datasource db` and moves it to `prisma.config.ts`. The `prisma-client` generator outputs `.ts` files with `.ts` import extensions, so `packages/db/tsconfig.json` enables `allowImportingTsExtensions: true`. Always run `prisma generate --no-hints` so Prisma does not prompt/install `.agents`/`.claude`/`.windsurf` skill folders.
4. **ESLint 9 vs 10 compatibility**: Root `eslint` (`9.39.5`) and `@eslint/js` (`9.39.5`) are pinned to v9 because `eslint-plugin-jsx-a11y@6.10.2` and `eslint-config-next@16.4.6` require ESLint 9. Root `typescript` (`6.0.3`) satisfies `typescript-eslint@8.74.0` (`<6.1.0`).
5. **pnpm 11 build approvals**: `pnpm-workspace.yaml` defines `allowBuilds` for `@prisma/engines` and `prisma`.

---

## 7. Commands & Verification

### Standard Commands

```bash
pnpm --filter @anchor/db db:generate   # Generate Prisma Client types (run after fresh install)
pnpm typecheck                         # Typecheck all 5 TypeScript projects
pnpm lint                              # ESLint + jsx-a11y strict across repo
pnpm format:check                      # Prettier check
pnpm test                              # Vitest workspace tests
pnpm build                             # Production Next.js build of apps/demo-app
pnpm test:e2e                          # Playwright + axe against production `next start`
```

### Verification Baseline

- `pnpm typecheck` (`spec`, `db`, `gates`, `renderer`, `demo-app`): passing
- `pnpm lint` (`eslint .`): passing (0 errors, 0 warnings)
- `pnpm format:check` (`prettier --check .`): passing
- `pnpm test` (`vitest run`): passing (`3 passed` in `@anchor/renderer`, `20 todo` across `@anchor/spec`, `@anchor/gates`, `@anchor/db`)
- `pnpm build` (`next build`): passing (SSG `/novice`, `/senior`, `/manager`, static `/`, `/_not-found`)
- `pnpm test:e2e` (`playwright test`): passing (`6 passed` in Chromium — `/` redirect, `/novice`, `/senior`, `/manager`, persona switcher navigation, and `/abc` returning 404, all with zero `@axe-core/playwright` violations)
