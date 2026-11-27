import { SpecRenderer } from "@anchor/renderer";
import type * as React from "react";
import { MOCK_TICKETS } from "../data/tickets";
import type { PersonaConfig } from "../specs/personas";
import { PersonaSwitcher } from "./PersonaSwitcher";

export interface DashboardShellProps {
  persona: PersonaConfig;
}

export function DashboardShell({ persona }: DashboardShellProps): React.JSX.Element {
  const pinnedCount = persona.spec.nodes.filter(
    (node) => node.anchor === "pinned",
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to dashboard content
        </a>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-slate-900 px-2 py-0.5 text-xs font-semibold tracking-wide text-white uppercase">
                Anchor
              </span>
              <span className="text-xs font-medium text-slate-700">
                spec {persona.spec.appId} &middot; v{persona.spec.version} &middot;{" "}
                {persona.spec.nodes.length} nodes ({pinnedCount} pinned)
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Support Ticket Dashboard &mdash; {persona.roleTitle}
            </h1>
            <p className="text-sm text-slate-700">{persona.description}</p>
          </div>
          <PersonaSwitcher activePersona={persona.id} />
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SpecRenderer spec={persona.spec} tickets={MOCK_TICKETS} />
      </main>
    </div>
  );
}
