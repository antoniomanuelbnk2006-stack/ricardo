import { Scanlines } from "./Scanlines";
import { Vignette } from "./Vignette";

// Capa CRT permanente (nivel de corrupcion 0): scanlines + vineta + flicker
// muy sutil via la clase .crt-layer definida en styles/crt.css.
export function CRTOverlay() {
  return (
    <div className="crt-layer">
      <Scanlines />
      <Vignette />
    </div>
  );
}
