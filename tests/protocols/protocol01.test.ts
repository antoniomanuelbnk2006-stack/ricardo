import { describe, it, expect } from "vitest";
import { isCorrectAnswer } from "../../src/protocols/protocol01/protocol01.logic";
import { P1_ITEMS } from "../../src/protocols/protocol01/protocol01.data";

describe("protocol01 logic", () => {
  it("valida la respuesta correcta del primer item", () => {
    const item = P1_ITEMS[0];
    expect(isCorrectAnswer(item.answer, item.answer)).toBe(true);
    expect(isCorrectAnswer(item.answer, "opcion incorrecta")).toBe(false);
  });

  it("la pregunta cruzada final usa datos de items anteriores (UNIT C = 41, 03 = LOCKED)", () => {
    const last = P1_ITEMS[P1_ITEMS.length - 1];
    expect(last.exhibit).toEqual([]);
    expect(last.answer).toBe("41");
  });
});
