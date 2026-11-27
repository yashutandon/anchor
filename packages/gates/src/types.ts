import type { UISpec } from "@anchor/spec";

export type GateName = "schema" | "a11y" | "stability" | "policy";

export interface GateInput {
  prevSpec?: UISpec;
  candidateSpec: unknown;
  pinnedNodeIds?: readonly string[];
  maxChurn?: number;
}

export interface GateDecision {
  gate: GateName;
  passed: boolean;
  reasons: string[];
  details?: Record<string, unknown>;
}

export interface GateSuiteResult {
  passed: boolean;
  decisions: GateDecision[];
}
