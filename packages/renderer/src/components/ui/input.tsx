import type * as React from "react";
import { cn } from "../../lib/utils";

export function Input({
  className,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>): React.JSX.Element {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm text-slate-950 shadow-2xs placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
