import { CANVAS_W, CANVAS_H, TASKBAR_H, WINDOW_DRAG_MARGIN } from "../../app/constants";

export interface Point {
  x: number;
  y: number;
}

// El lienzo se pinta a 1024x768 y despues se escala entero con
// `transform: scale()`. El puntero, en cambio, informa en pixeles de
// PANTALLA. Sin esta conversion la ventana se movia mas lento (o mas
// rapido) que el dedo en cuanto el navegador no media exactamente
// 1056x800, que es practicamente siempre.
export function screenDeltaToCanvas(dxScreen: number, dyScreen: number, scale: number): Point {
  // Un evento sin coordenadas utiles (o una escala aun sin medir) producia
  // NaN, y ese NaN acababa en `style.left`, donde el navegador lo descarta y
  // React avisa por consola. Mejor no mover la ventana que moverla a ninguna
  // parte.
  if (!Number.isFinite(dxScreen) || !Number.isFinite(dyScreen)) return { x: 0, y: 0 };
  const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
  return { x: dxScreen / safeScale, y: dyScreen / safeScale };
}

// Mantiene la ventana dentro del escritorio: se puede sacar casi entera
// por los lados, pero siempre queda un trozo agarrable, la barra de
// titulo nunca sube por encima del borde superior y no se puede esconder
// debajo de la barra de tareas. Sin esto, una ventana arrastrada lejos
// desaparecia para siempre.
export function clampWindowPosition(x: number, y: number, width: number): Point {
  // Math.min/max propagan NaN en silencio: se corta aqui.
  if (!Number.isFinite(x) || !Number.isFinite(y)) return { x: 0, y: 0 };
  const maxX = CANVAS_W - WINDOW_DRAG_MARGIN;
  const minX = WINDOW_DRAG_MARGIN - width;
  const maxY = CANVAS_H - TASKBAR_H - WINDOW_DRAG_MARGIN;
  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, 0), maxY),
  };
}
