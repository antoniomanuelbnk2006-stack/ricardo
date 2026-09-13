import { useEffect, useState } from "react";
import type { CorruptionLevel } from "./glitchTypes";

// Controla el blackout aleatorio de nivel 4 (300-800ms, cada 15-35s aprox).
// Con reducedMotion (accesibilidad / flash warning) se desactiva por
// completo: un apagon total es exactamente el tipo de destello fuerte que
// esa opcion debe evitar.
export function useBlackout(level: CorruptionLevel, reducedMotion = false): boolean {
  const [blackout, setBlackout] = useState(false);

  useEffect(() => {
    if (level < 4 || reducedMotion) {
      setBlackout(false);
      return;
    }
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function loop() {
      const delay = 15000 + Math.random() * 20000;
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        setBlackout(true);
        setTimeout(() => {
          if (!cancelled) setBlackout(false);
        }, 300 + Math.random() * 500);
        loop();
      }, delay);
    }
    loop();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [level, reducedMotion]);

  return blackout;
}
