import { describe, it, expect } from "vitest";
import { buildMonthGrid, formatLongDate, formatMonthYear } from "../../src/utils/calendar";

describe("calendar utils", () => {
  it("marca el dia de hoy en la cuadricula del mes", () => {
    const date = new Date(2026, 8, 9); // 9 de septiembre de 2026
    const { weeks } = buildMonthGrid(date);
    const flat = weeks.flat();
    const today = flat.find((c) => c.isToday);
    expect(today?.day).toBe(9);
  });

  it("formatea la fecha larga y el mes/año", () => {
    const date = new Date(2026, 8, 9);
    expect(formatLongDate(date)).toContain("2026");
    expect(formatMonthYear(date)).toBe("Septiembre 2026");
  });
});
