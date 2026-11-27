"use client";

import { Dialog as RadixDialog } from "radix-ui";
import type * as React from "react";
import { cn } from "../../lib/utils";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixDialog.Content>): React.JSX.Element {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-50 bg-slate-950/50" />
      <RadixDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white p-6 text-slate-950 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950",
          className,
        )}
        {...props}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div className={cn("flex flex-col gap-1.5 text-left", className)} {...props} />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixDialog.Title>): React.JSX.Element {
  return (
    <RadixDialog.Title
      className={cn("text-lg font-semibold text-slate-950", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixDialog.Description>): React.JSX.Element {
  return (
    <RadixDialog.Description
      className={cn("text-sm text-slate-700", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn("mt-4 flex justify-end gap-2", className)} {...props} />;
}
