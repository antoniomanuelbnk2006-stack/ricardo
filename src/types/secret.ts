import type { SecretId } from "./game";

export type SecretTrigger =
  | "hidden-reference"
  | "impossible-value"
  | "idle-in-zone"
  | "escape-loop"
  | "terminal-code";

export interface SecretDefinition {
  id: SecretId;
  name: string;
  /** Que es, una vez conseguido. */
  description: string;
  /**
   * Pista que se muestra mientras el logro sigue bloqueado. Debe orientar
   * sin resolver: apunta al SITIO o al GESTO, nunca al valor exacto.
   */
  hint: string;
  trigger: SecretTrigger;
  reward?: "unlock-protocol-00";
}
