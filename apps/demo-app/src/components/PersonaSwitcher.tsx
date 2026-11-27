import Link from "next/link";
import type * as React from "react";
import { PERSONA_LIST, type PersonaId } from "../specs/personas";

export interface PersonaSwitcherProps {
  activePersona: PersonaId;
}

export function PersonaSwitcher({
  activePersona,
}: PersonaSwitcherProps): React.JSX.Element {
  return (
    <nav aria-label="Support persona switcher">
      <ul className="flex flex-wrap items-center gap-2">
        {PERSONA_LIST.map((persona) => {
          const isActive = persona.id === activePersona;
          return (
            <li key={persona.id}>
              <Link
                href={`/${persona.id}`}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "inline-flex items-center rounded-md bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                    : "inline-flex items-center rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                }
              >
                {persona.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
