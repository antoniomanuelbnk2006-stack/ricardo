import { GLITCH_LEVELS } from "../../systems/glitches/glitchDefinitions";
import { useBlackout } from "../../systems/glitches/glitchManager";
import type { CorruptionLevel } from "../../systems/glitches/glitchTypes";
import { StaticNoiseCanvas } from "./StaticNoiseCanvas";

interface GlitchOverlayProps {
  level: CorruptionLevel;
  reducedMotion?: boolean;
}

// Capas puramente visuales que se quedan POR ENCIMA del contenido
// (estatica, apagon). La separacion de canales RGB y el temblor viven en
// AppShell (useScreenDistortion) porque necesitan distorsionar el
// contenido real, no solo superponerse a el.
export function GlitchOverlay({ level, reducedMotion = false }: GlitchOverlayProps) {
  const config = GLITCH_LEVELS[level];
  const blackout = useBlackout(level, reducedMotion);

  if (level === 0) return null;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 8500 }}>
      {config.staticNoise && <StaticNoiseCanvas opacity={0.05 + level * 0.015} />}
      {config.blackouts && blackout && (
        <>
          <div className="blackout-layer" />
          <StaticNoiseCanvas opacity={0.5} intervalMs={40} />
        </>
      )}
    </div>
  );
}
