export const P04_INTRO_LINES = [
  "C:\\RICKYEDIT>",
  "",
  "LOADING PROTOCOL 04...",
  "",
  "PROTOCOL 04",
  "LOGIC",
  "",
  "THINK BEFORE ANSWERING.",
  "",
  "THE SYSTEM WILL NOT HELP YOU.",
];

export interface P4Test {
  lines: string[];
  q: string;
  options: string[];
  answer: string;
  anomaly?: "logic-glitch";
}

// Los tests 01, 03 y 04 no traian una respuesta explicita/consistente en
// la biblia; se han resuelto por deduccion (ver comentarios en cada uno).
export const P4_TESTS: P4Test[] = [
  {
    // Deducido: A y C afirman literalmente lo mismo ("objeto != A"), asi
    // que siempre tienen el mismo valor de verdad. O las dos son
    // verdaderas (2 verdaderas, viola "solo una verdadera") o las dos son
    // falsas (0 verdaderas de A/C + B verdadera = exactamente 1). Unica
    // solucion consistente: B es la verdadera -> el objeto esta en A.
    // "no está aquí" dependia de a que se refiere "aquí"; se enuncia
    // explicitamente para que la afirmacion se entienda sin contexto.
    lines: ['A: "El objeto no está en A."', 'B: "El objeto está en A."', 'C: "B está mintiendo."'],
    q: "Solo una afirmación es verdadera. ¿Dónde está el objeto?",
    options: ["A", "B", "C"],
    answer: "A",
  },
  {
    lines: ["Todos los X son Y.", "Algunos Y son Z."],
    q: "¿Podemos afirmar que algunos X son Z?",
    options: ["YES", "NO", "CANNOT DETERMINE"],
    answer: "CANNOT DETERMINE",
  },
  {
    // Deducido: si A es verdadera, B tambien lo seria (contradiccion con
    // "solo una verdadera"), asi que A y B son falsas y C es la unica verdadera.
    //
    // El enunciado antiguo preguntaba que interruptor activa la salida sin
    // decir en ningun sitio que la salida la abra el que dice la verdad:
    // las premisas determinaban cual era la afirmacion verdadera, pero no
    // cual era el interruptor bueno. Se anade esa premisa explicita (ver
    // docs/LOGIC_AUDIT.md, LOGIC-03).
    lines: [
      'A: "C es falso."',
      'B: "A es verdadero."',
      'C: "B es falso."',
      "",
      "La salida la activa el interruptor que dice la verdad.",
    ],
    q: "Solo una afirmación es verdadera. ¿Qué interruptor activa la salida?",
    options: ["A", "B", "C"],
    answer: "C",
  },
  {
    // Deducido: A<B, D<C, B<D combinan en un unico orden posible: A, B, D, C.
    lines: ["A está antes que B.", "C está después de D.", "B está antes que D."],
    q: "¿Cuál es el orden correcto?",
    options: ["A, B, D, C", "A, D, B, C", "D, A, B, C", "A, B, C, D"],
    answer: "A, B, D, C",
  },
  {
    lines: ["A es mayor que B.", "C es menor que A.", "B es mayor que C."],
    q: "¿Quién es el mayor?",
    options: ["A", "B", "C"],
    answer: "A",
  },
  {
    lines: ["A > B", "B > C", "C > A"],
    q: "¿Es posible que las tres afirmaciones sean verdaderas simultáneamente?",
    options: ["SI", "NO"],
    answer: "NO",
  },
  {
    lines: ["INPUT: TRUE", "INPUT: TRUE", "INPUT: FALSE"],
    q: "¿Qué resultado produce una operación AND entre los tres valores?",
    options: ["TRUE", "FALSE"],
    answer: "FALSE",
  },
  {
    lines: ["A XOR B = TRUE", "B XOR C = TRUE", "A = TRUE"],
    q: "¿Qué valor tiene C?",
    options: ["TRUE", "FALSE"],
    answer: "TRUE",
  },
  {
    lines: [],
    q: "¿Cuál de las siguientes respuestas es imposible?",
    options: [
      "Un triángulo con tres ángulos agudos",
      "Un número par que sea primo y mayor que 2",
      "Un cuadrado con cuatro lados iguales",
      "Una semana con siete días",
    ],
    answer: "Un número par que sea primo y mayor que 2",
    anomaly: "logic-glitch",
  },
  {
    lines: ["Sabes que una afirmación es falsa."],
    q: "¿Qué puedes concluir necesariamente?",
    options: ["Su negación es verdadera.", "Todas las demás afirmaciones son verdaderas.", "El sistema está roto.", "Nada."],
    answer: "Su negación es verdadera.",
  },
];
