import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-slate-900 text-white",
        secondary: "border-slate-300 bg-slate-100 text-slate-900",
        success: "border-emerald-300 bg-emerald-100 text-emerald-950",
        warning: "border-amber-300 bg-amber-100 text-amber-950",
        destructive: "border-red-300 bg-red-100 text-red-950",
        outline: "border-slate-300 bg-white text-slate-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps): React.JSX.Element {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
