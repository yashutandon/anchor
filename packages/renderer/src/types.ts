import type { Node, NodeType } from "@anchor/spec";
import type * as React from "react";

export interface SupportTicket {
  id: string;
  subject: string;
  customer: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "pending" | "escalated" | "resolved";
  assignee?: string;
  updatedAt: string;
}

export interface NodeRendererProps {
  node: Node;
}

export type NodeComponent = React.ComponentType<NodeRendererProps>;

export type NodeRegistry = Record<NodeType, NodeComponent>;
