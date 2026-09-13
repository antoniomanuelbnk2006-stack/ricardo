import { describe, it, expect } from "vitest";
import { registerEscPress, checkCodeBuffer } from "../../src/systems/secrets/secretSystem";

describe("secretSystem", () => {
  it("detecta el codigo 0437 al final del buffer", () => {
    expect(checkCodeBuffer("90437")).toBe("s5");
    expect(checkCodeBuffer("0437")).toBe("s5");
  });

  it("no detecta codigos incorrectos o incompletos", () => {
    expect(checkCodeBuffer("1234")).toBeNull();
    expect(checkCodeBuffer("437")).toBeNull();
  });
});

// Regresion: la ventana de ESC se reiniciaba en cada pulsacion, de modo que
// la condicion real era "menos de 2 s entre pulsaciones" en vez de "cinco
// pulsaciones dentro de 2 s". Pulsando Escape cada segundo y medio durante
// una partida larga, el secreto acababa saltando solo.
describe("registerEscPress", () => {
  function press(times: number[], now: number) {
    return registerEscPress(times, now);
  }

  it("cinco pulsaciones dentro de la ventana desbloquean el bucle", () => {
    let times: number[] = [];
    let unlocked = false;
    for (const t of [0, 200, 400, 600, 800]) {
      ({ times, unlocked } = press(times, t));
    }
    expect(unlocked).toBe(true);
    expect(times).toEqual([]); // se reinicia para no contar dos veces
  });

  it("cuatro pulsaciones no bastan", () => {
    let times: number[] = [];
    let unlocked = false;
    for (const t of [0, 200, 400, 600]) {
      ({ times, unlocked } = press(times, t));
    }
    expect(unlocked).toBe(false);
  });

  it("cinco pulsaciones repartidas en seis segundos NO cuentan", () => {
    let times: number[] = [];
    let unlocked = false;
    for (const t of [0, 1500, 3000, 4500, 6000]) {
      ({ times, unlocked } = press(times, t));
      expect(unlocked).toBe(false);
    }
  });

  it("una rafaga tardia si cuenta aunque haya pulsaciones viejas delante", () => {
    let times: number[] = [];
    let unlocked = false;
    // Dos pulsaciones sueltas y antiguas, y despues cinco seguidas.
    for (const t of [0, 5000, 20000, 20100, 20200, 20300, 20400]) {
      ({ times, unlocked } = press(times, t));
    }
    expect(unlocked).toBe(true);
  });
});
