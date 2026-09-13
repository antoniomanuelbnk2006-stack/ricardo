import { useRef } from "react";
import type { ComponentType } from "react";

interface DesktopIconProps {
  label: string;
  Glyph: ComponentType;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export function DesktopIcon({ label, Glyph, selected, onSelect, onOpen }: DesktopIconProps) {
  // En raton el icono se abre con doble click, como en Windows. En tactil
  // el evento `dblclick` es poco fiable (y el navegador lo interpreta como
  // zoom), asi que se replica el gesto a mano: el primer toque selecciona
  // y el segundo sobre un icono ya seleccionado lo abre.
  const wasSelectedRef = useRef(false);

  function handlePointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    wasSelectedRef.current = selected;
    onSelect();
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (e.pointerType === "mouse") return;
    if (wasSelectedRef.current) onOpen();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
      onOpen();
    }
  }

  return (
    <button
      type="button"
      className={selected ? "desktop-icon-btn is-selected" : "desktop-icon-btn"}
      aria-label={`Abrir ${label}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onDoubleClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <span className="desktop-icon-glyph" aria-hidden="true">
        <Glyph />
      </span>
      <span className="desktop-icon-label">{label}</span>
    </button>
  );
}
