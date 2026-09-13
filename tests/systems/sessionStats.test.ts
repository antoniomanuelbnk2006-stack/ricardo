import { describe, it, expect } from "vitest";
import {
  withSessionStart,
  withSessionEnd,
  withRestart,
  withAnswer,
  accuracyPercent,
} from "../../src/systems/statistics/statisticsSystem";
import { initialStatistics } from "../../src/types/statistics";

describe("cronometro de sesion", () => {
  it("no reinicia el cronometro si ya hay una sesion abierta", () => {
    const started = withSessionStart(initialStatistics, 1000);
    const again = withSessionStart(started, 9999);
    expect(again.sessionStartedAt).toBe(1000);
  });

  it("congela el tiempo total al cerrar la sesion", () => {
    const started = withSessionStart(initialStatistics, 1000);
    const ended = withSessionEnd(started, 61000);
    expect(ended.totalTimeMs).toBe(60000);
  });

  it("no calcula tiempo total si nunca se abrio la sesion", () => {
    expect(withSessionEnd(initialStatistics, 5000).totalTimeMs).toBe(0);
  });
});

describe("reinicios", () => {
  it("pone las estadisticas a cero pero acumula el contador de reinicios", () => {
    const played = withAnswer(initialStatistics, true, 500);
    const first = withRestart(played);
    expect(first.correctAnswers).toBe(0);
    expect(first.restarts).toBe(1);
    expect(withRestart(first).restarts).toBe(2);
  });
});

describe("accuracyPercent", () => {
  it("devuelve null si aun no se ha respondido nada", () => {
    expect(accuracyPercent(initialStatistics)).toBeNull();
  });

  it("redondea el porcentaje de acierto", () => {
    let s = withAnswer(initialStatistics, true, 100);
    s = withAnswer(s, true, 100);
    s = withAnswer(s, false, 100);
    expect(accuracyPercent(s)).toBe(67);
  });
});
