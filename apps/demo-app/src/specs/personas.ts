import { UISpec } from "@anchor/spec";

export type PersonaId = "novice" | "senior" | "manager";

export interface PersonaConfig {
  id: PersonaId;
  label: string;
  roleTitle: string;
  description: string;
  spec: UISpec;
}

const noviceSpec = UISpec.parse({
  version: 1,
  appId: "support-desk-novice",
  nodes: [
    {
      id: "persona-badge-novice",
      type: "badge",
      slot: "header",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Guided onboarding mode badge" },
      props: { text: "Guided Mode", tone: "success" },
    },
    {
      id: "stat-open-novice",
      type: "stat-card",
      slot: "metrics",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Open tickets assigned to queue" },
      props: {
        title: "Open Tickets",
        value: "12",
        delta: "2 urgent",
        helper: "Focus on highest priority first",
      },
    },
    {
      id: "stat-sla-novice",
      type: "stat-card",
      slot: "metrics",
      anchor: "pinned",
      priority: 2,
      mustShow: true,
      a11y: { label: "Current response SLA target" },
      props: {
        title: "Next SLA Due",
        value: "22m",
        delta: "On track",
        helper: "Standard first-response window",
      },
    },
    {
      id: "filter-novice",
      type: "filter-bar",
      slot: "toolbar",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Ticket search and status filter", role: "search" },
      props: {
        placeholder: "Filter by ticket ID, subject, or customer...",
        showAdvanced: false,
      },
    },
    {
      id: "btn-playbook-novice",
      type: "button",
      slot: "toolbar",
      anchor: "free",
      priority: 1,
      mustShow: false,
      a11y: { label: "Open guided triage checklist" },
      props: { label: "Open Guided Checklist", variant: "secondary" },
    },
    {
      id: "table-novice",
      type: "ticket-table",
      slot: "main",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Guided support ticket queue" },
      props: {
        title: "Assigned Support Queue",
        showAssignee: false,
      },
    },
    {
      id: "reply-novice",
      type: "reply-form",
      slot: "sidebar",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Guided customer reply composer" },
      props: {
        title: "Step-by-Step Reply",
        placeholder:
          "Acknowledge the issue, confirm reproduction steps, and share next ETA...",
      },
    },
    {
      id: "escalate-novice",
      type: "confirm-dialog",
      slot: "footer",
      anchor: "pinned",
      priority: 2,
      mustShow: true,
      a11y: { label: "Safe escalation confirmation dialog" },
      props: {
        triggerLabel: "Escalate to Senior Queue",
        title: "Escalate ticket to Senior Queue?",
        description:
          "Use escalation when an issue has a verified P1 outage or missing SSO access.",
        confirmLabel: "Confirm Escalation",
      },
    },
  ],
});

const seniorSpec = UISpec.parse({
  version: 2,
  appId: "support-desk-senior",
  nodes: [
    {
      id: "persona-badge-senior",
      type: "badge",
      slot: "header",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Power triage mode badge" },
      props: { text: "Power Triage", tone: "default" },
    },
    {
      id: "stat-open-senior",
      type: "stat-card",
      slot: "metrics",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Active unresolved queue count" },
      props: { title: "Active Queue", value: "27", delta: "+4 last hr" },
    },
    {
      id: "stat-response-senior",
      type: "stat-card",
      slot: "metrics",
      anchor: "free",
      priority: 2,
      mustShow: false,
      a11y: { label: "Median first response time" },
      props: { title: "Median First Response", value: "11m", delta: "-3m vs avg" },
    },
    {
      id: "stat-escalated-senior",
      type: "stat-card",
      slot: "metrics",
      anchor: "pinned",
      priority: 2,
      mustShow: true,
      a11y: { label: "Escalated incident count" },
      props: { title: "Escalated Now", value: "3", delta: "1 critical" },
    },
    {
      id: "filter-senior",
      type: "filter-bar",
      slot: "toolbar",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Senior ticket filter controls", role: "search" },
      props: {
        placeholder: "Search ID, customer, or keyword...",
        showAdvanced: true,
      },
    },
    {
      id: "btn-claim-senior",
      type: "button",
      slot: "toolbar",
      anchor: "free",
      priority: 2,
      mustShow: false,
      a11y: { label: "Claim next unassigned ticket" },
      props: { label: "Claim Next Unassigned", variant: "default" },
    },
    {
      id: "table-senior",
      type: "ticket-table",
      slot: "main",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Full triage queue with assignees" },
      props: {
        title: "Live Triage Queue",
        showAssignee: true,
      },
    },
    {
      id: "reply-senior",
      type: "reply-form",
      slot: "sidebar",
      anchor: "free",
      priority: 3,
      mustShow: false,
      a11y: { label: "Rapid ticket response editor" },
      props: {
        title: "Rapid Reply",
        placeholder: "Enter technical diagnosis or workaround...",
      },
    },
    {
      id: "chart-priority-senior",
      type: "chart",
      slot: "sidebar",
      anchor: "free",
      priority: 2,
      mustShow: false,
      a11y: { label: "Priority distribution chart" },
      props: {
        title: "Queue by Priority",
        subtitle: "Open & escalated tickets",
        series: [
          { label: "Urgent", value: 3 },
          { label: "High", value: 9 },
          { label: "Medium", value: 11 },
          { label: "Low", value: 4 },
        ],
      },
    },
    {
      id: "escalate-senior",
      type: "confirm-dialog",
      slot: "footer",
      anchor: "pinned",
      priority: 2,
      mustShow: true,
      a11y: { label: "Tier 2 engineering escalation dialog" },
      props: {
        triggerLabel: "Page On-Call Engineering",
        title: "Page Tier 2 Engineering?",
        description: "Attaches the selected ticket diagnostic snapshot to PagerDuty.",
        confirmLabel: "Page Engineering",
      },
    },
  ],
});

const managerSpec = UISpec.parse({
  version: 3,
  appId: "support-desk-manager",
  nodes: [
    {
      id: "persona-badge-manager",
      type: "badge",
      slot: "header",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Operations manager overview badge" },
      props: { text: "Operations Overview", tone: "warning" },
    },
    {
      id: "stat-sla-manager",
      type: "stat-card",
      slot: "metrics",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Weekly SLA compliance percentage" },
      props: { title: "SLA Compliance", value: "98.4%", delta: "+0.6% WoW" },
    },
    {
      id: "stat-breach-manager",
      type: "stat-card",
      slot: "metrics",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Tickets at risk of SLA breach" },
      props: { title: "At-Risk Tickets", value: "4", delta: "2 unassigned" },
    },
    {
      id: "stat-resolved-manager",
      type: "stat-card",
      slot: "metrics",
      anchor: "free",
      priority: 2,
      mustShow: false,
      a11y: { label: "Tickets resolved today" },
      props: { title: "Resolved Today", value: "43", delta: "112% target" },
    },
    {
      id: "filter-manager",
      type: "filter-bar",
      slot: "toolbar",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Operations queue filter bar", role: "search" },
      props: {
        placeholder: "Filter accounts, escalations, or ticket IDs...",
        showAdvanced: true,
      },
    },
    {
      id: "btn-export-manager",
      type: "button",
      slot: "toolbar",
      anchor: "free",
      priority: 2,
      mustShow: false,
      a11y: { label: "Export SLA compliance summary" },
      props: { label: "Export SLA Summary", variant: "secondary" },
    },
    {
      id: "chart-sla-manager",
      type: "chart",
      slot: "main",
      anchor: "pinned",
      priority: 3,
      mustShow: true,
      a11y: { label: "Queue severity breakdown chart" },
      props: {
        title: "Open Volume by Severity",
        subtitle: "Cross-team SLA exposure",
        series: [
          { label: "Urgent (15m SLA)", value: 3 },
          { label: "High (1h SLA)", value: 9 },
          { label: "Medium (4h SLA)", value: 11 },
          { label: "Low (24h SLA)", value: 4 },
        ],
      },
    },
    {
      id: "table-manager",
      type: "ticket-table",
      slot: "main",
      anchor: "pinned",
      priority: 2,
      mustShow: true,
      a11y: { label: "Escalation and assignee oversight table" },
      props: {
        title: "Team Escalation & SLA Queue",
        showAssignee: true,
      },
    },
    {
      id: "chart-workload-manager",
      type: "chart",
      slot: "sidebar",
      anchor: "free",
      priority: 2,
      mustShow: false,
      a11y: { label: "Agent workload balance chart" },
      props: {
        title: "Active Load by Agent",
        subtitle: "Tickets currently owned",
        series: [
          { label: "Maya Lin", value: 7 },
          { label: "Devon Patel", value: 6 },
          { label: "Samira Noor", value: 5 },
          { label: "Unassigned", value: 4 },
        ],
      },
    },
    {
      id: "bridge-manager",
      type: "confirm-dialog",
      slot: "footer",
      anchor: "pinned",
      priority: 2,
      mustShow: true,
      a11y: { label: "Incident bridge activation dialog" },
      props: {
        triggerLabel: "Open Incident Bridge",
        title: "Open cross-functional incident bridge?",
        description:
          "Notifies support leads and SRE on-call for urgent SLA preservation.",
        confirmLabel: "Start Bridge",
      },
    },
  ],
});

export const PERSONA_CONFIGS: Record<PersonaId, PersonaConfig> = {
  novice: {
    id: "novice",
    label: "Novice Agent",
    roleTitle: "Guided Triage Layout",
    description:
      "Simplified queue with pinned step-by-step reply guidance and confirmation guardrails.",
    spec: noviceSpec,
  },
  senior: {
    id: "senior",
    label: "Senior Specialist",
    roleTitle: "High-Throughput Triage Layout",
    description:
      "Dense queue with assignee visibility, advanced filters, rapid reply, and priority chart.",
    spec: seniorSpec,
  },
  manager: {
    id: "manager",
    label: "Support Manager",
    roleTitle: "SLA & Capacity Overview",
    description:
      "Promotes SLA metrics, severity exposure charts, and team workload balance while omitting reply clutter.",
    spec: managerSpec,
  },
};

export const PERSONA_LIST: readonly PersonaConfig[] = [
  PERSONA_CONFIGS.novice,
  PERSONA_CONFIGS.senior,
  PERSONA_CONFIGS.manager,
];

export function isPersonaId(value: string): value is PersonaId {
  return value === "novice" || value === "senior" || value === "manager";
}
