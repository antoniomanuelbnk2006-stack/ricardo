import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Protocol05 } from "../../src/protocols/protocol05/Protocol05";
import { useGameStore } from "../../src/store/gameStore";
import { initialGameState } from "../../src/systems/game/gameState";

// Regresion: la pregunta final de recall ("cuantos protocolos has
// completado") se respondia siempre contra un "5" fijo, aunque PROTOCOL 05
// (donde se hace la pregunta) todavia no se hubiera marcado como
// completado -- el progreso real en ese instante es 4, no 5.
describe("Protocol05: pregunta de recall sobre protocolos completados", () => {
  beforeEach(() => {
    useGameStore.setState({ ...initialGameState, completedProtocols: ["01", "02", "03", "04"] });
  });

  it("marca '4' como correcto y '5' como incorrecto en ese punto de la partida", async () => {
    render(<Protocol05 onComplete={() => {}} />);

    // Avanza las 4 primeras preguntas de recall con cualquier opcion.
    for (let i = 0; i < 4; i++) {
      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[0]);
      await screen.findByText(/PROCESSING|ACCEPTED|INCORRECT/);
      // espera a que pase a la siguiente pregunta (o a la ultima)
      await new Promise((r) => setTimeout(r, 1050));
    }

    // Ahora deberia estar en la ultima pregunta de recall.
    expect(await screen.findByText("¿Cuántos protocolos principales has completado?")).toBeInTheDocument();

    const fiveBtn = screen.getByRole("button", { name: "5" });
    fireEvent.click(fiveBtn);
    expect(await screen.findByText("INCORRECT.")).toBeInTheDocument();
  });
});
