import { useRef } from "react";
import { secretSystemConfig } from "../secrets/secretSystem";

// Hook generico para detectar "cursor inmovil sobre una zona" (secreto #03,
// DON'T LOOK AWAY). Devuelve los handlers a enchufar en onMouseEnter/onMouseLeave.
export function useIdleZone(onIdle: () => void) {
  const stateRef = useRef({ inside: false, timer: 0 as unknown as ReturnType<typeof setTimeout> });

  function onMouseEnter() {
    stateRef.current.inside = true;
    stateRef.current.timer = setTimeout(() => {
      if (stateRef.current.inside) onIdle();
    }, secretSystemConfig.IDLE_ZONE_MS);
  }

  function onMouseLeave() {
    stateRef.current.inside = false;
    clearTimeout(stateRef.current.timer);
  }

  return { onMouseEnter, onMouseLeave };
}
