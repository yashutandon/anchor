import type { SupportTicket } from "@anchor/renderer";

export const MOCK_TICKETS: readonly SupportTicket[] = [
  {
    id: "TCK-1042",
    subject: "SSO SAML metadata signature validation failing on login",
    customer: "Northwind Health",
    priority: "urgent",
    status: "escalated",
    assignee: "Maya Lin",
    updatedAt: "4m ago",
  },
  {
    id: "TCK-1041",
    subject: "CSV export drops UTF-8 customer names in billing report",
    customer: "Kestrel Logistics",
    priority: "high",
    status: "open",
    assignee: "Devon Patel",
    updatedAt: "18m ago",
  },
  {
    id: "TCK-1039",
    subject: "Webhook retry delay exceeds 5 minutes on EU-West cluster",
    customer: "Lumen Retail",
    priority: "high",
    status: "open",
    assignee: "Unassigned",
    updatedAt: "35m ago",
  },
  {
    id: "TCK-1037",
    subject: "Seat count update not reflected on annual invoice preview",
    customer: "Harbor Labs",
    priority: "medium",
    status: "pending",
    assignee: "Maya Lin",
    updatedAt: "1h ago",
  },
  {
    id: "TCK-1034",
    subject: "Need audit log export date range clarified for SOC2",
    customer: "Finch Capital",
    priority: "low",
    status: "resolved",
    assignee: "Samira Noor",
    updatedAt: "3h ago",
  },
];
