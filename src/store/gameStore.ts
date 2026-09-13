import { create } from "zustand";
import type { GameState, ProtocolId, SecretId } from "../types/game";
import { initialGameState } from "../systems/game/gameState";
import { initialStatistics } from "../types/statistics";
import { deriveCorruptionLevel } from "../systems/corruption/corruptionSystem";
import {
  withAnswer,
  withClick,
  withBacktrack,
  withAnswerChange,
  withImpulseFail,
  withSessionStart,
  withSessionEnd,
  withRestart,
} from "../systems/statistics/statisticsSystem";
import { saveGame } from "../systems/persistence/saveGame";
import { loadGame } from "../systems/persistence/loadGame";
import { audioManager } from "../systems/audio/audioManager";
import { useAudioStore } from "./audioStore";

interface GameStore extends GameState {
  setPlayerName: (name: string) => void;
  startSession: () => void;
  endSession: () => void;
  unlockSecret: (id: SecretId) => void;
  completeProtocol: (id: ProtocolId) => void;
  recordAnswer: (correct: boolean, responseTimeMs: number) => void;
  tickClick: () => void;
  tickBacktrack: () => void;
  tickAnswerChange: () => void;
  flagImpulseFail: () => void;
  setMuted: (muted: boolean) => void;
  setVolumeMaster: (volume: number) => void;
  setVolumeAmbience: (volume: number) => void;
  setVolumeUI: (volume: number) => void;
  setVolumeGlitch: (volume: number) => void;
  setCrtEnabled: (enabled: boolean) => void;
  setTvFrameEnabled: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  removeProgram: () => void;
  hydrate: () => void;
  // Rejugabilidad (biblia de publicacion, secciones 23-24):
  restartSession: () => void; // vuelve a jugar sin perder secretos ni ajustes
  resetGameData: () => void; // borra progreso + secretos + estadisticas
}

function persistSlice(state: GameState): void {
  saveGame({
    playerName: state.playerName,
    secretsFound: state.secretsFound,
    completedProtocols: state.completedProtocols,
    corruptionLevel: state.corruptionLevel,
    stats: state.stats,
    settings: state.settings,
    programRemoved: state.programRemoved,
  });
}

function syncAudioStore(settings: GameState["settings"]): void {
  useAudioStore.setState({
    muted: settings.audioMuted,
    volumeMaster: settings.volumeMaster,
    volumeAmbience: settings.volumeAmbience,
    volumeUI: settings.volumeUI,
    volumeGlitch: settings.volumeGlitch,
  });
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialGameState,

  hydrate: () => {
    const saved = loadGame();
    if (!saved) {
      set({ hydrated: true });
      return;
    }
    set({
      hydrated: true,
      playerName: saved.playerName ?? "",
      secretsFound: saved.secretsFound,
      completedProtocols: saved.completedProtocols,
      corruptionLevel: saved.corruptionLevel,
      stats: saved.stats,
      settings: saved.settings,
      programRemoved: saved.programRemoved,
    });
    syncAudioStore(saved.settings);
  },

  // El nombre se guarda ya validado (utils/validation.ts) y nunca sale
  // del navegador: solo alimenta los mensajes del terminal y el informe.
  setPlayerName: (name) => {
    set({ playerName: name });
    persistSlice(get());
  },

  // Cronometro de la partida (biblia, seccion 9). Se arranca al abrir el
  // .exe y se congela al llegar al informe; entre medias no se toca, para
  // que hablar o pensar durante un directo no cueste nada.
  startSession: () => {
    set((s) => ({ stats: withSessionStart(s.stats, Date.now()) }));
    persistSlice(get());
  },
  endSession: () => {
    set((s) => ({ stats: withSessionEnd(s.stats, Date.now()) }));
    persistSlice(get());
  },

  unlockSecret: (id) => {
    if (get().secretsFound.includes(id)) return;
    set((s) => ({ secretsFound: [...s.secretsFound, id] }));
    audioManager.playSecret();
    persistSlice(get());
  },

  completeProtocol: (id) => {
    if (get().completedProtocols.includes(id)) return;
    set((s) => {
      const completedProtocols = [...s.completedProtocols, id];
      return { completedProtocols, corruptionLevel: deriveCorruptionLevel(completedProtocols) };
    });
    persistSlice(get());
  },

  recordAnswer: (correct, responseTimeMs) => {
    set((s) => ({ stats: withAnswer(s.stats, correct, responseTimeMs) }));
    persistSlice(get());
  },
  tickClick: () => set((s) => ({ stats: withClick(s.stats) })),
  tickBacktrack: () => set((s) => ({ stats: withBacktrack(s.stats) })),
  tickAnswerChange: () => set((s) => ({ stats: withAnswerChange(s.stats) })),
  flagImpulseFail: () => {
    set((s) => ({ stats: withImpulseFail(s.stats) }));
    persistSlice(get());
  },

  setMuted: (muted) => {
    set((s) => ({ settings: { ...s.settings, audioMuted: muted } }));
    syncAudioStore(get().settings);
    audioManager.refreshVolume();
    persistSlice(get());
  },
  setVolumeMaster: (volume) => {
    set((s) => ({ settings: { ...s.settings, volumeMaster: volume } }));
    syncAudioStore(get().settings);
    audioManager.refreshVolume();
    persistSlice(get());
  },
  setVolumeAmbience: (volume) => {
    set((s) => ({ settings: { ...s.settings, volumeAmbience: volume } }));
    syncAudioStore(get().settings);
    audioManager.refreshVolume();
    persistSlice(get());
  },
  setVolumeUI: (volume) => {
    set((s) => ({ settings: { ...s.settings, volumeUI: volume } }));
    syncAudioStore(get().settings);
    persistSlice(get());
  },
  setVolumeGlitch: (volume) => {
    set((s) => ({ settings: { ...s.settings, volumeGlitch: volume } }));
    syncAudioStore(get().settings);
    persistSlice(get());
  },
  setCrtEnabled: (enabled) => {
    set((s) => ({ settings: { ...s.settings, crtEnabled: enabled } }));
    persistSlice(get());
  },

  setTvFrameEnabled: (enabled) => {
    set((st) => ({ settings: { ...st.settings, tvFrameEnabled: enabled } }));
    persistSlice(get());
  },
  setReducedMotion: (enabled) => {
    set((s) => ({ settings: { ...s.settings, reducedMotion: enabled } }));
    persistSlice(get());
  },

  removeProgram: () => {
    set({ programRemoved: true });
    persistSlice(get());
  },

  // Reinicia la partida (protocolos + estadisticas) pero conserva los
  // secretos ya encontrados y los ajustes: "el jugador debe poder volver
  // a jugar para mejorar estadisticas" sin perder lo ya descubierto.
  restartSession: () => {
    set((s) => ({
      completedProtocols: [],
      corruptionLevel: 0,
      // withRestart parte de las estadisticas en blanco pero conserva (e
      // incrementa) el contador de reinicios, que es una metrica pedida.
      stats: withRestart(s.stats),
    }));
    persistSlice(get());
  },

  // Borra TODO: progreso, secretos y estadisticas (con confirmacion en la
  // UI antes de llamar a esto). Conserva los ajustes (audio, CRT, etc).
  resetGameData: () => {
    set({
      playerName: "",
      secretsFound: [],
      completedProtocols: [],
      corruptionLevel: 0,
      stats: initialStatistics,
      programRemoved: false,
    });
    persistSlice(get());
  },
}));
