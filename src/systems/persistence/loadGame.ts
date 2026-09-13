import { readJSON } from "./storage";
import { SAVE_KEY, type SavedGame } from "./saveGame";
import { sanitizeSavedGame } from "./sanitize";

// Nunca devuelve datos sin revisar: lo que hay en localStorage es entrada
// no fiable (editable a mano, escrita a medias, de una version anterior).
// sanitizeSavedGame repara lo que puede y descarta lo que no encaja.
export function loadGame(): SavedGame | null {
  return sanitizeSavedGame(readJSON<unknown>(SAVE_KEY));
}
