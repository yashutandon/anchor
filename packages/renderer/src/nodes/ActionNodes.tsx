"use client";

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { useSpecRenderContext } from "../context";
import type { NodeRendererProps } from "../types";
import { NodeFrame } from "./NodeFrame";

function readString(
  props: Record<string, unknown>,
  key: string,
  fallback: string,
): string {
  const value = props[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

interface ChartDatum {
  label: string;
  value: number;
}

function readSeries(props: Record<string, unknown>): ChartDatum[] {
  const raw = props["series"];
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter(
    (entry): entry is ChartDatum =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as Record<string, unknown>)["label"] === "string" &&
      typeof (entry as Record<string, unknown>)["value"] === "number",
  );
}

export function ButtonNode({ node }: NodeRendererProps): React.JSX.Element {
  const ctx = useSpecRenderContext();
  const label = readString(node.props, "label", node.a11y.label);
  const rawVariant = readString(node.props, "variant", "default");
  const variant =
    rawVariant === "secondary" ||
    rawVariant === "destructive" ||
    rawVariant === "outline" ||
    rawVariant === "ghost"
      ? rawVariant
      : "default";

  return (
    <NodeFrame node={node} variant="group">
      <Button
        variant={variant}
        onClick={() => ctx?.notifyAction(`Triggered action: ${label}`)}
      >
        {label}
      </Button>
    </NodeFrame>
  );
}

export function BadgeNode({ node }: NodeRendererProps): React.JSX.Element {
  const text = readString(node.props, "text", node.a11y.label);
  const rawTone = readString(node.props, "tone", "secondary");
  const variant =
    rawTone === "default" ||
    rawTone === "success" ||
    rawTone === "warning" ||
    rawTone === "destructive" ||
    rawTone === "outline"
      ? rawTone
      : "secondary";

  return (
    <NodeFrame node={node} variant="group">
      <Badge variant={variant}>{text}</Badge>
    </NodeFrame>
  );
}

export function ChartNode({ node }: NodeRendererProps): React.JSX.Element {
  const title = readString(node.props, "title", node.a11y.label);
  const subtitle = readString(node.props, "subtitle", "Live queue distribution");
  const series = readSeries(node.props);
  const maxValue = Math.max(1, ...series.map((item) => item.value));

  return (
    <NodeFrame node={node}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {series.map((item) => {
              const widthPercent = Math.round((item.value / maxValue) * 100);
              return (
                <li key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-900">
                    <span>{item.label}</span>
                    <span className="font-mono">{item.value}</span>
                  </div>
                  <div
                    className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </NodeFrame>
  );
}

export function ConfirmDialogNode({ node }: NodeRendererProps): React.JSX.Element {
  const ctx = useSpecRenderContext();
  const [open, setOpen] = React.useState(false);

  const triggerLabel = readString(node.props, "triggerLabel", "Escalate Ticket");
  const title = readString(node.props, "title", "Confirm ticket escalation");
  const description = readString(
    node.props,
    "description",
    "This reassigns the active ticket to the Tier 2 incident queue.",
  );
  const confirmLabel = readString(node.props, "confirmLabel", "Confirm");

  return (
    <NodeFrame node={node} variant="group">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">{triggerLabel}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                ctx?.notifyAction(
                  `Confirmed: ${title} (${ctx.selectedTicketId ?? "queue"})`,
                );
                setOpen(false);
              }}
            >
              {confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NodeFrame>
  );
}
