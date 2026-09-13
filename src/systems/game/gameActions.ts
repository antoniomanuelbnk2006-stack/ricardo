import type { useGameStore } from "../../store/gameStore";

// Firma de las acciones del gameStore, derivada del propio store en vez de
// reescrita a mano. La version anterior era una copia manual que ya se
// habia desincronizado (declaraba un `setVolume` inexistente y le faltaban
// la mitad de las acciones reales); derivandola, cualquier cambio en el
// store se propaga solo.
type Store = ReturnType<typeof useGameStore.getState>;

export type GameActions = {
  [K in keyof Store as Store[K] extends (...args: never[]) => unknown ? K : never]: Store[K];
};
