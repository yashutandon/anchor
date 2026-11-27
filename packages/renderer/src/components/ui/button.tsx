import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        secondary: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100",
        destructive: "bg-red-700 text-white hover:bg-red-800",
        outline:
          "border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100",
        ghost: "text-slate-900 hover:bg-slate-100",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  type = "button",
  ...props
}: ButtonProps): React.JSX.Element {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
