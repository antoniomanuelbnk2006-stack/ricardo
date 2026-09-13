import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScreenDistortion } from "../../src/systems/glitches/useScreenDistortion";

describe("useScreenDistortion", () => {
  it("en nivel 0 no aplica ninguna distorsion", () => {
    const { result } = renderHook(() => useScreenDistortion(0));
    expect(result.current).toEqual({ rgbBurst: false, frameGlitch: false, jitterX: 0, jitterY: 0 });
  });

  it("con reducedMotion activado, incluso en nivel 4 no aplica ninguna distorsion", () => {
    const { result } = renderHook(() => useScreenDistortion(4, true));
    expect(result.current).toEqual({ rgbBurst: false, frameGlitch: false, jitterX: 0, jitterY: 0 });
  });
});
