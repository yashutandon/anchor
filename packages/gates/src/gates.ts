import type { GateDecision, GateInput, GateSuiteResult } from "./types";

/**
 * Validates that a candidate spec conforms to the UISpec Zod schema.
 */
export function runSchemaGate(input: GateInput): GateDecision {
  // TODO(owner): Implement schema gate validation against UISpec.safeParse().
  void input;
  throw new Error("not implemented");
}

/**
 * Enforces accessibility invariants on the candidate UI spec.
 */
export function runA11yGate(input: GateInput): GateDecision {
  // TODO(owner): Implement accessibility gate checks (labels, roles, heading/dialog rules).
  void input;
  throw new Error("not implemented");
}

/**
 * Checks churn and pin invariants between the previous and candidate specs.
 */
export function runStabilityGate(input: GateInput): GateDecision {
  // TODO(owner): Implement stability gate using diffSpecs, computeChurn, and pinned node checks.
  void input;
  throw new Error("not implemented");
}

/**
 * Enforces policy constraints such as keeping mustShow nodes visible.
 */
export function runPolicyGate(input: GateInput): GateDecision {
  // TODO(owner): Implement policy gate checks (e.g., mustShow nodes never hidden).
  void input;
  throw new Error("not implemented");
}

/**
 * Runs all deterministic Anchor gates in order and aggregates their decisions.
 */
export function runAllGates(input: GateInput): GateSuiteResult {
  // TODO(owner): Implement full deterministic gate pipeline.
  void input;
  throw new Error("not implemented");
}
