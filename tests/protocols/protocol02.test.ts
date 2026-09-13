import { describe, it, expect } from "vitest";
import { shouldPress, isStimulusCorrect } from "../../src/protocols/protocol02/protocol02.logic";

describe("protocol02 logic", () => {
  it("fase 1: solo hay que pulsar en GO", () => {
    expect(shouldPress("p1", { word: "GO" })).toBe(true);
    expect(shouldPress("p1", { word: "WAIT" })).toBe(false);
  });

  it("fase 2: la regla se invierte a STOP", () => {
    expect(shouldPress("p2", { word: "STOP" })).toBe(true);
    expect(shouldPress("p2", { word: "GO" })).toBe(false);
  });

  it("fase 3 (stroop): pulsar solo si palabra y color NO coinciden", () => {
    expect(shouldPress("p3", { word: "BLUE", color: "red" })).toBe(true);
    expect(shouldPress("p3", { word: "RED", color: "red" })).toBe(false);
  });

  it("isStimulusCorrect compara la accion esperada con la real", () => {
    expect(isStimulusCorrect("p1", { word: "GO" }, true)).toBe(true);
    expect(isStimulusCorrect("p1", { word: "GO" }, false)).toBe(false);
  });
});
