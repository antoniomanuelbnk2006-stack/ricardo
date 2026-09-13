import type { ReactNode } from "react";
import { WindowTitleBar } from "./WindowTitleBar";

interface WindowProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  x: number;
  y: number;
  w?: number;
  h?: number;
  active: boolean;
  onFocus: () => void;
  onDragTitle?: (e: React.PointerEvent) => void;
}

export function Window({
  title,
  children,
  onClose,
  onMinimize,
  onMaximize,
  x,
  y,
  w = 820,
  h = 580,
  active,
  onFocus,
  onDragTitle,
}: WindowProps) {
  return (
    <section
      className="win-frame"
      aria-label={title}
      onPointerDown={onFocus}
      style={{ left: x, top: y, width: w, height: h, zIndex: active ? 500 : 400 }}
    >
      <WindowTitleBar
        title={title}
        active={active}
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onPointerDown={onDragTitle}
        onDoubleClick={onMaximize}
      />
      <div className="win-content">{children}</div>
    </section>
  );
}
