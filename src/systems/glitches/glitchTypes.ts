import type { CorruptionLevel } from "../corruption/corruptionTypes";
export type { CorruptionLevel };

export interface GlitchLevelConfig {
  flicker: boolean;
  cursorJitter: boolean;
  textGlitch: boolean;
  staticNoise: boolean;
  rgbShift: boolean;
  windowJitter: boolean;
  scanlineArtifacts: boolean;
  blackouts: boolean;
}
