export const P03_INTRO_LINES = [
  "C:\\RICKYEDIT>",
  "",
  "LOADING PROTOCOL 03...",
  "",
  "PROTOCOL 03",
  "PATTERN",
  "",
  "IDENTIFY THE RULE.",
  "",
  "NOT ALL PATTERNS ARE NUMERICAL.",
];

export interface P3Test {
  lines: string[]; // secuencia mostrada, una linea por elemento
  q: string;
  options: string[];
  answer: string;
  anomaly?: "object-not-exist" | "flicker-23";
}

export const P3_TESTS: P3Test[] = [
  { lines: ["2", "4", "8", "16", "?"], q: "¿Qué valor sigue?", options: ["20", "24", "32", "64"], answer: "32" },
  { lines: ["3", "6", "12", "24", "?"], q: "¿Qué valor sigue?", options: ["30", "36", "48", "64"], answer: "48" },
  { lines: ["1", "4", "9", "16", "?"], q: "¿Qué valor sigue?", options: ["20", "24", "25", "36"], answer: "25" },
  { lines: ["A", "C", "F", "J", "O", "?"], q: "¿Qué letra sigue?", options: ["S", "T", "U", "V"], answer: "U" },
  { lines: ["RED", "BLUE", "BLUE", "RED", "BLUE", "BLUE", "?"], q: "¿Qué color sigue?", options: ["RED", "BLUE", "GREEN", "YELLOW"], answer: "RED" },
  { lines: ["01", "11", "21", "1211", "111221", "?"], q: "¿Qué secuencia sigue?", options: ["122111", "211231", "312211", "131221"], answer: "312211" },
  { lines: ["8 — 4 — 2 — 1", "16 — 8 — 4 — 2", "32 — 16 — 8 — ?"], q: "¿Qué valor sigue?", options: ["2", "4", "8", "16"], answer: "4" },
  {
    lines: ["01", "02", "04", "08", "16", "32", "64", "?"],
    q: "¿Cuál sería el siguiente valor?",
    options: ["96", "100", "128", "256"],
    answer: "128",
    anomaly: "object-not-exist",
  },
  { lines: ["A = 1", "B = 2", "C = 3", "A + C = 4", "?"], q: "¿Cuánto es B + C?", options: ["3", "4", "5", "6"], answer: "5" },
  {
    lines: ["04", "08", "12", "16", "20", "?"],
    q: "¿Qué valor sigue?",
    options: ["22", "23", "24", "28"],
    answer: "24",
    anomaly: "flicker-23",
  },
];
