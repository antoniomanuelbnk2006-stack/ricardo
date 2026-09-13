import type { GameState } from "../../types/game";
import { writeJSON } from "./storage";
import { SAVE_VERSION } from "./sanitize";

export const SAVE_KEY = "rickyedit-save-v1";

export interface SavedGame {
  playerName: GameState["playerName"];
  secretsFound: GameState["secretsFound"];
  completedProtocols: GameState["completedProtocols"];
  corruptionLevel: GameState["corruptionLevel"];
  stats: GameState["stats"];
  settings: GameState["settings"];
  programRemoved: GameState["programRemoved"];
}

export function saveGame(state: SavedGame): void {
  // Se escribe la version del formato junto a los datos. Hoy no se usa para
  // nada mas que dejar constancia; el dia que cambie la forma del estado,
  // sanitize.ts sabra distinguir un guardado antiguo de uno nuevo.
  writeJSON(SAVE_KEY, { version: SAVE_VERSION, ...state });
}
