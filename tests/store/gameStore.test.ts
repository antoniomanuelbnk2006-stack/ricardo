import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "../../src/store/gameStore";
import { initialGameState } from "../../src/systems/game/gameState";

describe("gameStore: rejugabilidad", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useGameStore.setState(initialGameState);
  });

  it("restartSession() borra progreso y estadisticas pero conserva secretos y ajustes", () => {
    useGameStore.setState({
      secretsFound: ["s1", "s2"],
      completedProtocols: ["01", "02"],
      corruptionLevel: 1,
    });
    useGameStore.getState().tickClick();
    useGameStore.getState().setMuted(true);

    useGameStore.getState().restartSession();

    const s = useGameStore.getState();
    expect(s.completedProtocols).toEqual([]);
    expect(s.corruptionLevel).toBe(0);
    expect(s.stats.totalClicks).toBe(0);
    expect(s.secretsFound).toEqual(["s1", "s2"]); // se conservan
    expect(s.settings.audioMuted).toBe(true); // los ajustes tambien se conservan
  });

  it("resetGameData() borra TODO el progreso, secretos y estadisticas, pero conserva los ajustes", () => {
    useGameStore.setState({
      secretsFound: ["s1", "s2", "s3"],
      completedProtocols: ["01", "02", "03"],
      corruptionLevel: 2,
      programRemoved: true,
    });
    useGameStore.getState().tickClick();
    useGameStore.getState().setCrtEnabled(false);

    useGameStore.getState().resetGameData();

    const s = useGameStore.getState();
    expect(s.secretsFound).toEqual([]);
    expect(s.completedProtocols).toEqual([]);
    expect(s.corruptionLevel).toBe(0);
    expect(s.stats.totalClicks).toBe(0);
    expect(s.programRemoved).toBe(false);
    expect(s.settings.crtEnabled).toBe(false); // los ajustes NO se borran
  });
});
