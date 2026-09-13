// Iconos dibujados a mano con SVG (sin assets binarios todavia, ver
// public/assets/icons/README.md). El de RICKYEDIT.EXE es deliberadamente
// generico/torpe -- como un .exe cualquiera, con un detalle "roto" en
// la esquina (un pixel de color equivocado) para sugerir que algo no
// esta del todo bien.
export function RickyIconGlyph() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="5" y="3" width="19" height="24" fill="#f2f2f2" stroke="#5a5a5a" />
      <polygon points="18,3 24,3 24,9 18,3" fill="#c0c0c0" stroke="#5a5a5a" />
      <rect x="8" y="12" width="13" height="2" fill="#8a8a8a" />
      <rect x="8" y="16" width="13" height="2" fill="#8a8a8a" />
      <rect x="8" y="20" width="8" height="2" fill="#8a8a8a" />
      <circle cx="20" cy="21" r="1.6" fill="#ff2b2b" />
      <rect x="23" y="25" width="2" height="2" fill="#33cc66" />
    </svg>
  );
}

export function FolderIconGlyph() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="3" y="10" width="26" height="16" fill="#ffcc33" stroke="#7a5a00" />
      <rect x="3" y="7" width="12" height="5" fill="#ffcc33" stroke="#7a5a00" />
      <rect x="4" y="11" width="24" height="14" fill="#ffde7a" />
    </svg>
  );
}

export function TrashIconGlyph() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="9" y="9" width="14" height="3" fill="#808080" />
      <rect x="7" y="12" width="18" height="2" fill="#404040" />
      <rect x="9" y="14" width="14" height="13" fill="#c0c0c0" stroke="#404040" />
      <rect x="12" y="16" width="1.5" height="9" fill="#808080" />
      <rect x="15.5" y="16" width="1.5" height="9" fill="#808080" />
      <rect x="19" y="16" width="1.5" height="9" fill="#808080" />
    </svg>
  );
}

export function GearIconGlyph() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
      <rect x="12" y="4" width="8" height="24" fill="#8a9aa8" />
      <rect x="4" y="12" width="24" height="8" fill="#8a9aa8" />
      <rect x="12" y="12" width="8" height="8" fill="#c0c0c0" stroke="#404040" />
    </svg>
  );
}
