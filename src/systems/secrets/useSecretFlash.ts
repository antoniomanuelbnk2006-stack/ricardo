import { useSecretDiscovery } from "./useSecretDiscovery";

const FLASH_MS = 500;

// Devuelve true brevemente cada vez que se descubre un secreto nuevo,
// para que el contador "SECRETS FOUND: X/5" pueda parpadear (biblia,
// seccion CONTADOR). Comparte deteccion con el toast para que los dos
// se disparen exactamente en los mismos casos.
export function useSecretFlash(): boolean {
  return useSecretDiscovery(FLASH_MS).id !== null;
}
