import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, act, screen } from "@testing-library/react";
import App from "../../src/App";
import { useGameStore } from "../../src/store/gameStore";
import { initialGameState } from "../../src/systems/game/gameState";
import { saveGame } from "../../src/systems/persistence/saveGame";

function savedGameWith(secretsFound: ("s1" | "s2" | "s3" | "s4" | "s5")[]) {
  saveGame({
    playerName: "ANTONIO",
    secretsFound,
    completedProtocols: [],
    corruptionLevel: 0,
    stats: initialGameState.stats,
    settings: initialGameState.settings,
    programRemoved: false,
  });
}

describe("aviso de secreto descubierto", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useGameStore.setState(initialGameState);
  });

  it("cuenta el progreso real, no el numero del identificador", () => {
    // Regresion: con s1 ya encontrado, descubrir s3 anunciaba "03/05"
    // mientras el contador de la esquina decia 2/5. El identificador del
    // secreto no es su posicion en la partida.
    vi.useFakeTimers();
    useGameStore.setState({ ...initialGameState, hydrated: true, secretsFound: ["s1"] });
    render(<App />);

    act(() => {
      useGameStore.getState().unlockSecret("s3");
    });
    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(screen.getByText("2/5 SECRETOS ENCONTRADOS")).toBeInTheDocument();
    expect(screen.getByText("DON'T LOOK AWAY")).toBeInTheDocument();
    expect(screen.queryByText(/3\/5/)).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("no anuncia nada al cargar una partida con secretos ya encontrados", () => {
    // Regresion: al abrir la web con progreso guardado, la cuenta pasaba
    // de 0 a N de golpe y saltaba el aviso como si acabaras de descubrir
    // algo sin haber tocado nada.
    vi.useFakeTimers();
    savedGameWith(["s1", "s3"]);
    render(<App />);
    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(screen.queryByText("SECRET FOUND")).not.toBeInTheDocument();
    expect(useGameStore.getState().secretsFound).toEqual(["s1", "s3"]);
    vi.useRealTimers();
  });

  it("sigue anunciando un secreto descubierto despues de cargar la partida", () => {
    vi.useFakeTimers();
    savedGameWith(["s1", "s3"]);
    render(<App />);
    act(() => {
      vi.advanceTimersByTime(50);
    });

    act(() => {
      useGameStore.getState().unlockSecret("s5");
    });
    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(screen.getByText("SECRET FOUND")).toBeInTheDocument();
    expect(screen.getByText("3/5 SECRETOS ENCONTRADOS")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("el aviso desaparece solo", () => {
    vi.useFakeTimers();
    useGameStore.setState({ ...initialGameState, hydrated: true });
    render(<App />);

    act(() => {
      useGameStore.getState().unlockSecret("s1");
    });
    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(screen.getByText("SECRET FOUND")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByText("SECRET FOUND")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("no anuncia nada cuando la cuenta baja al borrar el progreso", () => {
    vi.useFakeTimers();
    useGameStore.setState({ ...initialGameState, hydrated: true, secretsFound: ["s1", "s2"] });
    render(<App />);

    act(() => {
      useGameStore.getState().resetGameData();
    });
    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(screen.queryByText("SECRET FOUND")).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
