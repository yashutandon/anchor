import type { Node } from "@anchor/spec";
import type * as React from "react";
import { cn } from "../lib/utils";

export interface NodeFrameProps {
  node: Node;
  variant?: "region" | "group";
  className?: string;
  children: React.ReactNode;
}

// NodeFrame guarantees every rendered node surfaces its a11y.label and optional role
// while keeping interactive child labels distinct to avoid ambiguous Testing Library queries.
export function NodeFrame({
  node,
  variant = "region",
  className,
  children,
}: NodeFrameProps): React.JSX.Element {
  const sharedProps = {
    "aria-label": node.a11y.label,
    "data-node-id": node.id,
    "data-node-type": node.type,
    "data-slot": node.slot,
    "data-anchor": node.anchor,
    className: cn("min-w-0", className),
  };

  if (variant === "group") {
    return (
      <div role={node.a11y.role ?? "group"} {...sharedProps}>
        {children}
      </div>
    );
  }

  return (
    <section role={node.a11y.role} {...sharedProps}>
      {children}
    </section>
  );
}
