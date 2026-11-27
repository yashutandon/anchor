"use client";

import * as React from "react";

interface NodeErrorBoundaryProps {
  nodeId: string;
  nodeType: string;
  children: React.ReactNode;
}

interface NodeErrorBoundaryState {
  error: Error | null;
}

// Per-node ErrorBoundary isolates runtime crashes inside individual registry widgets
// so a single broken component degrades into an accessible alert instead of crashing the page.
export class NodeErrorBoundary extends React.Component<
  NodeErrorBoundaryProps,
  NodeErrorBoundaryState
> {
  override state: NodeErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): NodeErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error): void {
    // Keep failure visible during development while preserving sibling tree rendering.
    console.error(
      `[Anchor SpecRenderer] Node "${this.props.nodeId}" (${this.props.nodeType}) failed:`,
      error,
    );
  }

  override render(): React.ReactNode {
    if (this.state.error) {
      return (
        <div
          role="alert"
          data-node-id={this.props.nodeId}
          data-node-type={this.props.nodeType}
          className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-950"
        >
          <p className="font-semibold">
            Widget render error for node &ldquo;{this.props.nodeId}&rdquo; (
            {this.props.nodeType})
          </p>
          <p className="mt-1 text-xs text-red-900">{this.state.error.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export interface UnknownNodeFallbackProps {
  nodeId: string;
  nodeType: string;
  label?: string;
}

export function UnknownNodeFallback({
  nodeId,
  nodeType,
  label,
}: UnknownNodeFallbackProps): React.JSX.Element {
  return (
    <div
      role="alert"
      aria-label={label ?? `Unsupported node ${nodeId}`}
      data-node-id={nodeId}
      data-node-type={nodeType}
      className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
    >
      <p className="font-semibold">
        Unsupported node type: <code className="font-mono">{nodeType}</code>
      </p>
      <p className="mt-1 text-xs text-amber-900">
        Node <span className="font-mono">{nodeId}</span> has no registered component in
        @anchor/renderer.
      </p>
    </div>
  );
}
