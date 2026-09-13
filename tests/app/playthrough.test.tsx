import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, act, screen, fireEvent, within } from "@testing-library/react";
import App from "../../src/App";
import { useGameStore } from "../../src/store/gameStore";
import { useWindowStore } from "../../src/store/windowStore";
import { initialGameState } from "../../src/systems/game/gameState";

// Recorre RICKYEDIT.EXE de principio a fin como lo haria un jugador:
// abriendo el programa, escribiendo un nombre y pulsando lo que haya en
// pantalla hasta llegar al informe final. No sustituye a jugar en un
// navegador de verdad (no comprueba nada visual), pero si demuestra que
// los cinco protocolos encadenan sin bloquearse y que el estado final es
// coherente.

const ICON_NAME = "RICKYEDIT.EXE";
// El titulo de la ventana no es el del icono: la barra pone la ruta.
const WINDOW_NAME = "C:\\RICKYEDIT";

function gameWindow(): HTMLElement {
  return screen.getByRole("region", { name: WINDOW_NAME });
}

function tick(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

/** Botones pulsables dentro de la ventana del juego, sin los de la barra de titulo. */
function playableButtons(): HTMLElement[] {
  return within(gameWindow())
    .queryAllByRole("button")
    .filter((b) => !b.className.includes("win-titlebar-btn"));
}

function atReport(): boolean {
  return within(gameWindow()).queryAllByText("SYSTEM REPORT").length > 0;
}

/**
 * Avanza la partida hasta el informe final. En cada vuelta deja correr los
 * temporizadores (tipeo, feedback, estimulos) y pulsa el primer boton
 * disponible. Devuelve cuantas vueltas ha necesitado.
 */
function playUntilReport(maxSteps = 300): number {
  for (let step = 0; step < maxSteps; step++) {
    if (atReport()) return step;
    // Salto generoso: el tipeo del terminal encadena setTimeout de pocos
    // ms y una partida entera son miles de ellos.
    tick(2500);
    if (atReport()) return step;

    // Pantalla de identificacion: hay que escribir antes de pulsar.
    const nameField = document.getElementById("player-name") as HTMLInputElement | null;
    if (nameField) {
      fireEvent.change(nameField, { target: { value: "ANTONIO" } });
    }

    const buttons = playableButtons();
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      continue;
    }
    // Sin botones: pantalla de texto que avanza sola o que se salta al
    // pulsar. Un clic en el cuerpo cubre las secuencias que se pueden
    // acelerar.
    fireEvent.click(gameWindow());
  }
  throw new Error(
    `No se alcanzo el informe final. Ultima pantalla: ${(gameWindow().textContent ?? "").slice(0, 200)}`
  );
}

describe("partida completa de principio a fin", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useGameStore.setState(initialGameState);
    useWindowStore.setState({ open: [], focused: null });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("completa los cinco protocolos y llega al informe final", () => {
    render(<App />);
    fireEvent.dblClick(screen.getByText(ICON_NAME));

    playUntilReport();

    const state = useGameStore.getState();

    // Los cinco protocolos principales quedan registrados.
    expect(state.completedProtocols).toEqual(
      expect.arrayContaining(["01", "02", "03", "04", "05"])
    );

    // El nombre introducido llega hasta el informe.
    expect(state.playerName).toBe("ANTONIO");
    expect(within(gameWindow()).getByText("SUJETO: ANTONIO")).toBeInTheDocument();
  });

  it("las metricas del informe son numeros validos, nunca NaN ni imposibles", () => {
    render(<App />);
    fireEvent.dblClick(screen.getByText(ICON_NAME));
    playUntilReport();

    const { stats } = useGameStore.getState();
    const answered = stats.correctAnswers + stats.wrongAnswers;

    expect(answered).toBeGreaterThan(0);
    for (const value of [
      stats.correctAnswers,
      stats.wrongAnswers,
      stats.totalClicks,
      stats.averageResponseTimeMs,
      stats.responseCount,
      stats.totalTimeMs,
      stats.restarts,
    ]) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
    }

    // Precision entre 0 y 100, sin division por cero.
    const accuracyText = within(gameWindow()).getByText(/^\d+%$/).textContent!;
    const accuracy = Number.parseInt(accuracyText, 10);
    expect(accuracy).toBeGreaterThanOrEqual(0);
    expect(accuracy).toBeLessThanOrEqual(100);

    // El informe no muestra ningun valor roto.
    const report = gameWindow().textContent ?? "";
    expect(report).not.toContain("NaN");
    expect(report).not.toContain("Infinity");
    expect(report).not.toContain("undefined");
  });

  it("sin el codigo 0437, continuar desde el informe lleva al final normal", () => {
    render(<App />);
    fireEvent.dblClick(screen.getByText(ICON_NAME));
    playUntilReport();

    expect(within(gameWindow()).getByText("ENDING").parentElement?.textContent).toContain("NORMAL");

    fireEvent.click(within(gameWindow()).getByRole("button", { name: "Continuar" }));
    tick(200);

    // El final normal cierra la ventana y devuelve al escritorio.
    expect(screen.queryByRole("region", { name: WINDOW_NAME })).not.toBeInTheDocument();
    expect(useGameStore.getState().completedProtocols).not.toContain("00");
  });

  it("con el codigo 0437, continuar desde el informe abre PROTOCOL 00", () => {
    render(<App />);
    fireEvent.dblClick(screen.getByText(ICON_NAME));

    // El codigo se teclea como lo haria el jugador, no se inyecta en el estado.
    for (const key of ["0", "4", "3", "7"]) {
      fireEvent.keyDown(window, { key });
    }
    expect(useGameStore.getState().secretsFound).toContain("s5");

    playUntilReport();

    expect(within(gameWindow()).getByText("ENDING").parentElement?.textContent).toContain("SECRET");

    fireEvent.click(within(gameWindow()).getByRole("button", { name: "Continuar" }));

    // Se deja correr PROTOCOL 00 entero, comprobando por el camino que su
    // pantalla de acceso llega a aparecer.
    // Pasos cortos: la intro se tipea letra a letra y con saltos grandes se
    // pasaria de largo sin llegar a verla completa en ningun momento.
    let sawAvailable = false;
    for (let i = 0; i < 200; i++) {
      const win = screen.queryByRole("region", { name: WINDOW_NAME });
      if (!win) break;
      if ((win.textContent ?? "").includes("PROTOCOL 00 AVAILABLE")) sawAvailable = true;
      tick(300);
    }

    expect(sawAvailable).toBe(true);
    // Al terminar PROTOCOL 00 el programa se desinstala: la ventana se
    // cierra y el icono desaparece del escritorio.
    expect(screen.queryByRole("region", { name: WINDOW_NAME })).not.toBeInTheDocument();
    expect(useGameStore.getState().programRemoved).toBe(true);
    expect(screen.queryByText(ICON_NAME)).not.toBeInTheDocument();
  });

  it("una partida nueva no hereda las metricas de la anterior", () => {
    render(<App />);
    fireEvent.dblClick(screen.getByText(ICON_NAME));
    playUntilReport();

    const before = useGameStore.getState().stats;
    expect(before.correctAnswers + before.wrongAnswers).toBeGreaterThan(0);

    fireEvent.click(within(gameWindow()).getByRole("button", { name: "RESTART SESSION" }));

    const after = useGameStore.getState();
    expect(after.stats.correctAnswers).toBe(0);
    expect(after.stats.wrongAnswers).toBe(0);
    expect(after.stats.totalClicks).toBe(0);
    expect(after.completedProtocols).toEqual([]);
    // El contador de reinicios es lo unico que sobrevive, a proposito.
    expect(after.stats.restarts).toBe(1);
  });
});
