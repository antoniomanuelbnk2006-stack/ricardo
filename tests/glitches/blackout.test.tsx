import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useBlackout } from "../../src/systems/glitches/glitchManager";

describe("useBlackout", () => {
  it("con reducedMotion activado nunca entra en blackout, ni en nivel 4", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBlackout(4, true));
    expect(result.current).toBe(false);
    vi.advanceTimersByTime(60000);
    expect(result.current).toBe(false);
    vi.useRealTimers();
  });
});
