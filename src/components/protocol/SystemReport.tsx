import { useGameStore } from "../../store/gameStore";
import { accuracyPercent } from "../../systems/statistics/statisticsSystem";
import { formatMs, formatDuration, formatDateTime } from "../../utils/formatting";

interface SystemReportProps {
  onContinue: () => void;
  onRestartSession: () => void;
}

// Recompensa oculta al final de la partida: un resumen de lo que el
// sistema ha estado registrando en silencio durante todo el juego.
// Nunca se muestra durante los protocolos (ver biblia, seccion
// ESTADISTICAS), solo aqui, al cerrar. Tambien es donde se ofrece
// RESTART SESSION (jugar de nuevo sin perder los secretos ya encontrados).
export function SystemReport({ onContinue, onRestartSession }: SystemReportProps) {
  const stats = useGameStore((s) => s.stats);
  const playerName = useGameStore((s) => s.playerName);
  const secretsFound = useGameStore((s) => s.secretsFound);
  const completedProtocols = useGameStore((s) => s.completedProtocols);
  const restartSession = useGameStore((s) => s.restartSession);

  const protocolsDone = completedProtocols.filter((p) => p !== "00").length;
  const accuracy = accuracyPercent(stats);
  const answered = stats.correctAnswers + stats.wrongAnswers;
  // El final secreto es el que pasa por PROTOCOL 00; hasta que no se
  // desbloquea, el sistema solo reconoce la salida normal.
  const ending = secretsFound.includes("s5") ? "SECRET" : "NORMAL";

  const rows: [string, string][] = [
    ["USUARIO", playerName ? playerName.toUpperCase() : "NO REGISTRADO"],
    ["SESSION STARTED", formatDateTime(stats.sessionStartedAt)],
    ["TOTAL TIME", formatDuration(stats.totalTimeMs)],
    ["PROTOCOLS COMPLETED", `${protocolsDone}/5`],
    ["SECRETS FOUND", `${secretsFound.length}/5`],
    ["QUESTIONS ANSWERED", `${answered}`],
    ["CORRECT ANSWERS", `${stats.correctAnswers}`],
    ["WRONG ANSWERS", `${stats.wrongAnswers}`],
    ["ACCURACY", accuracy === null ? "—" : `${accuracy}%`],
    ["TOTAL CLICKS", `${stats.totalClicks}`],
    ["AVERAGE RESPONSE TIME", stats.responseCount > 0 ? formatMs(Math.round(stats.averageResponseTimeMs)) : "—"],
    ["FASTEST RESPONSE", stats.fastestResponseMs !== null ? formatMs(stats.fastestResponseMs) : "—"],
    ["SLOWEST RESPONSE", stats.slowestResponseMs !== null ? formatMs(stats.slowestResponseMs) : "—"],
    ["ANSWER CHANGES", `${stats.answerChanges}`],
    ["BACKTRACK ATTEMPTS", `${stats.backtrackAttempts}`],
    ["IMPULSE CONTROL", stats.impulseControlFailed ? "FAILED" : "OK"],
    ["RESTARTS", `${stats.restarts}`],
    ["ENDING", ending],
  ];

  return (
    <div className="report-root">
      <p className="report-title">SYSTEM REPORT</p>
      {playerName && <p className="report-subject">SUJETO: {playerName.toUpperCase()}</p>}

      <dl className="report-table">
        {rows.map(([label, value]) => (
          <div className="report-row" key={label}>
            <dt className="report-label">{label}</dt>
            <dd className="report-value">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="report-actions">
        <button type="button" className="protocol-btn report-btn" onClick={onContinue}>
          Continuar
        </button>
        <button
          type="button"
          className="protocol-btn report-btn"
          onClick={() => {
            restartSession();
            onRestartSession();
          }}
        >
          RESTART SESSION
        </button>
      </div>
    </div>
  );
}
