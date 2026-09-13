import { describe, it, expect } from "vitest";
import { formatDuration, formatDateTime } from "../../src/utils/formatting";

describe("formatDuration", () => {
  it("usa mm:ss por debajo de una hora", () => {
    expect(formatDuration(65000)).toBe("01:05");
    expect(formatDuration(600000)).toBe("10:00");
  });

  it("anade las horas cuando hacen falta", () => {
    expect(formatDuration(3_725_000)).toBe("1:02:05");
  });

  it("devuelve un guion si no hay duracion medida", () => {
    expect(formatDuration(0)).toBe("—");
  });
});

describe("formatDateTime", () => {
  it("devuelve un guion si no hay marca de tiempo", () => {
    expect(formatDateTime(null)).toBe("—");
  });

  it("formatea la fecha local con ceros a la izquierda", () => {
    const d = new Date(2026, 0, 5, 4, 37);
    expect(formatDateTime(d.getTime())).toBe("2026-01-05 04:37");
  });
});
