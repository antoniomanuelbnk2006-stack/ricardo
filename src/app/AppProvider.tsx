import { useEffect } from "react";
import type { ReactNode } from "react";
import { useGameStore } from "../store/gameStore";

interface AppProviderProps {
  children: ReactNode;
}

// Zustand no necesita un React Context para funcionar, pero mantenemos
// este componente (como pide el arbol) como el sitio natural para
// inicializar el juego: cargar la partida guardada de localStorage al
// arrancar la app.
export function AppProvider({ children }: AppProviderProps) {
  const hydrate = useGameStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}
