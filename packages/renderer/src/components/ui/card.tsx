import type * as React from "react";
import { cn } from "../../lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white text-slate-950 shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn("flex flex-col gap-1.5 p-4 pb-2", className)} {...props} />;
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>): React.JSX.Element {
  return (
    <h2
      className={cn(
        "text-base font-semibold leading-tight tracking-tight text-slate-950",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>): React.JSX.Element {
  return <p className={cn("text-sm text-slate-700", className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn("p-4 pt-2", className)} {...props} />;
}
