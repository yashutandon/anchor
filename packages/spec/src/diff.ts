import type { Node, UISpec } from "./schema";

export type SpecChangeKind = "move" | "hide" | "restyle" | "add";

export interface SpecChange {
  kind: SpecChangeKind;
  nodeId: string;
  before?: Node;
  after?: Node;
}

export interface SpecDiff {
  fromVersion: number;
  toVersion: number;
  changes: SpecChange[];
}

/**
 * Computes structural changes between two validated UI specs.
 */
export function diffSpecs(prev: UISpec, next: UISpec): SpecDiff {
  // TODO(owner): Implement spec diffing across prev and next node maps (move | hide | restyle | add).
  void prev;
  void next;
  throw new Error("not implemented");
}
