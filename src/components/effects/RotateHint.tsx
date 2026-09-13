// Aviso para moviles en vertical. El lienzo es 4:3 fijo y en un telefono
// de pie se reduce tanto que el texto deja de ser legible; en horizontal
// cabe mas del doble. No bloquea el juego: es una capa avisadora que se
// puede descartar y desaparece sola al girar el dispositivo.
import { useState } from "react";

export function RotateHint() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="rotate-hint" role="status">
      <div className="rotate-hint-box">
        <div className="rotate-hint-glyph" aria-hidden="true">
          &#9114;&#9866;&#9655;
        </div>
        <p className="rotate-hint-title">GIRA EL DISPOSITIVO</p>
        <p className="rotate-hint-text">
          RICKYEDIT.EXE se ejecuta en un monitor 4:3. En horizontal se ve el
          doble de grande.
        </p>
        <button type="button" className="rotate-hint-btn" onClick={() => setDismissed(true)}>
          CONTINUAR ASI
        </button>
      </div>
    </div>
  );
}
