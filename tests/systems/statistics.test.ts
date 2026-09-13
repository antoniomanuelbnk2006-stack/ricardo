import { describe, it, expect } from "vitest";
import { withAnswer, withClick } from "../../src/systems/statistics/statisticsSystem";
import { initialStatistics } from "../../src/types/statistics";

describe("statisticsSystem", () => {
  it("registra una respuesta correcta y su tiempo, sin importar cuanto tarde", () => {
    const s1 = withAnswer(initialStatistics, true, 600000); // 10 minutos
    expect(s1.correctAnswers).toBe(1);
    expect(s1.slowestResponseMs).toBe(600000);
  });

  it("acumula clicks", () => {
    const s1 = withClick(initialStatistics);
    const s2 = withClick(s1);
    expect(s2.totalClicks).toBe(2);
  });
});
