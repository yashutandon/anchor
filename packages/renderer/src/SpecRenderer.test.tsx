import type { UISpec } from "@anchor/spec";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SpecRenderer } from "./SpecRenderer";

function makeFullSpec(): UISpec {
  return {
    version: 1,
    appId: "support-desk-test",
    nodes: [
      {
        id: "node-stat",
        type: "stat-card",
        slot: "metrics",
        anchor: "pinned",
        priority: 3,
        mustShow: true,
        a11y: { label: "Open tickets summary" },
        props: { title: "Open Tickets", value: "24", delta: "-3 today" },
      },
      {
        id: "node-filter",
        type: "filter-bar",
        slot: "toolbar",
        anchor: "pinned",
        priority: 3,
        mustShow: true,
        a11y: { label: "Ticket search and status filters", role: "search" },
        props: { placeholder: "Search tickets" },
      },
      {
        id: "node-table",
        type: "ticket-table",
        slot: "main",
        anchor: "pinned",
        priority: 3,
        mustShow: true,
        a11y: { label: "Support ticket queue" },
        props: {
          tickets: [
            {
              id: "TCK-101",
              subject: "Cannot export invoice PDF",
              customer: "Acme Co",
              priority: "high",
              status: "open",
              updatedAt: "5m ago",
            },
          ],
        },
      },
      {
        id: "node-button",
        type: "button",
        slot: "toolbar",
        anchor: "free",
        priority: 2,
        mustShow: false,
        a11y: { label: "Assign next ticket" },
        props: { label: "Assign next ticket" },
      },
      {
        id: "node-reply",
        type: "reply-form",
        slot: "sidebar",
        anchor: "free",
        priority: 2,
        mustShow: false,
        a11y: { label: "Draft customer reply" },
        props: { ticketId: "TCK-101" },
      },
      {
        id: "node-chart",
        type: "chart",
        slot: "sidebar",
        anchor: "free",
        priority: 1,
        mustShow: false,
        a11y: { label: "Tickets by priority breakdown" },
        props: {
          title: "Priority Breakdown",
          series: [
            { label: "Urgent", value: 4 },
            { label: "High", value: 9 },
          ],
        },
      },
      {
        id: "node-badge",
        type: "badge",
        slot: "header",
        anchor: "free",
        priority: 1,
        mustShow: false,
        a11y: { label: "SLA status indicator" },
        props: { text: "SLA 98.4%" },
      },
      {
        id: "node-dialog",
        type: "confirm-dialog",
        slot: "footer",
        anchor: "free",
        priority: 0,
        mustShow: false,
        a11y: { label: "Escalate ticket confirmation" },
        props: {
          triggerLabel: "Escalate Selected",
          title: "Escalate ticket?",
          description: "Routes this ticket to Tier 2 engineering.",
        },
      },
    ],
  };
}

describe("SpecRenderer", () => {
  it("renders every node type with its a11y.label", () => {
    const spec = makeFullSpec();
    render(<SpecRenderer spec={spec} />);

    for (const node of spec.nodes) {
      expect(screen.getByLabelText(node.a11y.label)).toBeInTheDocument();
    }
  });

  it("shows a visible fallback for an unknown node type without crashing", () => {
    const specWithUnknown = {
      version: 1,
      appId: "support-desk-test",
      nodes: [
        {
          id: "bad-node",
          type: "unknown-widget",
          slot: "main",
          anchor: "free",
          priority: 1,
          mustShow: false,
          a11y: { label: "Mystery widget" },
          props: {},
        },
      ],
    } as unknown as UISpec;

    render(<SpecRenderer spec={specWithUnknown} />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/unknown-widget/i);
  });

  it("isolates a throwing node inside an error boundary so sibling nodes still render", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const ThrowingButton = () => {
      throw new Error("Simulated component crash");
    };

    const spec: UISpec = {
      version: 1,
      appId: "support-desk-test",
      nodes: [
        {
          id: "crashing-btn",
          type: "button",
          slot: "toolbar",
          anchor: "free",
          priority: 2,
          mustShow: false,
          a11y: { label: "Broken button" },
          props: { label: "Broken button" },
        },
        {
          id: "healthy-stat",
          type: "stat-card",
          slot: "metrics",
          anchor: "pinned",
          priority: 3,
          mustShow: true,
          a11y: { label: "Healthy stat card" },
          props: { title: "Resolved Today", value: "18" },
        },
      ],
    };

    try {
      render(<SpecRenderer spec={spec} registry={{ button: ThrowingButton }} />);

      expect(screen.getByRole("alert")).toHaveTextContent(/crashing-btn/i);
      expect(screen.getByLabelText("Healthy stat card")).toBeInTheDocument();
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
