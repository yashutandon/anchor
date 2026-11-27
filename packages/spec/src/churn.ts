import type { UISpec } from "./schema";

export interface ChurnOptions {
  /** Optional weight overrides per change type or slot distance. */
  weights?: Record<string, number>;
  /** Pinned node IDs held fixed by the end user. */
  pinnedNodeIds?: readonly string[];
}

/**
 * Measures layout churn between two UI specs as a normalized score.
 */
export function computeChurn(prev: UISpec, next: UISpec, opts?: ChurnOptions): number {
  // TODO(owner): Implement churn metric using spec diff and optional weighting/pin configuration.
  void prev;
  void next;
  void opts;
  throw new Error("not implemented");
}
