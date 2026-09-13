import { describe, it, expect } from "vitest";
import { isCorrectAnswer } from "../../src/protocols/protocol03/protocol03.logic";
import { P3_TESTS } from "../../src/protocols/protocol03/protocol03.data";

describe("protocol03 logic", () => {
  it("valida la respuesta correcta del primer test", () => {
    const test = P3_TESTS[0];
    expect(isCorrectAnswer(test, test.answer as string)).toBe(true);
    expect(isCorrectAnswer(test, "opcion incorrecta")).toBe(false);
  });
});
