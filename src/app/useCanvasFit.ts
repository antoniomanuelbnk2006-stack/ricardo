import { useEffect, useState } from "react";
import {
  CANVAS_W,
  CANVAS_H,
  CANVAS_PADDING,
  CANVAS_PADDING_COMPACT,
  COMPACT_VIEWPORT_PX,
  TV_FRAME_W,
  TV_FRAME_H,
} from "./constants";

export interface CanvasFit {
  scale: number;
  /** Viewport estrecho (movil / ventana pequena): se usa menos margen. */
  compact: boolean;
  /** Movil en vertical: el 4:3 cabe tan pequeno que conviene avisar. */
  portraitWarning: boolean;
}

function measure(withFrame: boolean): CanvasFit {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const compact = vw < COMPACT_VIEWPORT_PX;
  const padding = compact ? CANVAS_PADDING_COMPACT : CANVAS_PADDING;

  // Con el televisor puesto hay que hacer caber el mueble entero, no solo la
  // pantalla: si se midiera contra 1024x768 el marco se saldria del viewport.
  const outerW = withFrame ? TV_FRAME_W : CANVAS_W;
  const outerH = withFrame ? TV_FRAME_H : CANVAS_H;
  const scale = Math.min((vw - padding) / outerW, (vh - padding) / outerH);

  return {
    scale: scale > 0 ? scale : 1,
    compact,
    // Solo avisamos cuando ademas de ser vertical el resultado seria
    // ilegible: un movil apaisado o una ventana pequena de escritorio no
    // deben ver el aviso.
    portraitWarning: vh > vw && scale < 0.5,
  };
}

// Calcula cuanto hay que escalar el lienzo 4:3 (con o sin televisor) para que
// quepa entero en la ventana sin deformarse. Se recalcula en resize y tambien
// en orientationchange, porque en iOS el resize a veces llega antes de que el
// viewport tenga ya las medidas nuevas.
export function useCanvasFit(withFrame: boolean): CanvasFit {
  const [fit, setFit] = useState<CanvasFit>(() =>
    typeof window === "undefined"
      ? { scale: 1, compact: false, portraitWarning: false }
      : measure(withFrame)
  );

  useEffect(() => {
    function update() {
      setFit(measure(withFrame));
    }
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [withFrame]);

  return fit;
}
