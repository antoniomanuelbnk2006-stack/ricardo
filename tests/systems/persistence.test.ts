import { describe, it, expect, beforeEach } from "vitest";
import { saveGame } from "../../src/systems/persistence/saveGame";
import { loadGame } from "../../src/systems/persistence/loadGame";
import { initialGameState } from "../../src/systems/game/gameState";

describe("persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("guarda y recupera el progreso", () => {
    saveGame({
      playerName: "ANTONIO",
      secretsFound: ["s1"],
      completedProtocols: ["01"],
      corruptionLevel: 1,
      stats: initialGameState.stats,
      settings: initialGameState.settings,
      programRemoved: false,
    });
    const loaded = loadGame();
    expect(loaded?.playerName).toBe("ANTONIO");
    expect(loaded?.secretsFound).toEqual(["s1"]);
    expect(loaded?.completedProtocols).toEqual(["01"]);
  });

  it("devuelve null si no hay nada guardado", () => {
    expect(loadGame()).toBeNull();
  });
});
