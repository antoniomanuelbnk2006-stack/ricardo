import { useRef, useState } from "react";
import { P3_TESTS } from "./protocol03.data";
import { isCorrectAnswer } from "./protocol03.logic";
import { AnswerFeedback } from "../../components/protocol/AnswerFeedback";
import { MessageSequence } from "../../components/protocol/MessageSequence";
import { useGameStore } from "../../store/gameStore";
import { audioManager } from "../../systems/audio/audioManager";

interface Protocol03Props {
  onComplete: () => void;
}

type Stage = "question" | "feedback" | "anomaly" | "closing";

export function Protocol03({ onComplete }: Protocol03Props) {
  const [i, setI] = useState(0);
  const [stage, setStage] = useState<Stage>("question");
  const [lastCorrect, setLastCorrect] = useState(true);
  const startRef = useRef(Date.now());
  const recordAnswer = useGameStore((s) => s.recordAnswer);
  const tickClick = useGameStore((s) => s.tickClick);
  const unlockSecret = useGameStore((s) => s.unlockSecret);

  const test = P3_TESTS[i];

  function next() {
    if (i + 1 >= P3_TESTS.length) {
      setStage("closing");
      audioManager.playProtocolStinger();
      setTimeout(onComplete, 2600);
    } else {
      setI((v) => v + 1);
      startRef.current = Date.now();
      setStage("question");
    }
  }

  function answer(opt: string) {
    tickClick();
    audioManager.playClick();
    const correct = isCorrectAnswer(test, opt);
    recordAnswer(correct, Date.now() - startRef.current);
    setLastCorrect(correct);
    if (correct && test.anomaly) {
      setStage("anomaly");
    } else {
      setStage("feedback");
    }
  }

  if (stage === "question") {
    return (
      <div>
        <div className="p3-sequence">
          {test.lines.map((l, idx) => (
            <div key={idx}>{l}</div>
          ))}
        </div>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, textAlign: "center" }}>{test.q}</div>
          {test.options.map((opt) => (
            <button key={opt} className="protocol-btn" onClick={() => answer(opt)}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "feedback") {
    return <AnswerFeedback correct={lastCorrect} onDone={next} />;
  }

  if (stage === "anomaly" && test.anomaly === "object-not-exist") {
    return (
      <MessageSequence
        steps={[
          { text: "PROCESSING...", ms: 600, color: "#888" },
          { text: "OBJECT DOES NOT EXIST.", ms: 1000, color: "#ff5050" },
          { text: "CORRECTION: 128", ms: 800 },
          { text: "ACCEPTED.", ms: 500, color: "#3dff8a" },
        ]}
        onStep={(idx) => {
          if (idx === 1) unlockSecret("s2");
        }}
        onDone={next}
      />
    );
  }

  if (stage === "anomaly" && test.anomaly === "flicker-23") {
    return (
      <MessageSequence
        steps={[
          { text: "PROCESSING...", ms: 500, color: "#888" },
          { text: "24", ms: 250 },
          { text: "24", ms: 120 },
          { text: "23", ms: 120, color: "#ff5050" },
          { text: "24", ms: 300 },
          { text: "ACCEPTED.", ms: 500, color: "#3dff8a" },
        ]}
        onDone={next}
      />
    );
  }

  return (
    <div style={{ textAlign: "center", fontFamily: "var(--font-terminal)" }}>
      <div>PATTERN ANALYSIS COMPLETE.</div>
      <div style={{ color: "#888", marginTop: 8 }}>ANOMALIES DETECTED:</div>
      <div>1</div>
      <div style={{ marginTop: 20 }}>PROTOCOL 03 COMPLETE.</div>
      <div>DATA STORED.</div>
    </div>
  );
}
