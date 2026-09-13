import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Terminal } from "../../src/components/terminal/Terminal";

// Regresion: en React.StrictMode (asi es como se monta la app de verdad
// en main.tsx durante desarrollo), los efectos se ejecutan por duplicado
// -- montan, desmontan, vuelven a montar. Un bug anterior reutilizaba la
// MISMA instancia de TypingEngine entre montajes: el primer "cancel()"
// la dejaba inservible para siempre y la terminal se quedaba congelada
// tras el primer caracter ("C" de "C:\RICKYEDIT>" y nada mas).
// Este test NO usa React.StrictMode en el arbol (Testing Library no lo
// aplica por defecto), asi que ademas se prueba montando/desmontando a
// mano para simular el mismo efecto.
describe("Terminal bajo doble montaje (StrictMode)", () => {
  it(
    "sigue avanzando el boot completo aunque el componente se monte, desmonte y remonte",
    async () => {
      const { unmount } = render(
        <React.StrictMode>
          <Terminal onBootComplete={() => {}} />
        </React.StrictMode>
      );

      // Debe llegar mas alla del primer caracter/linea.
      expect(await screen.findByText("INITIALIZING...", {}, { timeout: 5000 })).toBeInTheDocument();
      expect(await screen.findByText("RICKYEDIT.EXE", {}, { timeout: 5000 })).toBeInTheDocument();

      unmount();
    },
    15000
  );

  it(
    "un motor cancelado no revive: crear+cancelar+crear de nuevo (simulando el doble efecto a mano) sigue funcionando",
    async () => {
      const onBootComplete = () => {};
      const { rerender } = render(<Terminal onBootComplete={onBootComplete} key="a" />);
      // Forzamos un remount real con una key distinta, que es exactamente
      // lo que un doble-efecto de StrictMode provoca a nivel de effect.
      rerender(<Terminal onBootComplete={onBootComplete} key="b" />);

      expect(await screen.findByText("OK", {}, { timeout: 8000 })).toBeInTheDocument();
    },
    15000
  );
});
