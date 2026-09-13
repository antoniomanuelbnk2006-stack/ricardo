import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, act, screen } from "@testing-library/react";
import App from "../../src/App";
import { useGameStore } from "../../src/store/gameStore";
import { initialGameState } from "../../src/systems/game/gameState";
import type { SecretId } from "../../src/types/game";

// El contador de secretos mide CUANTOS llevas, nunca CUAL acabas de
// encontrar. Da igual en que orden aparezcan: cada secreto nuevo suma 1.
// Antes esto no se cumplia (el aviso usaba el numero del identificador),
// asi que encontrar "s3" en segundo lugar anunciaba 3/5.
function playInOrder(order: SecretId[]) {
  render(<App />);
  const seen: string[] = [];

  order.forEach((id, index) => {
    act(() => {
      useGameStore.getState().unlockSecret(id);
    });
    act(() => {
      vi.advanceTimersByTime(20);
    });

    seen.push(screen.getByText(`${index + 1}/5 SECRETOS ENCONTRADOS`).textContent ?? "");

    // Se deja expirar el aviso antes del siguiente secreto.
    act(() => {
      vi.advanceTimersByTime(3000);
    });
  });

  return seen;
}

describe("el contador de secretos es independiente del orden", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useGameStore.setState({ ...initialGameState, hydrated: true });
    vi.useFakeTimers();
  });

  const expected = [
    "1/5 SECRETOS ENCONTRADOS",
    "2/5 SECRETOS ENCONTRADOS",
    "3/5 SECRETOS ENCONTRADOS",
    "4/5 SECRETOS ENCONTRADOS",
    "5/5 SECRETOS ENCONTRADOS",
  ];

  it("en orden natural", () => {
    expect(playInOrder(["s1", "s2", "s3", "s4", "s5"])).toEqual(expected);
    vi.useRealTimers();
  });

  it("en orden inverso", () => {
    expect(playInOrder(["s5", "s4", "s3", "s2", "s1"])).toEqual(expected);
    vi.useRealTimers();
  });

  it("en un orden cualquiera", () => {
    expect(playInOrder(["s3", "s1", "s5", "s2", "s4"])).toEqual(expected);
    vi.useRealTimers();
  });

  it("volver a disparar un secreto ya encontrado no suma", () => {
    render(<App />);
    act(() => {
      useGameStore.getState().unlockSecret("s3");
      useGameStore.getState().unlockSecret("s3");
      useGameStore.getState().unlockSecret("s3");
    });
    expect(useGameStore.getState().secretsFound).toEqual(["s3"]);
    vi.useRealTimers();
  });
});
