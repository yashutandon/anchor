"use client";

import type { Node, UISpec } from "@anchor/spec";
import * as React from "react";
import { SpecRenderProvider, useSpecRenderContext } from "./context";
import { NodeErrorBoundary, UnknownNodeFallback } from "./NodeErrorBoundary";
import { defaultNodeRegistry } from "./registry";
import type { NodeComponent, NodeRegistry, SupportTicket } from "./types";

const ORDERED_SLOTS = [
  "header",
  "metrics",
  "toolbar",
  "main",
  "sidebar",
  "footer",
] as const;

export interface SpecRendererProps {
  spec: UISpec;
  tickets?: readonly SupportTicket[];
  registry?: Partial<NodeRegistry>;
}

function groupNodesBySlot(nodes: readonly Node[]): Map<string, Node[]> {
  const grouped = new Map<string, Node[]>();
  for (const node of nodes) {
    const existing = grouped.get(node.slot);
    if (existing) {
      existing.push(node);
    } else {
      grouped.set(node.slot, [node]);
    }
  }

  // Sort nodes within each named slot by priority descending (3 = highest).
  for (const [slotName, slotNodes] of grouped.entries()) {
    grouped.set(
      slotName,
      [...slotNodes].sort((a, b) => b.priority - a.priority),
    );
  }
  return grouped;
}

function renderNode(
  node: Node,
  mergedRegistry: Record<string, NodeComponent | undefined>,
): React.JSX.Element {
  const Component = mergedRegistry[node.type];
  if (!Component) {
    return (
      <UnknownNodeFallback
        key={node.id}
        nodeId={node.id}
        nodeType={String(node.type)}
        label={node.a11y?.label}
      />
    );
  }

  return (
    <NodeErrorBoundary key={node.id} nodeId={node.id} nodeType={String(node.type)}>
      <Component node={node} />
    </NodeErrorBoundary>
  );
}

function LiveActionBanner(): React.JSX.Element | null {
  const ctx = useSpecRenderContext();
  if (!ctx?.lastActionMessage) {
    return null;
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-900"
    >
      {ctx.lastActionMessage}
    </div>
  );
}

export function SpecRenderer({
  spec,
  tickets = [],
  registry,
}: SpecRendererProps): React.JSX.Element {
  const mergedRegistry = React.useMemo<Record<string, NodeComponent | undefined>>(
    () => ({ ...defaultNodeRegistry, ...registry }),
    [registry],
  );

  const slotMap = React.useMemo(() => groupNodesBySlot(spec.nodes), [spec.nodes]);

  const headerNodes = slotMap.get("header") ?? [];
  const metricNodes = slotMap.get("metrics") ?? [];
  const toolbarNodes = slotMap.get("toolbar") ?? [];
  const mainNodes = slotMap.get("main") ?? [];
  const sidebarNodes = slotMap.get("sidebar") ?? [];
  const footerNodes = slotMap.get("footer") ?? [];

  const knownSet = new Set<string>(ORDERED_SLOTS);
  const extraSlots = [...slotMap.entries()].filter(
    ([slotName]) => !knownSet.has(slotName),
  );

  return (
    <SpecRenderProvider initialTickets={tickets}>
      <div
        data-app-id={spec.appId}
        data-spec-version={spec.version}
        className="space-y-6"
      >
        <LiveActionBanner />

        {headerNodes.length > 0 ? (
          <div
            data-slot="header"
            className="flex flex-wrap items-center justify-between gap-3"
          >
            {headerNodes.map((node) => renderNode(node, mergedRegistry))}
          </div>
        ) : null}

        {metricNodes.length > 0 ? (
          <div
            data-slot="metrics"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {metricNodes.map((node) => renderNode(node, mergedRegistry))}
          </div>
        ) : null}

        {toolbarNodes.length > 0 ? (
          <div
            data-slot="toolbar"
            className="flex flex-wrap items-center justify-between gap-3"
          >
            {toolbarNodes.map((node) => renderNode(node, mergedRegistry))}
          </div>
        ) : null}

        {mainNodes.length > 0 || sidebarNodes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {mainNodes.length > 0 ? (
              <div
                data-slot="main"
                className={
                  sidebarNodes.length > 0
                    ? "space-y-6 lg:col-span-8"
                    : "space-y-6 lg:col-span-12"
                }
              >
                {mainNodes.map((node) => renderNode(node, mergedRegistry))}
              </div>
            ) : null}
            {sidebarNodes.length > 0 ? (
              <div
                data-slot="sidebar"
                className={
                  mainNodes.length > 0
                    ? "space-y-6 lg:col-span-4"
                    : "space-y-6 lg:col-span-12"
                }
              >
                {sidebarNodes.map((node) => renderNode(node, mergedRegistry))}
              </div>
            ) : null}
          </div>
        ) : null}

        {footerNodes.length > 0 ? (
          <div
            data-slot="footer"
            className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4"
          >
            {footerNodes.map((node) => renderNode(node, mergedRegistry))}
          </div>
        ) : null}

        {extraSlots.map(([slotName, nodes]) => (
          <div key={slotName} data-slot={slotName} className="space-y-4">
            {nodes.map((node) => renderNode(node, mergedRegistry))}
          </div>
        ))}
      </div>
    </SpecRenderProvider>
  );
}
