"use client";

import { Pin } from "lucide-react";
import * as React from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Textarea } from "../components/ui/textarea";
import { useSpecRenderContext } from "../context";
import type { NodeRendererProps, SupportTicket } from "../types";
import { NodeFrame } from "./NodeFrame";

function readString(
  props: Record<string, unknown>,
  key: string,
  fallback: string,
): string {
  const value = props[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function readTickets(props: Record<string, unknown>): SupportTicket[] {
  const raw = props["tickets"];
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter(
    (item): item is SupportTicket =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>)["id"] === "string" &&
      typeof (item as Record<string, unknown>)["subject"] === "string",
  );
}

function priorityVariant(
  priority: SupportTicket["priority"],
): "destructive" | "warning" | "secondary" | "outline" {
  switch (priority) {
    case "urgent":
      return "destructive";
    case "high":
      return "warning";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
  }
}

function statusVariant(
  status: SupportTicket["status"],
): "default" | "success" | "warning" | "secondary" {
  switch (status) {
    case "escalated":
      return "warning";
    case "resolved":
      return "success";
    case "pending":
      return "secondary";
    case "open":
      return "default";
  }
}

export function StatCardNode({ node }: NodeRendererProps): React.JSX.Element {
  const title = readString(node.props, "title", node.a11y.label);
  const value = readString(node.props, "value", "0");
  const delta = readString(node.props, "delta", "");
  const helper = readString(node.props, "helper", "");

  return (
    <NodeFrame node={node}>
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium text-slate-700">
              {title}
            </CardTitle>
            {helper ? <CardDescription>{helper}</CardDescription> : null}
          </div>
          {node.anchor === "pinned" ? (
            <Badge variant="outline" className="gap-1">
              <Pin className="h-3 w-3" aria-hidden="true" />
              Pinned
            </Badge>
          ) : null}
        </CardHeader>
        <CardContent className="flex items-baseline justify-between gap-2">
          <p className="text-2xl font-bold tracking-tight text-slate-950">{value}</p>
          {delta ? <Badge variant="secondary">{delta}</Badge> : null}
        </CardContent>
      </Card>
    </NodeFrame>
  );
}

export function FilterBarNode({ node }: NodeRendererProps): React.JSX.Element {
  const ctx = useSpecRenderContext();
  const [localQuery, setLocalQuery] = React.useState("");
  const [localStatus, setLocalStatus] = React.useState("all");
  const searchInputId = React.useId();
  const statusSelectId = React.useId();

  const query = ctx ? ctx.searchQuery : localQuery;
  const setQuery = ctx ? ctx.setSearchQuery : setLocalQuery;
  const status = ctx ? ctx.statusFilter : localStatus;
  const setStatus = ctx ? ctx.setStatusFilter : setLocalStatus;

  const placeholder = readString(
    node.props,
    "placeholder",
    "Search ticket subject or ID...",
  );
  const showAdvanced = node.props["showAdvanced"] === true;

  return (
    <NodeFrame
      node={node}
      className="flex-1 rounded-lg border border-slate-200 bg-white p-3"
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-52 flex-1 space-y-1">
          <label
            htmlFor={searchInputId}
            className="block text-xs font-semibold text-slate-800"
          >
            Search tickets
          </label>
          <Input
            id={searchInputId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
        </div>
        <div className="w-40 space-y-1">
          <label
            htmlFor={statusSelectId}
            className="block text-xs font-semibold text-slate-800"
          >
            Ticket status
          </label>
          <select
            id={statusSelectId}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-sm text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        {showAdvanced ? (
          <Button
            variant="secondary"
            size="default"
            onClick={() => {
              setQuery("");
              setStatus("all");
              ctx?.notifyAction("Cleared all ticket filters.");
            }}
          >
            Reset filters
          </Button>
        ) : null}
      </div>
    </NodeFrame>
  );
}

export function TicketTableNode({ node }: NodeRendererProps): React.JSX.Element {
  const ctx = useSpecRenderContext();
  const propTickets = readTickets(node.props);
  const sourceTickets = propTickets.length > 0 ? propTickets : (ctx?.tickets ?? []);

  const title = readString(node.props, "title", "Ticket Queue");
  const showAssignee = node.props["showAssignee"] === true;

  const query = (ctx?.searchQuery ?? "").trim().toLowerCase();
  const statusFilter = ctx?.statusFilter ?? "all";

  const filteredTickets = sourceTickets.filter((ticket) => {
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesQuery =
      query.length === 0 ||
      ticket.id.toLowerCase().includes(query) ||
      ticket.subject.toLowerCase().includes(query) ||
      ticket.customer.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  return (
    <NodeFrame node={node}>
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              Showing {filteredTickets.length} of {sourceTickets.length} tickets
            </CardDescription>
          </div>
          {node.anchor === "pinned" ? (
            <Badge variant="outline" className="gap-1">
              <Pin className="h-3 w-3" aria-hidden="true" />
              Pinned
            </Badge>
          ) : null}
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>{title} entries</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Ticket</TableHead>
                <TableHead scope="col">Subject</TableHead>
                <TableHead scope="col">Customer</TableHead>
                <TableHead scope="col">Priority</TableHead>
                <TableHead scope="col">Status</TableHead>
                {showAssignee ? <TableHead scope="col">Assignee</TableHead> : null}
                <TableHead scope="col">Updated</TableHead>
                <TableHead scope="col">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={showAssignee ? 8 : 7}
                    className="py-6 text-center text-sm text-slate-700"
                  >
                    No tickets match the current filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => {
                  const isSelected = ctx?.selectedTicketId === ticket.id;
                  return (
                    <TableRow
                      key={ticket.id}
                      className={isSelected ? "bg-slate-100" : undefined}
                    >
                      <TableCell className="font-mono text-xs font-semibold text-slate-900">
                        {ticket.id}
                      </TableCell>
                      <TableCell className="font-medium text-slate-950">
                        {ticket.subject}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {ticket.customer}
                      </TableCell>
                      <TableCell>
                        <Badge variant={priorityVariant(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      {showAssignee ? (
                        <TableCell className="text-slate-700">
                          {ticket.assignee ?? "Unassigned"}
                        </TableCell>
                      ) : null}
                      <TableCell className="text-slate-700">
                        {ticket.updatedAt}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={isSelected ? "default" : "secondary"}
                          aria-pressed={isSelected}
                          onClick={() => {
                            ctx?.setSelectedTicketId(ticket.id);
                            ctx?.notifyAction(`Focused ${ticket.id}`);
                          }}
                        >
                          {isSelected ? "Selected" : "Inspect"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </NodeFrame>
  );
}

export function ReplyFormNode({ node }: NodeRendererProps): React.JSX.Element {
  const ctx = useSpecRenderContext();
  const [draft, setDraft] = React.useState("");
  const [submittedNotice, setSubmittedNotice] = React.useState<string | null>(null);
  const textareaId = React.useId();

  const title = readString(node.props, "title", "Quick Reply");
  const activeTicketId =
    ctx?.selectedTicketId ?? readString(node.props, "ticketId", "TCK-101");
  const placeholder = readString(
    node.props,
    "placeholder",
    "Write a clear, helpful customer update...",
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (draft.trim().length === 0) {
      setSubmittedNotice("Enter a message before sending.");
      return;
    }
    const confirmation = `Draft reply queued for ${activeTicketId}.`;
    setSubmittedNotice(confirmation);
    ctx?.notifyAction(confirmation);
    setDraft("");
  }

  return (
    <NodeFrame node={node}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Target ticket: <span className="font-mono">{activeTicketId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label
                htmlFor={textareaId}
                className="block text-xs font-semibold text-slate-800"
              >
                Reply message for {activeTicketId}
              </label>
              <Textarea
                id={textareaId}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={placeholder}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Button type="submit">Send reply</Button>
              {submittedNotice ? (
                <p role="status" className="text-xs font-medium text-slate-800">
                  {submittedNotice}
                </p>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </NodeFrame>
  );
}
