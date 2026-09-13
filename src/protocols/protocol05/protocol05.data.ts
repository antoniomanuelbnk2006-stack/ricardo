export const P05_INTRO_LINES = [
  "C:\\RICKYEDIT>",
  "",
  "LOADING PROTOCOL 05...",
  "",
  "",
  "PROTOCOL 05",
  "TERMINATION",
  "",
  "THIS IS THE FINAL PROTOCOL.",
  "",
  "PLEASE REMAIN CONNECTED.",
];

export interface P5RecallQuestion {
  q: string;
  options: string[];
  answer: string;
}

// Fases 1-5: recall de los protocolos anteriores. OJO: la ultima
// pregunta ("cuantos protocolos has completado") se responde en la fase
// 5 de ESTE MISMO protocolo (05), que todavia esta en curso -- 05 no se
// marca como completado hasta que termina del todo, al final. Por eso lo
// realmente completado en ese momento son 01-04 (4), no 5. El "answer"
// de abajo es solo documentativo: Protocol05.tsx calcula la respuesta
// correcta en tiempo real contra el progreso de verdad (completedProtocols),
// para que nunca se pueda desincronizar si el flujo cambia en el futuro.
export const P5_RECALL: P5RecallQuestion[] = [
  { q: "¿Cuál fue el primer protocolo?", options: ["MEMORY", "REACTION", "PATTERN", "LOGIC"], answer: "MEMORY" },
  { q: "¿Qué protocolo utilizó patrones?", options: ["01", "02", "03", "04"], answer: "03" },
  { q: "¿Qué protocolo utilizó problemas de lógica?", options: ["02", "03", "04", "05"], answer: "04" },
  { q: "¿Qué protocolo modificó sus reglas durante la prueba?", options: ["01", "02", "03", "04"], answer: "02" },
  { q: "¿Cuántos protocolos principales has completado?", options: ["3", "4", "5", "6"], answer: "4" },
];

export const P5_STATUS_LINES = [
  "SYSTEM STATUS",
  "",
  "PROTOCOLS: 5/5",
  "MEMORY: OK",
  "LOGIC: OK",
  "PATTERN: OK",
  "REACTION: OK",
  "",
  "UNKNOWN PROCESS: ACTIVE",
];

export const P5_ANOMALY_QUESTION = {
  q: "¿Has detectado algún comportamiento anómalo durante las pruebas?",
  options: ["YES", "NO"],
};

export const P5_FINAL_LINES = [
  "SESSION COMPLETE.",
  "",
  "THANK YOU, RICKY.",
  "",
  "DATA STORED.",
  "",
  "DISCONNECTING...",
  "",
  "WAIT.",
  "",
  "THERE IS STILL ONE PROCESS RUNNING.",
];
