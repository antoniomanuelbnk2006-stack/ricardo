import { create } from "zustand";

// Espejo minimo de los ajustes de audio para que audioManager (que no
// puede importar el gameStore sin crear un ciclo de imports) lea el
// valor actual sin depender de props. gameStore es quien escribe aqui
// (ver store/gameStore.ts) -- este store NUNCA importa gameStore.
interface AudioStore {
  muted: boolean;
  volumeMaster: number;
  volumeAmbience: number;
  volumeUI: number;
  volumeGlitch: number;
}

export const useAudioStore = create<AudioStore>(() => ({
  muted: false,
  volumeMaster: 0.35,
  volumeAmbience: 1,
  volumeUI: 1,
  volumeGlitch: 1,
}));
