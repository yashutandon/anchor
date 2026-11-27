import { z } from "zod";

export const NodeType = z.enum([
  "ticket-table",
  "filter-bar",
  "stat-card",
  "button",
  "reply-form",
  "chart",
  "badge",
  "confirm-dialog",
]);

export type NodeType = z.infer<typeof NodeType>;

export const AnchorMode = z.enum(["pinned", "free"]);

export type AnchorMode = z.infer<typeof AnchorMode>;

export const A11yMeta = z.object({
  label: z.string(),
  role: z.string().optional(),
});

export type A11yMeta = z.infer<typeof A11yMeta>;

// Zod v4 drops single-argument z.record(), so the string key schema is explicit.
// Because mustShow uses .default(false), NodeInput allows omitting it while parsed Node always includes a boolean.
export const Node = z.object({
  id: z.string(),
  type: NodeType,
  props: z.record(z.string(), z.unknown()),
  slot: z.string(),
  anchor: AnchorMode,
  priority: z.number().min(0).max(3),
  a11y: A11yMeta,
  mustShow: z.boolean().default(false),
});

export type Node = z.infer<typeof Node>;
export type NodeInput = z.input<typeof Node>;

export const UISpec = z.object({
  version: z.number(),
  appId: z.string(),
  nodes: z.array(Node),
});

export type UISpec = z.infer<typeof UISpec>;
export type UISpecInput = z.input<typeof UISpec>;
