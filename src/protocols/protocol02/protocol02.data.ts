export const P02_INTRO_LINES = [
  "C:\\RICKYEDIT>",
  "",
  "LOADING PROTOCOL 02...",
  "",
  "SYSTEM TIMEOUT",
  "04/37",
  "",
  "PROTOCOL 02",
  "REACTION",
  "",
  "FOLLOW THE INSTRUCTIONS.",
  "",
  "THE RULES MAY CHANGE.",
];

export const RULE_UPDATED_LINES = ["RULE UPDATED.", "", "CONTINUE."];

export const STIMULUS_MS = 1100;

export type StimulusWord = "WAIT" | "GO" | "STOP" | "SYSTEM" | "ERROR" | "RICKY" | "RED" | "BLUE" | "GREEN" | "YELLOW";

export interface Stimulus {
  word: StimulusWord;
  color?: "red" | "blue" | "green" | "yellow"; // color visual del texto (fase 3-4, Stroop)
}

export interface ReactionPhase {
  id: "p1" | "p2" | "p3" | "p4" | "p5";
  ruleText: string;
  stimuli: Stimulus[];
}

export const REACTION_PHASES: ReactionPhase[] = [
  {
    id: "p1",
    ruleText: "Pulsa únicamente cuando aparezca GO.",
    stimuli: [{ word: "WAIT" }, { word: "WAIT" }, { word: "GO" }, { word: "WAIT" }, { word: "GO" }],
  },
  {
    id: "p2",
    ruleText: "Ahora NO pulses cuando aparezca GO. Pulsa cuando aparezca STOP.",
    stimuli: [{ word: "GO" }, { word: "STOP" }, { word: "GO" }, { word: "GO" }, { word: "STOP" }],
  },
  {
    id: "p3",
    ruleText: "Pulsa cuando el significado de la palabra NO coincida con su color.",
    stimuli: [
      { word: "BLUE", color: "red" },
      { word: "RED", color: "red" },
      { word: "GREEN", color: "blue" },
      { word: "YELLOW", color: "yellow" },
      { word: "RED", color: "green" },
    ],
  },
  {
    id: "p4",
    ruleText: "Ahora al revés: pulsa únicamente cuando palabra y color coincidan.",
    stimuli: [
      { word: "GREEN", color: "green" },
      { word: "BLUE", color: "yellow" },
      { word: "YELLOW", color: "yellow" },
      { word: "RED", color: "blue" },
      { word: "BLUE", color: "blue" },
    ],
  },
  {
    id: "p5",
    ruleText: "Pulsa solo cuando aparezca GO. Ignora el resto.",
    stimuli: [
      { word: "SYSTEM" },
      { word: "GO" },
      { word: "ERROR" },
      { word: "GO" },
      { word: "RICKY" },
      { word: "WAIT" },
      { word: "GO" },
    ],
  },
];

export const FINAL_QUESTION = {
  q: "¿Cuál fue la primera regla del protocolo?",
  options: ["Pulsar cuando aparecía STOP", "Pulsar cuando aparecía GO", "No pulsar nunca", "Pulsar únicamente cuando el color coincidía"],
  answer: "Pulsar cuando aparecía GO",
};
