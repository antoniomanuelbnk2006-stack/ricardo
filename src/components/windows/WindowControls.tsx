interface WindowControlsProps {
  title: string;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

// Los tres botones llevan aria-label porque su contenido visible es un
// glifo ("_", cuadro, "X") que un lector de pantalla no sabe nombrar.
export function WindowControls({ title, onMinimize, onMaximize, onClose }: WindowControlsProps) {
  return (
    <div className="win-titlebar-controls" onPointerDown={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="win-titlebar-btn"
        aria-label={`Minimizar ${title}`}
        onClick={onMinimize}
      >
        <span aria-hidden="true">_</span>
      </button>
      <button
        type="button"
        className="win-titlebar-btn"
        aria-label={`Maximizar ${title}`}
        onClick={onMaximize}
      >
        <span aria-hidden="true">&#9633;</span>
      </button>
      <button
        type="button"
        className="win-titlebar-btn"
        aria-label={`Cerrar ${title}`}
        onClick={onClose}
      >
        <span aria-hidden="true">X</span>
      </button>
    </div>
  );
}
