import { useEffect, useRef, useState } from "react";
import { GLITCH_LEVELS } from "./glitchDefinitions";
import type { CorruptionLevel } from "./glitchTypes";
import { audioManager } from "../audio/audioManager";

export interface ScreenDistortion {
  rgbBurst: boolean;
  frameGlitch: boolean;
  jitterX: number;
  jitterY: number;
}

const IDLE: ScreenDistortion = { rgbBurst: false, frameGlitch: false, jitterX: 0, jitterY: 0 };

// Bursts aleatorios controlados (nunca permanentes) sobre el lienzo
// entero: separacion de canales RGB (rgbShift), un flash de "frame
// corrupto" (textGlitch) y un temblor de 1-2px (cursorJitter/windowJitter).
// La frecuencia e intensidad suben con el nivel de corrupcion.
// Con reducedMotion activado (accesibilidad) se desactivan por completo
// los bursts y el temblor -- solo queda la estatica, que no implica
// movimiento ni destellos fuertes.
export function useScreenDistortion(level: CorruptionLevel, reducedMotion = false): ScreenDistortion {
  const [state, setState] = useState<ScreenDistortion>(IDLE);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setState(IDLE);

    const config = GLITCH_LEVELS[level];
    if (level === 0 || reducedMotion) return;

    let cancelled = false;

    function scheduleJitter() {
      if (!config.cursorJitter) return;
      const delay = 1800 - level * 250 + Math.random() * 1500;
      const t = setTimeout(() => {
        if (cancelled) return;
        setState((s) => ({ ...s, jitterX: (Math.random() - 0.5) * (level >= 3 ? 3 : 1.5), jitterY: (Math.random() - 0.5) * (level >= 3 ? 3 : 1.5) }));
        setTimeout(() => !cancelled && setState((s) => ({ ...s, jitterX: 0, jitterY: 0 })), 90);
        scheduleJitter();
      }, delay);
      timersRef.current.push(t);
    }

    function scheduleFrameGlitch() {
      if (!config.textGlitch) return;
      const delay = 5000 - level * 700 + Math.random() * 4000;
      const t = setTimeout(() => {
        if (cancelled) return;
        setState((s) => ({ ...s, frameGlitch: true }));
        setTimeout(() => !cancelled && setState((s) => ({ ...s, frameGlitch: false })), 90);
        scheduleFrameGlitch();
      }, delay);
      timersRef.current.push(t);
    }

    function scheduleRgbBurst() {
      if (!config.rgbShift) return;
      const delay = 6000 - level * 800 + Math.random() * 5000;
      const t = setTimeout(() => {
        if (cancelled) return;
        setState((s) => ({ ...s, rgbBurst: true }));
        audioManager.playGlitch();
        setTimeout(() => !cancelled && setState((s) => ({ ...s, rgbBurst: false })), 140 + Math.random() * 120);
        scheduleRgbBurst();
      }, delay);
      timersRef.current.push(t);
    }

    scheduleJitter();
    scheduleFrameGlitch();
    scheduleRgbBurst();

    return () => {
      cancelled = true;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [level, reducedMotion]);

  return state;
}
