import { useEffect, useState } from "react";

// Ruta donde debe dejarse la fotografia de escritorio. Se resuelve contra
// BASE_URL para que funcione igual en Vercel (raiz) y en GitHub Pages
// (subcarpeta).
export const WALLPAPER_PATH = "assets/images/ricky-desktop.webp";

// La imagen es opcional: mientras no exista, el escritorio se queda con
// el teal clasico en vez de mostrar un icono de imagen rota. Se precarga
// con `new Image()` y solo se pinta si termina de cargar.
export function useWallpaper(): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof Image === "undefined") return;
    const src = `${import.meta.env.BASE_URL}${WALLPAPER_PATH}`;
    const img = new Image();
    let cancelled = false;
    img.onload = () => {
      if (!cancelled) setUrl(src);
    };
    img.onerror = () => {
      if (!cancelled) setUrl(null);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, []);

  return url;
}
