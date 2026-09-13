export const P01_INTRO_LINES = [
  "C:\\RICKYEDIT>",
  "",
  "INITIALIZING PROTOCOL 01...",
  "",
  "PROTOCOL 01",
  "MEMORY",
  "",
  "PLEASE READ CAREFULLY.",
  "",
  "NO INFORMATION WILL BE REPEATED.",
];

export interface P1Item {
  exhibit: string[];
  displayMs: number;
  q: string;
  options: string[];
  answer: string;
}

// 8 preguntas tal cual la biblia. La ultima es cruzada (usa datos de
// UNIT C=41 y 03=LOCKED de preguntas anteriores) y no muestra exhibit propio.
export const P1_ITEMS: P1Item[] = [
  { exhibit: ["DEVICE 01", "VALUE: 47", "STATUS: ACTIVE"], displayMs: 4000, q: "¿Qué valor tenía DEVICE 01?", options: ["37", "47", "74", "87"], answer: "47" },
  { exhibit: ["RED", "BLUE", "WHITE", "GREEN", "YELLOW"], displayMs: 4500, q: "¿Qué color ocupaba la cuarta posición?", options: ["RED", "WHITE", "GREEN", "YELLOW"], answer: "GREEN" },
  { exhibit: ["UNIT A — 13", "UNIT B — 28", "UNIT C — 41", "UNIT D — 07"], displayMs: 5000, q: "¿Qué número correspondía a UNIT C?", options: ["13", "28", "41", "07"], answer: "41" },
  { exhibit: ["SYSTEM ORDER", "ALPHA", "DELTA", "OMEGA", "BETA", "GAMMA"], displayMs: 5000, q: "¿Qué elemento estaba inmediatamente antes de BETA?", options: ["ALPHA", "DELTA", "OMEGA", "GAMMA"], answer: "OMEGA" },
  { exhibit: ["A7 — C2 — B9 — D4 — F1"], displayMs: 4000, q: "¿Qué combinación ocupaba la tercera posición?", options: ["A7", "C2", "B9", "D4"], answer: "B9" },
  { exhibit: ["USER: RICKY", "SESSION: 03", "MODE: OBSERVER", "CODE: 731"], displayMs: 5000, q: "¿Qué número estaba asociado a la sesión?", options: ["01", "03", "07", "31"], answer: "03" },
  { exhibit: ["ARCHIVE", "01 — OPEN", "02 — CLOSED", "03 — LOCKED", "04 — OPEN"], displayMs: 5000, q: "¿Qué archivo estaba bloqueado?", options: ["01", "02", "03", "04"], answer: "03" },
  { exhibit: [], displayMs: 0, q: "¿Qué valor correspondía a la unidad que estaba en estado LOCKED?", options: ["13", "28", "41", "07"], answer: "41" },
];
