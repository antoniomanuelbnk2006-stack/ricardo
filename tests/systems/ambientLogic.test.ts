import { describe, it, expect } from "vitest";
import { shouldAmbientPlay } from "../../src/systems/audio/ambientLogic";

describe("shouldAmbientPlay", () => {
  it("solo debe sonar si se quiere Y hay volumen audible", () => {
    expect(shouldAmbientPlay(true, 0.5)).toBe(true);
    expect(shouldAmbientPlay(true, 0)).toBe(false); // silenciado, pero se sigue "queriendo"
    expect(shouldAmbientPlay(false, 0.5)).toBe(false); // nadie lo ha pedido
    expect(shouldAmbientPlay(false, 0)).toBe(false);
  });
});
