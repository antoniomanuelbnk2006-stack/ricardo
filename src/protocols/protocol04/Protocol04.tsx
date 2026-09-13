import { useRef, useState } from "react";
import { P4_TESTS } from "./protocol04.data";
import { isCorrectAnswer } from "./protocol04.logic";
import { AnswerFeedback } from "../../components/protocol/AnswerFeedback";
import { MessageSequence } from "../../components/protocol/MessageSequence";
import { useGameStore } from "../../store/gameStore";
import { audioManager } from "../../systems/audio/audioManager";

interface Protocol04Props {
  onComplete: () => void;
}

type Stage = "question" | "feedback" | "anomaly" | "closing";

export function Protocol04({ onComplete }: Protocol04Props) {
  const [i, setI] = useState(0);
  const [stage, setStage] = useState<Stage>("question");
  const [lastCorrect, setLastCorrect] = useState(true);
  const startRef = useRef(Date.now());
  const recordAnswer = useGameStore((s) => s.recordAnswer);
  const tickClick = useGameStore((s) => s.tickClick);

  const test = P4_TESTS[i];

  function next() {
    if (i + 1 >= P4_TESTS.length) {
      setStage("closing");
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
    setStage(correct && test.anomaly ? "anomaly" : "feedback");
  }

  if (stage === "question") {
    return (
      <div>
        {test.lines.length > 0 && (
          <div className="p4-clues">
            {test.lines.map((l, idx) => (
              <div key={idx}>{l}</div>
            ))}
          </div>
        )}
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

  if (stage === "anomaly") {
    return (
      <MessageSequence
        steps={[
          { text: "ERROR", ms: 500, color: "#ff5050" },
          { text: "ANSWER NOT FOUND.", ms: 700, color: "#ff5050" },
          { text: "QUESTION INVALIDATED.", ms: 700, color: "#888" },
          { text: "QUESTION RESTORED.", ms: 700, color: "#888" },
          { text: "ACCEPTED.", ms: 500, color: "#3dff8a" },
        ]}
        onDone={next}
      />
    );
  }

  return (
    <MessageSequence
      steps={[
        { text: "LOGIC TEST COMPLETE.", ms: 900 },
        { text: "RESULT: ACCEPTABLE.", ms: 900 },
        { text: "CORRECTION: ACCEPTABLE.", ms: 900, color: "#888" },
        { text: "RESULT: UNKNOWN.", ms: 900, color: "#ff5050" },
        { text: "PROTOCOL 04 COMPLETE.", ms: 900 },
      ]}
      onDone={() => {
        audioManager.playProtocolStinger();
        onComplete();
      }}
    />
  );
}
