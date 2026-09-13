import type { GameState } from "../../types/game";
import { initialStatistics } from "../../types/statistics";

export const initialGameState: GameState = {
  hydrated: false,
  playerName: "",
  completedProtocols: [],
  secretsFound: [],
  corruptionLevel: 0,
  stats: initialStatistics,
  settings: {
    audioMuted: false,
    volumeMaster: 0.35,
    volumeAmbience: 1,
    volumeUI: 1,
    volumeGlitch: 1,
    crtEnabled: true,
    reducedMotion: false,
    tvFrameEnabled: true,
  },
  programRemoved: false,
};
