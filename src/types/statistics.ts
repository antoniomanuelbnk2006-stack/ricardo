export interface Statistics {
  correctAnswers: number;
  wrongAnswers: number;
  totalClicks: number;
  averageResponseTimeMs: number;
  responseCount: number;
  fastestResponseMs: number | null;
  slowestResponseMs: number | null;
  idleTimeMs: number;
  answerChanges: number;
  backtrackAttempts: number;
  impulseControlFailed: boolean;
  /** Marca de tiempo (epoch ms) del arranque de la sesion actual. */
  sessionStartedAt: number | null;
  /** Duracion acumulada de la sesion, congelada al cerrar el informe. */
  totalTimeMs: number;
  /** Cuantas veces se ha usado RESTART SESSION. */
  restarts: number;
}

export const initialStatistics: Statistics = {
  correctAnswers: 0,
  wrongAnswers: 0,
  totalClicks: 0,
  averageResponseTimeMs: 0,
  responseCount: 0,
  fastestResponseMs: null,
  slowestResponseMs: null,
  idleTimeMs: 0,
  answerChanges: 0,
  backtrackAttempts: 0,
  impulseControlFailed: false,
  sessionStartedAt: null,
  totalTimeMs: 0,
  restarts: 0,
};
