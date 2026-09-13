import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import App from "../../src/App";
import { loadGame } from "../../src/systems/persistence/loadGame";
import { SAVE_KEY, saveGame } from "../../src/systems/persistence/saveGame";
import { sanitizeSavedGame, SAVE_VERSION } from "../../src/systems/persistence/sanitize";
import { initialGameState } from "../../src/systems/game/gameState";
import { initialStatistics } from "../../src/types/statistics";
import { useGameStore } from "../../src/store/gameStore";

function writeRaw(value: unknown) {
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(value));
}

describe("saneado de la partida guardada", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useGameStore.setState(initialGameState);
  });

  it("descarta lo que no es un objeto", () => {
    expect(sanitizeSavedGame(null)).toBeNull();
    expect(sanitizeSavedGame("texto")).toBeNull();
    expect(sanitizeSavedGame(42)).toBeNull();
    expect(sanitizeSavedGame(["s1"])).toBeNull();
  });

  it("no acepta una cadena como lista de secretos", () => {
    // Regresion: con `secretsFound` como cadena, `.includes("s1")` compara
    // subcadenas y `.length` cuenta letras, asi que el contador marcaba 4/5
    // y los logros salian desbloqueados solos.
    writeRaw({ secretsFound: "s1s2s3s4" });
    expect(loadGame()?.secretsFound).toEqual([]);
  });

  it("filtra los identificadores desconocidos y los duplicados", () => {
    writeRaw({ secretsFound: ["s1", "s9", "s1", 7, null, "s3"] });
    expect(loadGame()?.secretsFound).toEqual(["s1", "s3"]);
  });

  it("filtra los protocolos invalidos", () => {
    writeRaw({ completedProtocols: ["01", "99", "02", "02", "xx"] });
    expect(loadGame()?.completedProtocols).toEqual(["01", "02"]);
  });

  it("repone las estadisticas cuando vienen con tipos imposibles", () => {
    writeRaw({ stats: 5 });
    expect(loadGame()?.stats).toEqual(initialStatistics);
  });

  it("corrige valores negativos y no numericos dentro de las estadisticas", () => {
    writeRaw({
      stats: {
        correctAnswers: -3,
        wrongAnswers: "muchos",
        totalClicks: 12,
        fastestResponseMs: -1,
        slowestResponseMs: 900,
        impulseControlFailed: "si",
        restarts: Number.NaN,
      },
    });
    const stats = loadGame()!.stats;
    expect(stats.correctAnswers).toBe(0);
    expect(stats.wrongAnswers).toBe(0);
    expect(stats.totalClicks).toBe(12); // lo valido se conserva
    expect(stats.fastestResponseMs).toBeNull();
    expect(stats.slowestResponseMs).toBe(900);
    expect(stats.impulseControlFailed).toBe(false);
    expect(stats.restarts).toBe(0);
  });

  it("recorta los volumenes al rango 0..1 y conserva el resto de ajustes", () => {
    writeRaw({
      settings: { volumeMaster: 9, volumeUI: -2, crtEnabled: false, reducedMotion: "no" },
    });
    const settings = loadGame()!.settings;
    expect(settings.volumeMaster).toBe(1);
    expect(settings.volumeUI).toBe(0);
    expect(settings.crtEnabled).toBe(false); // valido, se respeta
    expect(settings.reducedMotion).toBe(false); // invalido, por defecto
  });

  it("deriva el nivel de corrupcion si el guardado trae uno imposible", () => {
    writeRaw({ completedProtocols: ["01", "02", "03"], corruptionLevel: 99 });
    expect(loadGame()?.corruptionLevel).toBe(3);
  });

  it("limpia el nombre del jugador y lo recorta al maximo", () => {
    writeRaw({ playerName: "   ricky    edit   " });
    expect(loadGame()?.playerName).toBe("ricky edit");

    writeRaw({ playerName: "a".repeat(60) });
    expect(loadGame()!.playerName.length).toBe(16);

    writeRaw({ playerName: { nope: true } });
    expect(loadGame()?.playerName).toBe("");
  });

  it("un guardado a medias conserva lo que si es valido", () => {
    writeRaw({ secretsFound: ["s2"] }); // sin stats, settings ni nombre
    const loaded = loadGame()!;
    expect(loaded.secretsFound).toEqual(["s2"]);
    expect(loaded.stats).toEqual(initialStatistics);
    expect(loaded.settings).toEqual(initialGameState.settings);
    expect(loaded.programRemoved).toBe(false);
  });

  it("JSON invalido no revienta la carga", () => {
    window.localStorage.setItem(SAVE_KEY, "{{{no es json");
    expect(loadGame()).toBeNull();
  });

  it("escribe la version del formato", () => {
    saveGame({
      playerName: "ANTONIO",
      secretsFound: ["s1"],
      completedProtocols: [],
      corruptionLevel: 0,
      stats: initialGameState.stats,
      settings: initialGameState.settings,
      programRemoved: false,
    });
    const raw = JSON.parse(window.localStorage.getItem(SAVE_KEY)!);
    expect(raw.version).toBe(SAVE_VERSION);
    expect(loadGame()?.playerName).toBe("ANTONIO");
  });

  it("la app arranca sin romperse con un guardado corrupto", () => {
    writeRaw({ secretsFound: "s1s2s3s4s5", stats: "roto", settings: 0, playerName: 99 });
    expect(() => render(<App />)).not.toThrow();
    expect(useGameStore.getState().secretsFound).toEqual([]);
  });
});
