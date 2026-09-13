import type { BeepDefinition } from "./audioTypes";

// Definiciones de los efectos. No tenemos ficheros .wav/.mp3 reales todavia
// (ver public/audio/README.md), asi que se generan por sintesis con la
// Web Audio API en audioManager.ts. Howler.js queda instalado y listo para
// el dia que existan assets de audio reales.
export const AUDIO_REGISTRY: Record<string, BeepDefinition> = {
  key: { freq: 950, dur: 0.02, type: "square", gain: 0.015 },
  click: { freq: 220, dur: 0.03, type: "square", gain: 0.035 },
  secretA: { freq: 1200, dur: 0.08, type: "sine", gain: 0.035 },
  secretB: { freq: 1800, dur: 0.1, type: "sine", gain: 0.035 },
  protocolA: { freq: 300, dur: 0.15, type: "triangle", gain: 0.035 },
  protocolB: { freq: 500, dur: 0.2, type: "triangle", gain: 0.035 },
  glitch: { freq: 90, dur: 0.12, type: "sawtooth", gain: 0.035, sweepTo: 40 },
  finalTone: { freq: 110, dur: 2.4, type: "sine", gain: 0.03, sweepTo: 40 },
};
