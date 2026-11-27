import { describe, it } from "vitest";

describe("UISpec schema", () => {
  it.todo("validates a minimal UISpec with all supported node types");
  it.todo("defaults node.mustShow to false when omitted");
  it.todo("rejects nodes with priority outside 0..3");
  it.todo("rejects nodes with an unknown node type");
  it.todo("rejects nodes missing a11y.label");
});
