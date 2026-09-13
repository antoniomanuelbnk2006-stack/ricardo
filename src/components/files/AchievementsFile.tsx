import { SECRET_DEFINITIONS, TOTAL_SECRETS } from "../../systems/secrets/secretDefinitions";
import { useSecretDiscovery } from "../../systems/secrets/useSecretDiscovery";
import { useGameStore } from "../../store/gameStore";

// Cuanto se queda resaltada la linea de un logro recien conseguido.
const HIGHLIGHT_MS = 5000;

// Registro de logros. Marca con un tick los secretos ya encontrados; los
// que faltan aparecen con el nombre censurado y una pista corta. La biblia
// pide "no revelar automaticamente todos los secretos" (seccion 8), pero
// tampoco que sean imposibles: la pista dice donde mirar, nunca el valor.
export function AchievementsFile() {
  const secretsFound = useGameStore((s) => s.secretsFound);
  const { id: justFound } = useSecretDiscovery(HIGHLIGHT_MS);

  return (
    <div className="ach-root">
      <div className="ach-header">
        <span>ACHIEVEMENTS.LOG</span>
        <span className="ach-count">
          {secretsFound.length}/{TOTAL_SECRETS}
        </span>
      </div>

      <ul className="ach-list">
        {SECRET_DEFINITIONS.map((secret, index) => {
          const unlocked = secretsFound.includes(secret.id);
          const highlighted = unlocked && justFound === secret.id;
          const slot = String(index + 1).padStart(2, "0");

          return (
            <li
              key={secret.id}
              className={
                "ach-row" +
                (unlocked ? " is-unlocked" : " is-locked") +
                (highlighted ? " is-new" : "")
              }
            >
              <span className="ach-box" aria-hidden="true">
                {unlocked ? "[\u2713]" : "[ ]"}
              </span>
              <span className="ach-body">
                <span className="ach-name">
                  {/* Un logro bloqueado no revela ni su nombre: solo su hueco. */}
                  {unlocked ? secret.name : `REGISTRO ${slot} — \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588`}
                </span>
                <span className={unlocked ? "ach-desc" : "ach-desc ach-hint"}>
                  {/* Bloqueado: una pista que orienta sin resolver. */}
                  {unlocked ? secret.description : secret.hint}
                </span>
              </span>
              {/* Texto equivalente para lectores de pantalla, ya que el
                  estado se comunica con un simbolo y con color. */}
              <span className="sr-only">
                {unlocked ? "Conseguido" : "Pendiente"}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="ach-foot">
        {secretsFound.length === TOTAL_SECRETS
          ? "REGISTRO COMPLETO."
          : `${TOTAL_SECRETS - secretsFound.length} registro(s) sin escribir.`}
      </p>
    </div>
  );
}
