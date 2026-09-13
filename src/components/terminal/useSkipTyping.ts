import { useEffect } from "react";
import type { RefObject } from "react";
import type { TypingEngine } from "./TypingEngine";

// Click en la pantalla o cualquier tecla completa la linea que se esta
// tipeando ahora mismo (biblia, seccion TERMINAL — SKIP). No salta toda
// la escena de golpe, solo adelanta la linea actual.
//
// Recibe un RefObject (no la instancia directamente): asi el listener de
// teclado se registra UNA sola vez con dependencias estables, y siempre
// lee la instancia mas reciente en el momento del click/tecla -- si
// recibieramos la instancia como valor, un remount (p.ej. el doble
// efecto de React.StrictMode) podria dejar la referencia antigua ya
// cancelada y el terminal se quedaria congelado tras el primer caracter.
export function useSkipTyping(engineRef: RefObject<TypingEngine | null>): { onClick: () => void } {
  useEffect(() => {
    function onKeyDown() {
      engineRef.current?.skipLine();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [engineRef]);

  return {
    onClick: () => engineRef.current?.skipLine(),
  };
}
