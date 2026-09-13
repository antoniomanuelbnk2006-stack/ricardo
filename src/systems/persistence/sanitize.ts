import type { SavedGame } from "./saveGame";
import type { ProtocolId, SecretId, Settings } from "../../types/game";
import type { Statistics } from "../../types/statistics";
import { initialStatistics } from "../../types/statistics";
import { initialGameState } from "../game/gameState";

/**
 * Version del formato guardado. Si alguna vez cambia la forma del estado,
 * subir este numero y migrar aqui: el saneado de abajo ya tolera un guardado
 * sin `version` (los de antes de que existiera este campo).
 */
export const SAVE_VERSION = 1;

const VALID_SECRETS: SecretId[] = ["s1", "s2", "s3", "s4", "s5"];
const VALID_PROTOCOLS: ProtocolId[] = ["01", "02", "03", "04", "05", "00"];
const MAX_NAME_LENGTH = 16;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Numero finito y no negativo, o el valor por defecto. */
function num(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : fallback;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

/** Volumen valido: numero finito recortado al rango 0..1. */
function volume(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, 0), 1);
}

/** Milisegundos opcionales: numero no negativo o null. */
function msOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

/** Se queda solo con los miembros validos y sin repetir de una lista cerrada. */
function pickKnown<T extends string>(value: unknown, allowed: T[]): T[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<T>();
  for (const item of value) {
    if (typeof item === "string" && (allowed as string[]).includes(item)) {
      seen.add(item as T);
    }
  }
  return allowed.filter((id) => seen.has(id));
}

function sanitizeStats(value: unknown): Statistics {
  if (!isRecord(value)) return initialStatistics;
  return {
    correctAnswers: num(value.correctAnswers, 0),
    wrongAnswers: num(value.wrongAnswers, 0),
    totalClicks: num(value.totalClicks, 0),
    averageResponseTimeMs: num(value.averageResponseTimeMs, 0),
    responseCount: num(value.responseCount, 0),
    fastestResponseMs: msOrNull(value.fastestResponseMs),
    slowestResponseMs: msOrNull(value.slowestResponseMs),
    idleTimeMs: num(value.idleTimeMs, 0),
    answerChanges: num(value.answerChanges, 0),
    backtrackAttempts: num(value.backtrackAttempts, 0),
    impulseControlFailed: bool(value.impulseControlFailed, false),
    sessionStartedAt: msOrNull(value.sessionStartedAt),
    totalTimeMs: num(value.totalTimeMs, 0),
    restarts: num(value.restarts, 0),
  };
}

function sanitizeSettings(value: unknown): Settings {
  const defaults = initialGameState.settings;
  if (!isRecord(value)) return defaults;
  return {
    audioMuted: bool(value.audioMuted, defaults.audioMuted),
    volumeMaster: volume(value.volumeMaster, defaults.volumeMaster),
    volumeAmbience: volume(value.volumeAmbience, defaults.volumeAmbience),
    volumeUI: volume(value.volumeUI, defaults.volumeUI),
    volumeGlitch: volume(value.volumeGlitch, defaults.volumeGlitch),
    crtEnabled: bool(value.crtEnabled, defaults.crtEnabled),
    reducedMotion: bool(value.reducedMotion, defaults.reducedMotion),
    tvFrameEnabled: bool(value.tvFrameEnabled, defaults.tvFrameEnabled),
  };
}

function sanitizeName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, MAX_NAME_LENGTH);
}

/**
 * Repara una partida leida de localStorage en vez de confiar en ella.
 *
 * Antes, `loadGame()` devolvia lo que hubiera en el almacenamiento tal cual.
 * Un guardado editado a mano, escrito a medias o de una version anterior
 * podia meter tipos imposibles en el estado (por ejemplo `secretsFound` como
 * cadena, donde `.includes("s1")` compara subcadenas y el contador pasa a
 * contar letras) y dejar la web en blanco.
 *
 * Aqui nada se descarta entero por un campo malo: cada dato invalido se
 * sustituye por su valor por defecto y se conserva el resto del progreso.
 */
export function sanitizeSavedGame(raw: unknown): SavedGame | null {
  if (!isRecord(raw)) return null;

  const secretsFound = pickKnown(raw.secretsFound, VALID_SECRETS);
  const completedProtocols = pickKnown(raw.completedProtocols, VALID_PROTOCOLS);

  // El nivel de corrupcion se deriva del progreso, asi que un valor fuera
  // de rango se reemplaza por algo coherente en vez de por 0 a ciegas.
  const rawLevel = raw.corruptionLevel;
  const levelIsValid =
    typeof rawLevel === "number" && Number.isInteger(rawLevel) && rawLevel >= 0 && rawLevel <= 4;
  const mainProtocols = completedProtocols.filter((p) => p !== "00").length;
  const corruptionLevel = (levelIsValid ? rawLevel : Math.min(mainProtocols, 4)) as 0 | 1 | 2 | 3 | 4;

  return {
    playerName: sanitizeName(raw.playerName),
    secretsFound,
    completedProtocols,
    corruptionLevel,
    stats: sanitizeStats(raw.stats),
    settings: sanitizeSettings(raw.settings),
    programRemoved: bool(raw.programRemoved, false),
  };
}
