import { createContext, useContext } from "react";

// El lienzo 1024x768 se pinta a tamano logico y se escala con
// `transform: scale()`. Todo lo que traduzca pixeles de PANTALLA a
// pixeles del LIENZO (arrastrar ventanas, por ejemplo) necesita conocer
// ese factor: sin el, una ventana se mueve mas lento o mas rapido que el
// puntero en cuanto la ventana del navegador no mide exactamente
// 1056x800. Se expone por contexto para no recalcularlo en cada
// componente ni pasarlo por props a traves de medio arbol.
export const ScaleContext = createContext(1);

export function useCanvasScale(): number {
  return useContext(ScaleContext);
}
