import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TypingEngine } from "../../src/components/terminal/TypingEngine";

describe("TypingEngine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("tipea caracter a caracter hasta completar todas las lineas", () => {
    const onDone = vi.fn();
    const onLineComplete = vi.fn();
    const engine = new TypingEngine({ lines: ["AB", "C"], charDelayMs: 10, lineDelayMs: 10, onLineComplete, onDone });
    let partial = "";
    engine.start((p) => (partial = p));
    expect(partial).toBe("A"); // el primer caracter se pinta de forma sincrona al arrancar

    vi.advanceTimersByTime(10);
    expect(partial).toBe("AB");

    vi.advanceTimersByTime(10); // linea 0 completa
    expect(onLineComplete).toHaveBeenCalledWith("AB", 0);

    vi.advanceTimersByTime(10); // "C"
    expect(partial).toBe("C");

    vi.advanceTimersByTime(10); // linea 1 completa
    expect(onLineComplete).toHaveBeenCalledWith("C", 1);

    vi.advanceTimersByTime(10); // onDone
    expect(onDone).toHaveBeenCalled();
  });

  it("skipLine() completa la linea actual al instante sin saltarse las siguientes", () => {
    const onLineComplete = vi.fn();
    const engine = new TypingEngine({ lines: ["HELLO", "WORLD"], charDelayMs: 1000, lineDelayMs: 10, onLineComplete });
    let partial = "";
    engine.start((p) => (partial = p));
    expect(partial).toBe("H");

    engine.skipLine();
    expect(partial).toBe("HELLO");

    vi.advanceTimersByTime(0);
    expect(onLineComplete).toHaveBeenCalledWith("HELLO", 0);

    // La segunda linea sigue tipeandose a su ritmo normal, no se salta.
    vi.advanceTimersByTime(10);
    expect(partial).toBe("W");
  });

  it("cancel() detiene el motor y evita mas callbacks", () => {
    const onDone = vi.fn();
    const engine = new TypingEngine({ lines: ["X"], charDelayMs: 10, lineDelayMs: 10, onDone });
    engine.start(() => {});
    engine.cancel();
    vi.advanceTimersByTime(1000);
    expect(onDone).not.toHaveBeenCalled();
  });
});
