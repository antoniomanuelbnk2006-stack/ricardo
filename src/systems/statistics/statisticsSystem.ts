import { initialStatistics } from "../../types/statistics";
import type { Statistics } from "../../types/statistics";

export function withAnswer(stats: Statistics, correct: boolean, responseTimeMs: number): Statistics {
  const responseCount = stats.responseCount + 1;
  const averageResponseTimeMs =
    (stats.averageResponseTimeMs * stats.responseCount + responseTimeMs) / responseCount;
  return {
    ...stats,
    correctAnswers: stats.correctAnswers + (correct ? 1 : 0),
    wrongAnswers: stats.wrongAnswers + (correct ? 0 : 1),
    responseCount,
    averageResponseTimeMs,
    fastestResponseMs:
      stats.fastestResponseMs === null ? responseTimeMs : Math.min(stats.fastestResponseMs, responseTimeMs),
    slowestResponseMs:
      stats.slowestResponseMs === null ? responseTimeMs : Math.max(stats.slowestResponseMs, responseTimeMs),
  };
}

export function withClick(stats: Statistics): Statistics {
  return { ...stats, totalClicks: stats.totalClicks + 1 };
}

export function withBacktrack(stats: Statistics): Statistics {
  return { ...stats, backtrackAttempts: stats.backtrackAttempts + 1 };
}

export function withAnswerChange(stats: Statistics): Statistics {
  return { ...stats, answerChanges: stats.answerChanges + 1 };
}

export function withImpulseFail(stats: Statistics): Statistics {
  return { ...stats, impulseControlFailed: true };
}

// Arranca el cronometro de la partida. Es idempotente: si ya hay una
// sesion abierta no la reinicia, para que volver al escritorio y entrar
// otra vez en el .exe no ponga el contador a cero.
export function withSessionStart(stats: Statistics, now: number): Statistics {
  if (stats.sessionStartedAt !== null) return stats;
  return { ...stats, sessionStartedAt: now };
}

// Congela el tiempo total al llegar al informe final. El tiempo es una
// metrica, nunca una barrera (biblia, seccion 9): aqui solo se mide.
export function withSessionEnd(stats: Statistics, now: number): Statistics {
  if (stats.sessionStartedAt === null) return stats;
  return { ...stats, totalTimeMs: now - stats.sessionStartedAt };
}

export function withRestart(stats: Statistics): Statistics {
  return { ...initialStatistics, restarts: stats.restarts + 1 };
}

/** Porcentaje de acierto redondeado. Devuelve null si aun no hay respuestas. */
export function accuracyPercent(stats: Statistics): number | null {
  const answered = stats.correctAnswers + stats.wrongAnswers;
  if (answered === 0) return null;
  return Math.round((stats.correctAnswers / answered) * 100);
}
