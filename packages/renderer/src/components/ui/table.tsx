import type * as React from "react";
import { cn } from "../../lib/utils";

export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>): React.JSX.Element {
  return (
    <div className="relative w-full overflow-x-auto">
      <table
        className={cn("w-full caption-bottom text-sm text-slate-900", className)}
        {...props}
      />
    </div>
  );
}

export function TableCaption({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>): React.JSX.Element {
  return (
    <caption className={cn("mt-2 text-xs text-slate-700", className)} {...props} />
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element {
  return (
    <thead
      className={cn("border-b border-slate-200 bg-slate-50", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>): React.JSX.Element {
  return (
    <tr
      className={cn(
        "border-b border-slate-200 transition-colors hover:bg-slate-50",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>): React.JSX.Element {
  return (
    <th
      className={cn(
        "h-10 px-3 text-left align-middle text-xs font-semibold uppercase tracking-wide text-slate-700",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>): React.JSX.Element {
  return <td className={cn("p-3 align-middle", className)} {...props} />;
}
