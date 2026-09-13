import { useEffect, useRef, useState } from "react";
import { P1_ITEMS } from "./protocol01.data";
import { isCorrectAnswer } from "./protocol01.logic";
import { AnswerFeedback } from "../../components/protocol/AnswerFeedback";
import { useGameStore } from "../../store/gameStore";
import { audioManager } from "../../systems/audio/audioManager";

interface Protocol01Props {
  onComplete: () => void;
}

type Phase = "exhibit" | "question" | "feedback" | "closing";

export function Protocol01({ onComplete }: Protocol01Props) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("exhibit");
  const [lastCorrect, setLastCorrect] = useState(true);
  const qStartRef = useRef(Date.now());
  const recordAnswer = useGameStore((s) => s.recordAnswer);
  const tickClick = useGameStore((s) => s.tickClick);

  const item = P1_ITEMS[index];

  useEffect(() => {
    if (phase !== "exhibit") return;
    if (item.exhibit.length === 0) {
      setPhase("question");
      return;
    }
    const t = setTimeout(() => setPhase("question"), item.displayMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase]);

  useEffect(() => {
    if (phase === "question") qStartRef.current = Date.now();
  }, [phase]);

  function answer(opt: string) {
    tickClick();
    audioManager.playClick();
    const correct = isCorrectAnswer(item.answer, opt);
    recordAnswer(correct, Date.now() - qStartRef.current);
    setLastCorrect(correct);
    setPhase("feedback");
  }

  function afterFeedback() {
    if (index + 1 >= P1_ITEMS.length) {
      setPhase("closing");
      audioManager.playProtocolStinger();
      setTimeout(onComplete, 2400);
    } else {
      setIndex((i) => i + 1);
      setPhase("exhibit");
    }
  }

  if (phase === "exhibit") {
    return (
      <div className="p1-exhibit">
        {item.exhibit.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    );
  }

  if (phase === "question") {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>{item.q}</div>
        {item.options.map((opt) => (
          <button key={opt} className="protocol-btn" onClick={() => answer(opt)}>
            {opt}
          </button>
        ))}
      </div>
    );
  }

  if (phase === "feedback") {
    return <AnswerFeedback correct={lastCorrect} onDone={afterFeedback} />;
  }

  return (
    <div style={{ textAlign: "center", fontFamily: "var(--font-terminal)" }}>
      <div>MEMORY TEST COMPLETE.</div>
      <div style={{ color: "#888", marginTop: 8 }}>PROCESSING RESULTS...</div>
      <div style={{ marginTop: 20 }}>PROTOCOL 01 COMPLETE.</div>
      <div>DATA STORED.</div>
      <div style={{ color: "#888" }}>NEXT PROTOCOL AVAILABLE.</div>
    </div>
  );
}
