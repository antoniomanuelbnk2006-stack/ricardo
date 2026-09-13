import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../../src/App";
import { useGameStore } from "../../src/store/gameStore";
import { useWindowStore } from "../../src/store/windowStore";
import { initialGameState } from "../../src/systems/game/gameState";

// La biblia exige "sin errores de consola durante una partida normal"
// (seccion 17). Este test abre las ventanas del escritorio, arrastra una,
// la minimiza y cierra otra vigilando console.error/warn: cualquier aviso
// de React (keys duplicadas, updates fuera de act, props no validas...)
// hace fallar la suite en vez de pasar desapercibido.
describe("consola limpia", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    window.localStorage.clear();
    useGameStore.setState(initialGameState);
    useWindowStore.setState({ open: [], focused: null });
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it("abrir, mover, minimizar y cerrar ventanas no ensucia la consola", () => {
    render(<App />);

    // fireEvent.dblClick envuelve el evento en act(), de forma que React
    // aplica el render antes de la siguiente linea. Un dispatchEvent a
    // pelo actualizaria el store pero dejaria el arbol sin repintar.
    for (const label of ["Mis archivos", "Papelera", "Config"]) {
      fireEvent.dblClick(screen.getByText(label));
    }

    const configWindow = screen.getByRole("region", { name: "Config" });
    const titleBar = configWindow.firstElementChild as HTMLElement;
    // jsdom no implementa PointerEvent; MouseEvent si lleva clientX/clientY.
    const pointer = (type: string, x: number, y: number) =>
      new MouseEvent(type, { clientX: x, clientY: y, button: 0, bubbles: true });
    fireEvent(titleBar, pointer("pointerdown", 100, 100));
    fireEvent(window, pointer("pointermove", 160, 140));
    fireEvent(window, pointer("pointerup", 160, 140));

    fireEvent.click(screen.getByRole("button", { name: "Minimizar Config" }));
    fireEvent.click(screen.getByRole("button", { name: "Cerrar Papelera" }));

    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
