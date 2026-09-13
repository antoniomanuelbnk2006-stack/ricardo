import type { CorruptionLevel, GlitchLevelConfig } from "./glitchTypes";

export const GLITCH_LEVELS: Record<CorruptionLevel, GlitchLevelConfig> = {
  0: { flicker: false, cursorJitter: false, textGlitch: false, staticNoise: false, rgbShift: false, windowJitter: false, scanlineArtifacts: false, blackouts: false },
  1: { flicker: true, cursorJitter: true, textGlitch: false, staticNoise: false, rgbShift: false, windowJitter: false, scanlineArtifacts: false, blackouts: false },
  2: { flicker: true, cursorJitter: true, textGlitch: true, staticNoise: true, rgbShift: false, windowJitter: false, scanlineArtifacts: false, blackouts: false },
  3: { flicker: true, cursorJitter: true, textGlitch: true, staticNoise: true, rgbShift: true, windowJitter: true, scanlineArtifacts: true, blackouts: false },
  4: { flicker: true, cursorJitter: true, textGlitch: true, staticNoise: true, rgbShift: true, windowJitter: true, scanlineArtifacts: true, blackouts: true },
};
