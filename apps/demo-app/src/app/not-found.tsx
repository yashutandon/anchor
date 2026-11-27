import Link from "next/link";
import type * as React from "react";

export default function NotFoundPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <main
        id="main-content"
        className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-16 sm:px-6"
      >
        <span className="inline-flex items-center rounded-md bg-slate-900 px-2 py-0.5 text-xs font-semibold tracking-wide text-white uppercase">
          404
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Persona not found
        </h1>
        <p className="text-sm text-slate-700">
          The requested dashboard persona does not exist. Choose one of the supported
          personas to continue.
        </p>
        <Link
          href="/novice"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
        >
          Return to Novice Agent dashboard
        </Link>
      </main>
    </div>
  );
}
