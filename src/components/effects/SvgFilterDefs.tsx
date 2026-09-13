// Filtro SVG real de separacion de canales RGB (cromatismo de VHS/glitch),
// aplicado via CSS `filter: url(#glitch-rgb-split)` sobre el lienzo
// entero cuando toca un "burst". Mucho mas convincente que un
// repeating-gradient de colores semitransparentes.
export function SvgFilterDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <filter id="glitch-rgb-split" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feOffset in="r" dx="-3" dy="0" result="rOff" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
          <feOffset in="b" dx="3" dy="1" result="bOff" />
          <feBlend in="rOff" in2="g" mode="screen" result="rg" />
          <feBlend in="rg" in2="bOff" mode="screen" />
        </filter>
      </defs>
    </svg>
  );
}
