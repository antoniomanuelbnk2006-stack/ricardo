import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../../src/App";
import { useGameStore } from "../../src/store/gameStore";
import { useWindowStore } from "../../src/store/windowStore";
import { initialGameState } from "../../src/systems/game/gameState";

// Test de integracion largo: enciende RICKYEDIT.EXE y comprueba que el
// boot + la identificacion + la intro tipeada + el primer "exhibit" de
// PROTOCOL 01 llegan a pintarse sin que ningun componente rompa el arbol.
// Usa timers reales porque el motor de tipeo depende de setTimeout
// encadenados.
describe("flujo RICKYEDIT.EXE", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useGameStore.setState(initialGameState);
    useWindowStore.setState({ open: [], focused: null });
  });

  it(
    "arranca, hace el boot, pide el nombre y llega al primer exhibit de PROTOCOL 01",
    async () => {
      render(<App />);
      const icon = screen.getByText("RICKYEDIT.EXE");
      icon.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));

      // Boot: aparece la primera linea casi al instante.
      expect(await screen.findByText("C:\\RICKYEDIT>", {}, { timeout: 3000 })).toBeInTheDocument();

      // Identificacion: el boot termina pidiendo el nombre del jugador.
      const input = await screen.findByLabelText("C:\\RICKYEDIT>", {}, { timeout: 15000 });
      fireEvent.change(input, { target: { value: "ANTONIO" } });
      fireEvent.click(screen.getByRole("button", { name: "REGISTRAR" }));
      expect(useGameStore.getState().playerName).toBe("ANTONIO");

      // Bienvenida tipeada con el nombre registrado.
      expect(
        await screen.findByText("USUARIO REGISTRADO: ANTONIO", {}, { timeout: 12000 })
      ).toBeInTheDocument();

      // Intro de PROTOCOL 01 y primer exhibit de la prueba de memoria.
      expect(await screen.findByText("MEMORY", {}, { timeout: 15000 })).toBeInTheDocument();
      expect(await screen.findByText("DEVICE 01", {}, { timeout: 10000 })).toBeInTheDocument();
    },
    60000
  );
});
