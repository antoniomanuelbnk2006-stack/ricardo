import { SECRET_DEFINITIONS } from "./secretDefinitions";
import type { SecretId } from "../../types/game";

const CODE = "0437";
const ESC_LOOP_COUNT = 5;
const ESC_LOOP_WINDOW_MS = 2000;
const IDLE_ZONE_MS = 8000;

export function checkCodeBuffer(buffer: string): SecretId | null {
  return buffer.endsWith(CODE) ? "s5" : null;
}

export function isSecretDefined(id: string): id is SecretId {
  return SECRET_DEFINITIONS.some((s) => s.id === id);
}

export const secretSystemConfig = {
  ESC_LOOP_COUNT,
  ESC_LOOP_WINDOW_MS,
  IDLE_ZONE_MS,
};

/**
 * Registra una pulsacion de ESC y decide si se ha completado el bucle.
 *
 * La version anterior llevaba un contador con un temporizador que se
 * reiniciaba en CADA pulsacion, asi que la condicion real no era "cinco ESC
 * en dos segundos" sino "cinco ESC con menos de dos segundos entre una y la
 * siguiente". Pulsando Escape cada segundo y medio durante una partida
 * larga, el secreto se desbloqueaba solo.
 *
 * Ahora se guardan las marcas de tiempo de las ultimas pulsaciones y se
 * exige que las cinco quepan dentro de la ventana completa.
 */
export function registerEscPress(
  previous: number[],
  now: number
): { times: number[]; unlocked: boolean } {
  const times = [...previous, now].slice(-ESC_LOOP_COUNT);
  const complete =
    times.length === ESC_LOOP_COUNT && now - times[0] <= ESC_LOOP_WINDOW_MS;
  return { times: complete ? [] : times, unlocked: complete };
}
