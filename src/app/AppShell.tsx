import { useState } from "react";
import { CANVAS_W, CANVAS_H, COMPACT_VIEWPORT_PX } from "./constants";
import { ScaleContext } from "./ScaleContext";
import { useCanvasFit } from "./useCanvasFit";
import { Desktop } from "../components/desktop/Desktop";
import { Taskbar } from "../components/taskbar/Taskbar";
import { CRTOverlay } from "../components/effects/CRTOverlay";
import { GlitchOverlay } from "../components/effects/GlitchOverlay";
import { SecretToast } from "../components/effects/SecretToast";
import { SvgFilterDefs } from "../components/effects/SvgFilterDefs";
import { RotateHint } from "../components/effects/RotateHint";
import { TvFrame } from "../components/effects/TvFrame";
import { useGameStore } from "../store/gameStore";
import { useKeyboardManager } from "../systems/input/keyboardManager";
import { useScreenDistortion } from "../systems/glitches/useScreenDistortion";

export function AppShell() {
  const [shuttingDown, setShuttingDown] = useState(false);
  const corruptionLevel = useGameStore((s) => s.corruptionLevel);
  const crtEnabled = useGameStore((s) => s.settings.crtEnabled);
  const reducedMotion = useGameStore((s) => s.settings.reducedMotion);
  const tvFramePreferred = useGameStore((s) => s.settings.tvFrameEnabled);
  const unlockSecret = useGameStore((s) => s.unlockSecret);

  // En pantallas estrechas el mueble se come un tercio del ancho y deja el
  // texto ilegible, asi que ahi no se dibuja aunque este activado. Se mide
  // contra el viewport directamente para decidirlo antes de calcular la
  // escala, que depende de si hay marco o no.
  const narrow = typeof window !== "undefined" && window.innerWidth < COMPACT_VIEWPORT_PX;
  const showTvFrame = tvFramePreferred && !narrow;

  const { scale, portraitWarning } = useCanvasFit(showTvFrame);
  const distortion = useScreenDistortion(corruptionLevel, reducedMotion);

  useKeyboardManager({ onSecret: (id) => unlockSecret(id) });

  const filters: string[] = [];
  if (distortion.rgbBurst) filters.push("url(#glitch-rgb-split)");
  if (distortion.frameGlitch) filters.push("contrast(1.35) hue-rotate(12deg) brightness(1.1)");

  // El translate va ANTES del scale para que el temblor del glitch se
  // mida en pixeles de pantalla y no se multiplique por la escala.
  const transform =
    `translate(${distortion.jitterX}px, ${distortion.jitterY}px) scale(${scale})`;

  // El escritorio en si no cambia lleve marco o no: es el mismo lienzo de
  // 1024x768, sin transformaciones propias, asi que las coordenadas del
  // puntero siguen coincidiendo con lo que se ve.
  const desktop = (
    <>
      <Desktop />
      <SecretToast />
      <Taskbar onShutdown={() => setShuttingDown(true)} />
      {crtEnabled && <CRTOverlay />}
      <GlitchOverlay level={corruptionLevel} reducedMotion={reducedMotion} />
      {shuttingDown && (
        <button
          type="button"
          className="shutdown-screen"
          onClick={() => setShuttingDown(false)}
        >
          Ya puede apagar el equipo.
          <span className="shutdown-hint">(pulsa para volver)</span>
        </button>
      )}
    </>
  );

  return (
    <div className="app-viewport">
      <SvgFilterDefs />
      <ScaleContext.Provider value={scale}>
        <div
          className="app-stage"
          style={{ transform, filter: filters.length > 0 ? filters.join(" ") : undefined }}
        >
          {showTvFrame ? (
            <TvFrame>
              <div className="app-canvas app-canvas-framed" style={{ width: CANVAS_W, height: CANVAS_H }}>
                {desktop}
              </div>
            </TvFrame>
          ) : (
            <div className="app-canvas" style={{ width: CANVAS_W, height: CANVAS_H }}>
              {desktop}
            </div>
          )}
        </div>
      </ScaleContext.Provider>
      {portraitWarning && <RotateHint />}
    </div>
  );
}
