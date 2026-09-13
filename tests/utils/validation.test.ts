import { describe, it, expect } from "vitest";
import { validatePlayerName, PLAYER_NAME_MAX } from "../../src/utils/validation";

describe("validatePlayerName", () => {
  it("rechaza nombres vacios o solo con espacios", () => {
    expect(validatePlayerName("")).toEqual({ ok: false, error: "IDENTIFICACION REQUERIDA." });
    expect(validatePlayerName("   ")).toEqual({ ok: false, error: "IDENTIFICACION REQUERIDA." });
  });

  it("normaliza espacios sobrantes en vez de rechazar el nombre", () => {
    expect(validatePlayerName("  ricky   edit  ")).toEqual({ ok: true, value: "ricky edit" });
  });

  it("acepta acentos, numeros y los separadores permitidos", () => {
    expect(validatePlayerName("Antonio_2006")).toEqual({ ok: true, value: "Antonio_2006" });
    expect(validatePlayerName("Jose-Maria")).toEqual({ ok: true, value: "Jose-Maria" });
    expect(validatePlayerName("Álvaro")).toEqual({ ok: true, value: "Álvaro" });
  });

  it("rechaza caracteres que podrian colarse como marcado", () => {
    const result = validatePlayerName("<script>");
    expect(result.ok).toBe(false);
  });

  it("rechaza nombres mas largos que el maximo", () => {
    const result = validatePlayerName("a".repeat(PLAYER_NAME_MAX + 1));
    expect(result.ok).toBe(false);
  });

  it("acepta un nombre justo en el limite", () => {
    const result = validatePlayerName("a".repeat(PLAYER_NAME_MAX));
    expect(result.ok).toBe(true);
  });
});
