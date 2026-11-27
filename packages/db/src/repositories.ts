import { UISpec } from "@anchor/spec";

export type Persona = "novice" | "senior" | "manager";
export type UiSpecStatus = "candidate" | "live" | "rejected" | "reverted";
export type AdaptationTrigger = "session_start" | "frustration" | "user_request";
export type GateName = "schema" | "a11y" | "stability" | "policy";

export interface StoredUiSpecRecord {
  id: string;
  endUserId: string;
  taskKey: string;
  version: number;
  parentVersion: number | null;
  spec: UISpec;
  status: UiSpecStatus;
  createdAt: Date;
}

export interface CreateUiSpecInput {
  endUserId: string;
  taskKey: string;
  version: number;
  parentVersion?: number | null;
  spec: unknown;
  status: UiSpecStatus;
}

export interface RecordAdaptationInput {
  specId: string;
  trigger: AdaptationTrigger;
  decisionLog: Record<string, unknown>;
  churn: number;
}

export interface RecordGateResultInput {
  specId: string;
  gate: GateName;
  passed: boolean;
  details: Record<string, unknown>;
}

export interface PinRecord {
  id: string;
  endUserId: string;
  nodeId: string;
}

/**
 * Parses any Json column payload read from or written to UiSpec.spec with UISpec.parse().
 * Enforces the AGENTS.md invariant at the repository boundary.
 */
export function parseSpecColumn(rawSpec: unknown): UISpec {
  return UISpec.parse(rawSpec);
}

/**
 * Fetches the latest live UI spec for an end user and task key.
 */
export async function getLatestLiveSpec(
  endUserId: string,
  taskKey: string,
): Promise<StoredUiSpecRecord | null> {
  // TODO(db): Query prisma.uiSpec.findFirst and parse row.spec with parseSpecColumn().
  void endUserId;
  void taskKey;
  throw new Error("not implemented");
}

/**
 * Persists a new UI spec version after validating its JSON payload with UISpec.parse().
 */
export async function createUiSpec(
  input: CreateUiSpecInput,
): Promise<StoredUiSpecRecord> {
  // Parse before writing to the Json column so invalid specs never reach Prisma.
  const validatedSpec = parseSpecColumn(input.spec);
  // TODO(db): Insert into prisma.uiSpec with validatedSpec and parse returned row.spec.
  void validatedSpec;
  throw new Error("not implemented");
}

/**
 * Updates the lifecycle status of a stored UI spec (candidate | live | rejected | reverted).
 */
export async function updateUiSpecStatus(
  specId: string,
  status: UiSpecStatus,
): Promise<StoredUiSpecRecord> {
  // TODO(db): Update prisma.uiSpec status and parse returned row.spec with parseSpecColumn().
  void specId;
  void status;
  throw new Error("not implemented");
}

/**
 * Records an adaptation log entry linked to a UiSpec record.
 */
export async function recordAdaptation(input: RecordAdaptationInput): Promise<void> {
  // TODO(db): Persist adaptation trigger, decisionLog, and churn via prisma.adaptation.create().
  void input;
  throw new Error("not implemented");
}

/**
 * Records deterministic gate outcomes for a UiSpec candidate.
 */
export async function recordGateResults(
  inputs: readonly RecordGateResultInput[],
): Promise<void> {
  // TODO(db): Persist gate outcomes via prisma.gateResult.createMany().
  void inputs;
  throw new Error("not implemented");
}

/**
 * Lists all node IDs pinned by an end user.
 */
export async function listPinsForUser(endUserId: string): Promise<PinRecord[]> {
  // TODO(db): Query prisma.pin.findMany({ where: { endUserId } }).
  void endUserId;
  throw new Error("not implemented");
}

/**
 * Pins a node ID for an end user.
 */
export async function upsertPin(endUserId: string, nodeId: string): Promise<PinRecord> {
  // TODO(db): Upsert pin record via prisma.pin.upsert().
  void endUserId;
  void nodeId;
  throw new Error("not implemented");
}

/**
 * Removes a node pin for an end user.
 */
export async function removePin(endUserId: string, nodeId: string): Promise<void> {
  // TODO(db): Delete pin record via prisma.pin.delete().
  void endUserId;
  void nodeId;
  throw new Error("not implemented");
}
