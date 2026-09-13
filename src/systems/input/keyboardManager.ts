import { useEffect, useRef } from "react";
import { isDigit } from "../../utils/validation";
import { checkCodeBuffer, registerEscPress } from "../secrets/secretSystem";
import type { SecretId } from "../../types/game";

interface KeyboardManagerOptions {
  onSecret: (id: SecretId) => void;
}

// Escucha global de teclado: buffer de codigo "0437" (secreto #05) y
// deteccion de bucle por pulsaciones repetidas de ESC (secreto #04).
export function useKeyboardManager({ onSecret }: KeyboardManagerOptions): void {
  const bufferRef = useRef("");
  // Marcas de tiempo de las ultimas pulsaciones de ESC. Sin temporizador:
  // la ventana se comprueba comparando la primera y la ultima.
  const escTimesRef = useRef<number[]>([]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isDigit(e.key)) {
        bufferRef.current = (bufferRef.current + e.key).slice(-4);
        const found = checkCodeBuffer(bufferRef.current);
        if (found) onSecret(found);
      }
      if (e.key === "Escape") {
        const { times, unlocked } = registerEscPress(escTimesRef.current, Date.now());
        escTimesRef.current = times;
        if (unlocked) onSecret("s4");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onSecret]);
}
