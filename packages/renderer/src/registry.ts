import {
  BadgeNode,
  ButtonNode,
  ChartNode,
  ConfirmDialogNode,
} from "./nodes/ActionNodes";
import {
  FilterBarNode,
  ReplyFormNode,
  StatCardNode,
  TicketTableNode,
} from "./nodes/TicketNodes";
import type { NodeRegistry } from "./types";

export const defaultNodeRegistry: NodeRegistry = {
  "stat-card": StatCardNode,
  "filter-bar": FilterBarNode,
  "ticket-table": TicketTableNode,
  "reply-form": ReplyFormNode,
  button: ButtonNode,
  badge: BadgeNode,
  chart: ChartNode,
  "confirm-dialog": ConfirmDialogNode,
};
