import { describe, it, expect } from "vitest";
import { clampWindowPosition, screenDeltaToCanvas } from "../../src/components/windows/dragGeometry";
import { CANVAS_W, CANVAS_H, TASKBAR_H, WINDOW_DRAG_MARGIN } from "../../src/app/constants";

describe("screenDeltaToCanvas", () => {
  it("a escala 1 el movimiento del puntero es el de la ventana", () => {
    expect(screenDeltaToCanvas(40, -20, 1)).toEqual({ x: 40, y: -20 });
  });

  it("compensa la escala del lienzo: a media escala, 40px de pantalla son 80 del lienzo", () => {
    expect(screenDeltaToCanvas(40, 20, 0.5)).toEqual({ x: 80, y: 40 });
  });

  it("no divide por cero si la escala aun no se ha medido", () => {
    expect(screenDeltaToCanvas(10, 10, 0)).toEqual({ x: 10, y: 10 });
  });
});

describe("clampWindowPosition", () => {
  it("deja pasar una posicion que ya esta dentro del escritorio", () => {
    expect(clampWindowPosition(100, 40, 820)).toEqual({ x: 100, y: 40 });
  });

  it("impide que la ventana suba por encima del borde superior", () => {
    expect(clampWindowPosition(100, -500, 820).y).toBe(0);
  });

  it("impide que la ventana se esconda debajo de la barra de tareas", () => {
    expect(clampWindowPosition(100, 99999, 820).y).toBe(CANVAS_H - TASKBAR_H - WINDOW_DRAG_MARGIN);
  });

  it("siempre deja un trozo agarrable por ambos lados", () => {
    expect(clampWindowPosition(-99999, 40, 820).x).toBe(WINDOW_DRAG_MARGIN - 820);
    expect(clampWindowPosition(99999, 40, 820).x).toBe(CANVAS_W - WINDOW_DRAG_MARGIN);
  });
});

// Regresion: el arrastre descartaba cualquier evento con `button !== 0`.
// En entornos y dispositivos que no informan del boton en el contacto
// inicial eso dejaba las ventanas inmoviles sin ningun error visible.
describe("filtro de boton del puntero", () => {
  function isSecondaryButton(button: number | undefined): boolean {
    return (button as number) > 0;
  }

  it("acepta el boton principal, el dedo y el lapiz", () => {
    expect(isSecondaryButton(0)).toBe(false);
    expect(isSecondaryButton(-1)).toBe(false);
    expect(isSecondaryButton(undefined)).toBe(false);
  });

  it("sigue descartando los botones secundarios", () => {
    expect(isSecondaryButton(1)).toBe(true); // central
    expect(isSecondaryButton(2)).toBe(true); // derecho
    expect(isSecondaryButton(3)).toBe(true); // lateral
  });
});

// Regresion: un evento sin coordenadas utiles generaba NaN, que acababa en
// style.left y hacia que React avisara por consola.
describe("robustez ante valores no finitos", () => {
  it("un delta invalido no mueve la ventana", () => {
    expect(screenDeltaToCanvas(Number.NaN, 10, 1)).toEqual({ x: 0, y: 0 });
    expect(screenDeltaToCanvas(10, Number.NaN, 1)).toEqual({ x: 0, y: 0 });
  });

  it("una escala sin medir no genera infinitos", () => {
    expect(screenDeltaToCanvas(10, 10, Number.NaN)).toEqual({ x: 10, y: 10 });
  });

  it("clampWindowPosition nunca devuelve NaN", () => {
    const p = clampWindowPosition(Number.NaN, Number.NaN, 820);
    expect(Number.isFinite(p.x)).toBe(true);
    expect(Number.isFinite(p.y)).toBe(true);
  });
});
