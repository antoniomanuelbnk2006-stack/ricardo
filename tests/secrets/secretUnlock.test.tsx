import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, act, screen, fireEvent, within } from "@testing-library/react";
import App from "../../src/App";
import { useGameStore } from "../../src/store/gameStore";
import { useWindowStore } from "../../src/store/windowStore";
import { initialGameState } from "../../src/systems/game/gameState";
import { Protocol03 } from "../../src/protocols/protocol03/Protocol03";
import { P3_TESTS } from "../../src/protocols/protocol03/protocol03.data";

// Cada secreto se desbloquea reproduciendo la accion del jugador (clics,
// teclas, hover), nunca llamando a unlockSecret directamente. Ademas se
// comprueba lo contrario: que la accion "casi correcta" NO lo desbloquea,
// que es donde suelen estar los falsos positivos.

function tick(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function found(): string[] {
  return useGameStore.getState().secretsFound;
}

describe("desbloqueo real de los cinco secretos", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useGameStore.setState({ ...initialGameState, hydrated: true });
    useWindowStore.setState({ open: [], focused: null });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("04/37", () => {
    function openReadme() {
      render(<App />);
      fireEvent.dblClick(screen.getByText("Mis archivos"));
      fireEvent.click(screen.getByText("README.txt"));
    }

    it("se desbloquea al pulsar el codigo dentro de README.txt", () => {
      openReadme();
      expect(found()).toEqual([]);
      fireEvent.click(screen.getByText("04/37"));
      expect(found()).toEqual(["s1"]);
    });

    it("no se desbloquea por abrir el archivo ni por pulsar cualquier otra cosa", () => {
      openReadme();
      // Abrir el README ya ha ocurrido y no ha desbloqueado nada.
      expect(found()).toEqual([]);
      // Pulsar alrededor del codigo tampoco cuenta.
      fireEvent.click(screen.getByText("04/37").parentElement!);
      fireEvent.click(screen.getByRole("button", { name: "Volver" }));
      expect(found()).toEqual([]);
    });

    it("pulsarlo varias veces no lo cuenta dos veces", () => {
      openReadme();
      const code = screen.getByText("04/37");
      fireEvent.click(code);
      fireEvent.click(code);
      fireEvent.click(code);
      expect(found()).toEqual(["s1"]);
    });
  });

  describe("EL VALOR IMPOSIBLE", () => {
    // Se monta PROTOCOL 03 directamente: llegar hasta el en una partida
    // completa haria el test lento y fragil sin comprobar nada mas.
    const anomalyIndex = P3_TESTS.findIndex((t) => t.anomaly === "object-not-exist");

    function playUntilAnomalyQuestion(answers: "correct" | "wrong") {
      render(<Protocol03 onComplete={() => {}} />);
      for (let i = 0; i <= anomalyIndex; i++) {
        const test = P3_TESTS[i];
        const pick =
          answers === "correct" || i < anomalyIndex
            ? test.answer
            : test.options.find((o) => o !== test.answer)!;
        fireEvent.click(screen.getByRole("button", { name: pick }));
        // Feedback + posible anomalia.
        for (let t = 0; t < 12; t++) tick(400);
      }
    }

    it("se desbloquea al acertar la serie con anomalia", () => {
      expect(anomalyIndex).toBeGreaterThanOrEqual(0);
      playUntilAnomalyQuestion("correct");
      expect(found()).toContain("s2");
    });

    it("NO se desbloquea si se falla esa misma serie", () => {
      playUntilAnomalyQuestion("wrong");
      expect(found()).not.toContain("s2");
    });
  });

  describe("DON'T LOOK AWAY", () => {
    function clock() {
      render(<App />);
      return screen.getByRole("button", { name: /Reloj del sistema/ });
    }

    it("se desbloquea tras mantener el raton quieto sobre el reloj", () => {
      fireEvent.mouseEnter(clock());
      tick(7000);
      expect(found()).toEqual([]); // todavia no
      tick(2000);
      expect(found()).toEqual(["s3"]);
    });

    it("apartar el raton antes de tiempo reinicia la cuenta", () => {
      const el = clock();
      fireEvent.mouseEnter(el);
      tick(6000);
      fireEvent.mouseLeave(el);
      tick(6000);
      expect(found()).toEqual([]);

      // Y al volver, la cuenta empieza de cero: 6 s mas no bastan.
      fireEvent.mouseEnter(el);
      tick(6000);
      expect(found()).toEqual([]);
      tick(3000);
      expect(found()).toEqual(["s3"]);
    });
  });

  describe("THE LOOP", () => {
    it("se desbloquea con cinco ESC seguidos", () => {
      render(<App />);
      for (let i = 0; i < 5; i++) fireEvent.keyDown(window, { key: "Escape" });
      expect(found()).toEqual(["s4"]);
    });

    it("cuatro ESC no bastan", () => {
      render(<App />);
      for (let i = 0; i < 4; i++) fireEvent.keyDown(window, { key: "Escape" });
      expect(found()).toEqual([]);
    });

    it("cinco ESC demasiado separados no cuentan", () => {
      render(<App />);
      for (let i = 0; i < 5; i++) {
        fireEvent.keyDown(window, { key: "Escape" });
        tick(1500); // la ventana admitida son 2 s en total
      }
      expect(found()).toEqual([]);
    });
  });

  describe("0437", () => {
    function type(keys: string) {
      render(<App />);
      for (const key of keys) fireEvent.keyDown(window, { key });
    }

    it("se desbloquea al teclear el codigo", () => {
      type("0437");
      expect(found()).toEqual(["s5"]);
    });

    it("no se desbloquea con un codigo parecido", () => {
      type("0473");
      expect(found()).toEqual([]);
    });

    it("no se desbloquea con el codigo incompleto", () => {
      type("043");
      expect(found()).toEqual([]);
    });

    it("se desbloquea aunque haya teclas de sobra delante", () => {
      type("99990437");
      expect(found()).toEqual(["s5"]);
    });

    it("escribir el codigo dentro del campo de nombre NO lo desbloquea", () => {
      // El campo detiene la propagacion a proposito: alguien que se llame
      // "Ricky0437" no debe descubrir el secreto sin querer.
      render(<App />);
      fireEvent.dblClick(screen.getByText("RICKYEDIT.EXE"));
      for (let i = 0; i < 40; i++) tick(400);
      const field = document.getElementById("player-name");
      expect(field).not.toBeNull();
      for (const key of "0437") fireEvent.keyDown(field!, { key });
      expect(found()).toEqual([]);
    });
  });

  describe("contador global", () => {
    it("los cinco secretos suman 5/5 y persisten al recargar", () => {
      render(<App />);

      // 04/37
      fireEvent.dblClick(screen.getByText("Mis archivos"));
      fireEvent.click(screen.getByText("README.txt"));
      fireEvent.click(screen.getByText("04/37"));
      // THE LOOP
      for (let i = 0; i < 5; i++) fireEvent.keyDown(window, { key: "Escape" });
      // 0437
      for (const key of "0437") fireEvent.keyDown(window, { key });
      // DON'T LOOK AWAY
      fireEvent.mouseEnter(screen.getByRole("button", { name: /Reloj del sistema/ }));
      tick(9000);
      // EL VALOR IMPOSIBLE (el unico que vive dentro de un protocolo)
      act(() => {
        useGameStore.getState().unlockSecret("s2");
      });

      expect(found()).toHaveLength(5);

      // Persistencia: se rehidrata desde localStorage como al recargar.
      const saved = found();
      useGameStore.setState({ ...initialGameState });
      act(() => {
        useGameStore.getState().hydrate();
      });
      expect(useGameStore.getState().secretsFound.sort()).toEqual([...saved].sort());
    });

    it("el archivo de logros y el contador coinciden siempre", () => {
      render(<App />);
      for (const key of "0437") fireEvent.keyDown(window, { key });
      for (let i = 0; i < 5; i++) fireEvent.keyDown(window, { key: "Escape" });

      fireEvent.dblClick(screen.getByText("Mis archivos"));
      fireEvent.click(screen.getByText("achievements.log"));

      const ticks = screen
        .getAllByRole("listitem")
        .filter((row) => row.textContent?.includes("[\u2713]"));
      expect(ticks).toHaveLength(found().length);
      expect(within(screen.getByText("ACHIEVEMENTS.LOG").parentElement!).getByText("2/5")).toBeInTheDocument();
    });
  });
});
