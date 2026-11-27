# Project: Anchor

A stability + accessibility layer for AI-generated (dynamic) UIs. An LLM proposes
small PATCHES to a user's UI spec; deterministic gates (schema, a11y, stability/churn,
policy) approve or reject; a renderer shows the approved spec; every change is logged
with a reason and the user can pin or revert it.

## Stack

pnpm workspaces; Next.js (App Router) + React + TypeScript (strict); Tailwind + shadcn/ui;
TanStack Query; Zod; Prisma + Postgres (Neon); Vitest; Playwright + @axe-core/playwright;
ESLint + eslint-plugin-jsx-a11y; Prettier; GitHub Actions.
Install latest stable versions, then pin exact versions (pnpm add -E).
Follow the official docs of the installed version, not memory.

## Architecture rules

- packages/spec and packages/gates are pure TypeScript: no Prisma, Next.js, React or
  network imports. They must be testable in CI without a database.
- Only packages/db imports Prisma. Parse every spec read from or written to a Json
  column with UISpec.parse() inside the repository functions.
- Specs are typed JSON (Zod). Nodes have stable ids; layout uses named slots, not pixels.
- The LLM only returns patch ops (move | hide | restyle | add), validated by Zod.
  Never generate raw JSX or HTML.
- Pinned nodes never move. mustShow nodes are never hidden.

## Working rules

- Small tasks. For anything non-trivial, show a short plan and wait for my OK.
- Do NOT implement logic I mark as "mine" (spec diff, churn metric, gates). Create typed
  stubs that throw new Error("not implemented") with TODO comments.
- Tests first when behavior is specified. Never edit a test to make it pass without telling me.
- Run typecheck, lint and tests before saying a task is done, and show the output.
- Accessibility is a hard requirement: semantic HTML, labels, keyboard access,
  visible focus, sufficient contrast.
- No new dependencies without asking. No destructive shell commands, nothing outside this repo.
- Explain non-obvious code in 2-3 lines so I can learn from it.
