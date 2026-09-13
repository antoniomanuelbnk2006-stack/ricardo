interface FileItemProps {
  name: string;
  /** Marca opcional a la derecha (por ejemplo "2/5" en el registro de logros). */
  badge?: string;
  onOpen: () => void;
}

// Era un <div> con onClick: no se podia abrir con teclado ni lo anunciaba
// un lector de pantalla. Ahora es un boton de verdad.
export function FileItem({ name, badge, onOpen }: FileItemProps) {
  return (
    <button type="button" className="files-list-item" onClick={onOpen}>
      <span>{name}</span>
      {badge && <span className="files-item-badge">{badge}</span>}
    </button>
  );
}
