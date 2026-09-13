import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { SECRET_DEFINITIONS } from "./secretDefinitions";
import type { SecretId } from "../../types/game";

export interface SecretDiscovery {
  /** Secreto recien descubierto, o null si no hay ninguno que anunciar. */
  id: SecretId | null;
  /** Nombre legible del secreto ("DON'T LOOK AWAY"). */
  name: string | null;
  /** Cuantos secretos hay encontrados EN TOTAL, de 0 a 5. */
  count: number;
}

function secretName(id: SecretId): string {
  return SECRET_DEFINITIONS.find((s) => s.id === id)?.name ?? id.toUpperCase();
}

// Fuente unica para "acaba de aparecer un secreto nuevo". Antes esta
// logica estaba duplicada en SecretToast y en useSecretFlash, con el
// mismo fallo en los dos: al cargar una partida guardada, la cuenta
// pasaba de 0 a N de golpe y se anunciaba como si el jugador acabara de
// descubrir algo. Por eso se espera a que el estado este hidratado y se
// sincroniza el contador sin anunciar nada en esa primera transicion.
export function useSecretDiscovery(holdMs: number): SecretDiscovery {
  const secretsFound = useGameStore((s) => s.secretsFound);
  const hydrated = useGameStore((s) => s.hydrated);
  const [discovery, setDiscovery] = useState<SecretDiscovery>({ id: null, name: null, count: 0 });
  const prevCountRef = useRef(0);
  const wasHydratedRef = useRef(false);

  useEffect(() => {
    const justHydrated = !wasHydratedRef.current && hydrated;
    wasHydratedRef.current = hydrated;

    // Antes de hidratar, y en el instante exacto en que se hidrata, solo
    // se pone el contador al dia: lo que venia de localStorage no es un
    // descubrimiento.
    if (!hydrated || justHydrated) {
      prevCountRef.current = secretsFound.length;
      return;
    }

    if (secretsFound.length <= prevCountRef.current) {
      // Cubre tambien RESET GAME DATA, que hace bajar la cuenta.
      prevCountRef.current = secretsFound.length;
      return;
    }

    const id = secretsFound[secretsFound.length - 1];
    prevCountRef.current = secretsFound.length;
    setDiscovery({ id, name: secretName(id), count: secretsFound.length });

    const timer = setTimeout(
      () => setDiscovery({ id: null, name: null, count: secretsFound.length }),
      holdMs
    );
    return () => clearTimeout(timer);
  }, [secretsFound, hydrated, holdMs]);

  return discovery;
}
