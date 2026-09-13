import { useRef } from "react";
import type { ReactNode } from "react";
import { Window } from "./Window";
import { useWindowStore } from "../../store/windowStore";
import type { WindowKind } from "../../types/window";
import { CANVAS_W, CANVAS_H, TASKBAR_H } from "../../app/constants";
import { useCanvasScale } from "../../app/ScaleContext";
import { clampWindowPosition, screenDeltaToCanvas } from "./dragGeometry";

interface DraggableWindowProps {
  kind: WindowKind;
  title: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  children: ReactNode;
}

// Anade arrastre por la titlebar, y minimizar/maximizar de verdad
// (delegado en windowStore para que la taskbar vea el mismo estado).
export function DraggableWindow({ kind, title, x, y, w = 820, h = 580, children }: DraggableWindowProps) {
  const win = useWindowStore((s) => s.open.find((o) => o.kind === kind));
  const focused = useWindowStore((s) => s.focused);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const moveWindow = useWindowStore((s) => s.moveWindow);
  const toggleMinimize = useWindowStore((s) => s.toggleMinimize);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
  const scale = useCanvasScale();
  const cleanupRef = useRef<(() => void) | null>(null);

  if (!win || win.minimized) return null;

  function onDragTitle(e: React.PointerEvent) {
    if (win!.maximized) return;
    // Se descartan solo los botones secundarios (derecho, central, laterales).
    // Comparar con !== 0 era demasiado estricto: hay entornos y dispositivos
    // que no informan de `button` en el contacto inicial, y ahi el arrastre
    // se quedaba muerto sin ningun error visible.
    if (e.button > 0) return;
    focusWindow(kind);

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = x;
    const origY = y;

    function onMove(ev: PointerEvent) {
      const delta = screenDeltaToCanvas(ev.clientX - startX, ev.clientY - startY, scale);
      const next = clampWindowPosition(origX + delta.x, origY + delta.y, w);
      moveWindow(kind, next.x, next.y);
    }
    function onUp() {
      cleanupRef.current?.();
      cleanupRef.current = null;
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    cleanupRef.current = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }

  const displayX = win.maximized ? 0 : x;
  const displayY = win.maximized ? 0 : y;
  const displayW = win.maximized ? CANVAS_W : w;
  const displayH = win.maximized ? CANVAS_H - TASKBAR_H : h;

  return (
    <Window
      title={title}
      x={displayX}
      y={displayY}
      w={displayW}
      h={displayH}
      active={focused === kind}
      onFocus={() => focusWindow(kind)}
      onClose={() => closeWindow(kind)}
      onMinimize={() => toggleMinimize(kind)}
      onMaximize={() => toggleMaximize(kind)}
      onDragTitle={onDragTitle}
    >
      {children}
    </Window>
  );
}
