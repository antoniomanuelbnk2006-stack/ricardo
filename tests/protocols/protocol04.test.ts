import { describe, it, expect } from "vitest";
import { isCorrectAnswer } from "../../src/protocols/protocol04/protocol04.logic";
import { P4_TESTS } from "../../src/protocols/protocol04/protocol04.data";

// Regresion: el test 01 (las tres cajas) tenia una respuesta
// logicamente inconsistente con su propio enunciado ("solo una
// afirmacion es verdadera"). Esta prueba fija la tabla de verdad para
// que no se pueda volver a colar una respuesta incorrecta sin que el
// test falle.
describe("protocol04: puzzle de las cajas (test 01)", () => {
  const [test] = P4_TESTS;

  function evaluate(objectLocation: "A" | "B" | "C") {
    const aTrue = objectLocation !== "A"; // A: "el objeto no esta aqui"
    const bTrue = objectLocation === "A"; // B: "el objeto esta en A"
    const cTrue = !bTrue; // C: "B esta mintiendo"
    return [aTrue, bTrue, cTrue].filter(Boolean).length;
  }

  it("solo la ubicacion A produce exactamente una afirmacion verdadera", () => {
    expect(evaluate("A")).toBe(1);
    expect(evaluate("B")).toBe(2);
    expect(evaluate("C")).toBe(2);
  });

  it("la respuesta configurada coincide con la unica solucion consistente", () => {
    expect(test.answer).toBe("A");
    expect(isCorrectAnswer(test, "A")).toBe(true);
    expect(isCorrectAnswer(test, "C")).toBe(false);
  });
});

// Tabla de verdad de los tres interruptores autorreferentes (test 03).
// Se fija aparte porque la respuesta depende de dos cosas: cual es la
// unica afirmacion verdadera Y la premisa de que la salida la abre quien
// dice la verdad. Esa segunda premisa faltaba en el enunciado original
// (ver docs/LOGIC_AUDIT.md, LOGIC-03).
describe("protocol04: puzzle de los interruptores (test 03)", () => {
  const test = P4_TESTS[2];

  // a <-> !c, b <-> a, c <-> !b
  function isConsistent(a: boolean, b: boolean, c: boolean): boolean {
    return a === !c && b === a && c === !b;
  }

  it("solo una asignacion es consistente y tiene exactamente una verdadera", () => {
    const valid: string[] = [];
    for (const a of [true, false]) {
      for (const b of [true, false]) {
        for (const c of [true, false]) {
          if (!isConsistent(a, b, c)) continue;
          if ([a, b, c].filter(Boolean).length !== 1) continue;
          valid.push([a && "A", b && "B", c && "C"].filter(Boolean).join(""));
        }
      }
    }
    expect(valid).toEqual(["C"]);
  });

  it("la respuesta configurada es la afirmacion verdadera", () => {
    expect(test.answer).toBe("C");
    expect(isCorrectAnswer(test, "A")).toBe(false);
    expect(isCorrectAnswer(test, "B")).toBe(false);
  });

  it("el enunciado declara que la salida la abre quien dice la verdad", () => {
    // Sin esta premisa la pregunta no se puede responder: saber que C es
    // la unica verdadera no implica que C sea el interruptor bueno.
    expect(test.lines.join(" ")).toContain("dice la verdad");
  });
});

// El resto de pruebas se auditaron formalmente en docs/LOGIC_AUDIT.md.
// Aqui se fijan las que dependen de una cadena de deducciones, para que un
// cambio de contenido no pueda dejar una respuesta incorrecta en silencio.
describe("protocol04: respuestas deducidas", () => {
  it("el orden (test 04) es el unico compatible con las tres premisas", () => {
    const order = P4_TESTS[3];
    const valid = order.options.filter((opt) => {
      const seq = opt.split(", ");
      const at = (x: string) => seq.indexOf(x);
      return at("A") < at("B") && at("D") < at("C") && at("B") < at("D");
    });
    expect(valid).toEqual(["A, B, D, C"]);
    expect(order.answer).toBe("A, B, D, C");
  });

  it("el XOR encadenado (test 08) tiene un unico valor posible para C", () => {
    const xor = P4_TESTS[7];
    const a = true;
    const solutions = [true, false].filter((c) =>
      [true, false].some((b) => a !== b && b !== c)
    );
    expect(solutions).toEqual([true]);
    expect(xor.answer).toBe("TRUE");
  });
});
