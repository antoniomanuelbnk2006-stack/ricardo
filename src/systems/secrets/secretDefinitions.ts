import type { SecretDefinition } from "../../types/secret";

// Las pistas se muestran en achievements.log mientras el logro sigue
// bloqueado. La regla al escribirlas: senalan donde mirar o que gesto
// hacer, pero nunca el valor concreto -- si la pista se puede "ejecutar"
// sin haber explorado nada, es que sobra (biblia, seccion 8: los secretos
// no deben ser imposibles, pero tampoco todos obvios).
export const SECRET_DEFINITIONS: SecretDefinition[] = [
  {
    id: "s1",
    name: "04/37",
    description: "Una referencia fugaz a 04/37 aparece donde no deberia existir.",
    hint: "Los archivos del sistema mencionan un codigo interno. Leerlo no basta.",
    trigger: "hidden-reference",
  },
  {
    id: "s2",
    name: "EL VALOR IMPOSIBLE",
    description: "El sistema acepta un valor y luego contradice su propia respuesta.",
    hint: "En una de las series, el sistema se corrige a si mismo. Solo lo hace si aciertas.",
    trigger: "impossible-value",
  },
  {
    id: "s3",
    name: "DON'T LOOK AWAY",
    description: "El cursor permanece demasiado tiempo en una zona concreta.",
    hint: "Algo de la barra inferior reacciona si dejas de moverte sobre ello.",
    trigger: "idle-in-zone",
  },
  {
    id: "s4",
    name: "THE LOOP",
    description: "Pulsar ESC repetidamente durante una transicion revela un bucle oculto.",
    hint: "Insiste en salir. Una vez no cuenta; hazlo seguido.",
    trigger: "escape-loop",
  },
  {
    id: "s5",
    name: "0437",
    description: "Introducir 0437 desbloquea el acceso a PROTOCOL 00.",
    hint: "Cuatro cifras aparecen donde no tocan, mas de una vez. Tecléalas sin mas.",
    trigger: "terminal-code",
    reward: "unlock-protocol-00",
  },
];

/** Numero total de secretos de la partida. Debe ser 5 (biblia, seccion 8). */
export const TOTAL_SECRETS = SECRET_DEFINITIONS.length;
