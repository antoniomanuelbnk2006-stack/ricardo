import { describe, it, expect } from "vitest";
import { deriveCorruptionLevel } from "../../src/systems/corruption/corruptionSystem";

describe("corruptionSystem", () => {
  it("empieza en nivel 0 sin protocolos completados", () => {
    expect(deriveCorruptionLevel([])).toBe(0);
  });

  it("sube de nivel segun los protocolos completados", () => {
    expect(deriveCorruptionLevel(["01"])).toBe(1);
    expect(deriveCorruptionLevel(["01", "02", "03"])).toBe(2);
    expect(deriveCorruptionLevel(["01", "02", "03", "04"])).toBe(3);
    expect(deriveCorruptionLevel(["01", "02", "03", "04", "05"])).toBe(4);
  });
});
