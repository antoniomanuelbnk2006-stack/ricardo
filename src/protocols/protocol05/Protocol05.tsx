import { useEffect, useRef, useState } from "react";
import {
  P5_RECALL,
  P5_STATUS_LINES,
  P5_ANOMALY_QUESTION,
  P5_FINAL_LINES,
} from "./protocol05.data";
import { isCorrectAnswer } from "./protocol05.logic";
import { AnswerFeedback } from "../../components/protocol/AnswerFeedback";
import { MessageSequence } from "../../components/protocol/MessageSequence";
import { useGameStore } from "../../store/gameStore";
import { audioManager } from "../../systems/audio/audioManager";

interface Protocol05Props {
  onComplete: () => void;
}

type Stage =
  | "recall"
  | "recallFeedback"
  | "status"
  | "anomalyQuestion"
  | "secretsReport"
  | "progressBar"
  | "blackout"
  | "final";

function ProgressBar({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (pct >= 100) {
      const t = setTimeout(onDone, 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPct((p) => Math.min(100, p + 5)), 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct]);
  const blocks = Math.round(pct / 5);
  return (
    <div style={{ textAlign: "center" }}>
      <div className="p5-progress-bar">
        {"█".repeat(blocks)}
        {"░".repeat(20 - blocks)} {pct}%
      </div>
      {pct >= 100 && <div className="p5-status-line" style={{ marginTop: 16 }}>ALL PROTOCOLS COMPLETE.</div>}
    </div>
  );
}

export function Protocol05({ onComplete }: Protocol05Props) {
  const [recallIndex, setRecallIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("recall");
  const [lastCorrect, setLastCorrect] = useState(true);
  const startRef = useRef(Date.now());
  const recordAnswer = useGameStore((s) => s.recordAnswer);
  const tickClick = useGameStore((s) => s.tickClick);
  const secretsFound = useGameStore((s) => s.secretsFound);
  const completedProtocols = useGameStore((s) => s.completedProtocols);

  const question = P5_RECALL[recallIndex];
  const isLastRecall = recallIndex === P5_RECALL.length - 1;
  // La ultima pregunta ("cuantos protocolos has completado") se responde
  // contra el progreso real en este mismo instante, no contra un texto
  // fijo: PROTOCOL 05 (este) todavia esta en curso, asi que lo realmente
  // completado son los anteriores (normalmente 4, nunca 5 en este punto).
  const completedCount = completedProtocols.filter((p) => p !== "00").length;

  function answerRecall(opt: string) {
    tickClick();
    audioManager.playClick();
    const correct = isLastRecall ? opt === String(completedCount) : isCorrectAnswer(question, opt);
    recordAnswer(correct, Date.now() - startRef.current);
    setLastCorrect(correct);
    setStage("recallFeedback");
  }

  function afterRecallFeedback() {
    if (recallIndex + 1 < P5_RECALL.length) {
      setRecallIndex((i) => i + 1);
      startRef.current = Date.now();
      setStage("recall");
    } else {
      setStage("status");
    }
  }

  function answerAnomaly() {
    tickClick();
    audioManager.playClick();
    setStage("secretsReport");
  }

  if (stage === "recall") {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>{question.q}</div>
        {question.options.map((opt) => (
          <button key={opt} className="protocol-btn" onClick={() => answerRecall(opt)}>
            {opt}
          </button>
        ))}
      </div>
    );
  }

  if (stage === "recallFeedback") {
    return <AnswerFeedback correct={lastCorrect} onDone={afterRecallFeedback} />;
  }

  if (stage === "status") {
    return (
      <div style={{ textAlign: "center" }}>
        {P5_STATUS_LINES.map((l, i) => (
          <div key={i} className="p5-status-line">
            {l || "\u00A0"}
          </div>
        ))}
        <button className="protocol-btn" style={{ width: "auto", margin: "20px auto 0" }} onClick={() => setStage("anomalyQuestion")}>
          Continuar
        </button>
      </div>
    );
  }

  if (stage === "anomalyQuestion") {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div style={{ marginBottom: 20 }}>{P5_ANOMALY_QUESTION.q}</div>
        {P5_ANOMALY_QUESTION.options.map((opt) => (
          <button key={opt} className="protocol-btn" onClick={answerAnomaly}>
            {opt}
          </button>
        ))}
      </div>
    );
  }

  if (stage === "secretsReport") {
    return (
      <MessageSequence
        steps={[
          { text: "¿Cuántos secretos has encontrado?", ms: 1200, color: "#888" },
          { text: `${secretsFound.length}/5`, ms: 1400 },
        ]}
        onDone={() => setStage("progressBar")}
      />
    );
  }

  if (stage === "progressBar") {
    return <ProgressBar onDone={() => setStage("blackout")} />;
  }

  if (stage === "blackout") {
    return (
      <MessageSequence steps={[{ text: "", ms: 500 }]} onDone={() => setStage("final")} />
    );
  }

  return (
    <MessageSequence
      steps={P5_FINAL_LINES.map((text) => ({ text, ms: text ? 900 : 400 }))}
      onDone={onComplete}
    />
  );
}
