import { useEffect, useState } from "react";

interface AnswerFeedbackProps {
  correct: boolean;
  onDone: () => void;
  processingMs?: number;
  holdMs?: number;
}

// "PROCESSING..." -> "ACCEPTED."/"INCORRECT." -> onDone. Reutilizado por
// varios protocolos para dar sensacion de sistema que procesa cada
// respuesta en vez de validarla instantaneamente.
export function AnswerFeedback({ correct, onDone, processingMs = 450, holdMs = 550 }: AnswerFeedbackProps) {
  const [phase, setPhase] = useState<"processing" | "result">("processing");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("result"), processingMs);
    const t2 = setTimeout(onDone, processingMs + holdMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ textAlign: "center", color: correct ? "#3dff8a" : "#ff5050", fontFamily: "var(--font-terminal)" }}>
      {phase === "processing" ? "PROCESSING..." : correct ? "ACCEPTED." : "INCORRECT."}
    </div>
  );
}
