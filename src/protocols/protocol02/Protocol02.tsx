import { useEffect, useRef, useState } from "react";
import { REACTION_PHASES, RULE_UPDATED_LINES, STIMULUS_MS, FINAL_QUESTION } from "./protocol02.data";
import { isStimulusCorrect } from "./protocol02.logic";
import { AnswerFeedback } from "../../components/protocol/AnswerFeedback";
import { useGameStore } from "../../store/gameStore";
import { audioManager } from "../../systems/audio/audioManager";

interface Protocol02Props {
  onComplete: () => void;
}

type Stage = "ruleIntro" | "running" | "ruleUpdated" | "finalQuestion" | "finalFeedback" | "ending";

export function Protocol02({ onComplete }: Protocol02Props) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [stimIndex, setStimIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("ruleIntro");
  const [failFlash, setFailFlash] = useState(false);
  const [finalCorrect, setFinalCorrect] = useState(true);
  const pressedRef = useRef(false);
  const stimStartRef = useRef(Date.now());
  const recordAnswer = useGameStore((s) => s.recordAnswer);
  const tickClick = useGameStore((s) => s.tickClick);

  const phase = REACTION_PHASES[phaseIndex];

  useEffect(() => {
    if (stage !== "running") return;
    pressedRef.current = false;
    stimStartRef.current = Date.now();
    const stim = phase.stimuli[stimIndex];
    const t = setTimeout(() => {
      const correct = isStimulusCorrect(phase.id, stim, pressedRef.current);
      recordAnswer(correct, Date.now() - stimStartRef.current);
      if (stimIndex + 1 < phase.stimuli.length) {
        setStimIndex((i) => i + 1);
      } else if (phaseIndex + 1 < REACTION_PHASES.length) {
        setStage("ruleUpdated");
      } else {
        setStage("finalQuestion");
      }
    }, STIMULUS_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, stimIndex, phaseIndex]);

  function press() {
    if (stage !== "running" || pressedRef.current) return;
    pressedRef.current = true;
    tickClick();
    audioManager.playClick();
  }

  function startPhase() {
    setStage("running");
  }

  function afterRuleUpdated() {
    setPhaseIndex((p) => p + 1);
    setStimIndex(0);
    setStage("running");
  }

  function answerFinal(opt: string) {
    tickClick();
    audioManager.playClick();
    const correct = opt === FINAL_QUESTION.answer;
    recordAnswer(correct, 0);
    setFinalCorrect(correct);
    setStage("finalFeedback");
  }

  function afterFinalFeedback() {
    setStage("ending");
    audioManager.playProtocolStinger();
    // Anomalia: un frame de "PROTOCOL 02 FAILED." antes de confirmar el exito.
    setTimeout(() => setFailFlash(true), 260);
    setTimeout(() => setFailFlash(false), 320);
    setTimeout(onComplete, 1800);
  }

  if (stage === "ruleIntro") {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="p2-rule-text">{phase.ruleText}</div>
        <button className="protocol-btn" style={{ width: "auto", margin: "0 auto" }} onClick={startPhase}>
          Continuar
        </button>
      </div>
    );
  }

  if (stage === "running") {
    const stim = phase.stimuli[stimIndex];
    return (
      <div>
        <div className="p2-rule-text">{phase.ruleText}</div>
        <div className="p2-reaction-word" style={{ color: stim.color ?? "var(--terminal-fg)" }}>
          {stim.word}
        </div>
        <button className="p2-press-btn" onClick={press}>
          PRESS
        </button>
      </div>
    );
  }

  if (stage === "ruleUpdated") {
    return (
      <div style={{ textAlign: "center", fontFamily: "var(--font-terminal)" }}>
        {RULE_UPDATED_LINES.map((l, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            {l || "\u00A0"}
          </div>
        ))}
        <button className="protocol-btn" style={{ width: "auto", margin: "16px auto 0" }} onClick={afterRuleUpdated}>
          Continuar
        </button>
      </div>
    );
  }

  if (stage === "finalQuestion") {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>{FINAL_QUESTION.q}</div>
        {FINAL_QUESTION.options.map((opt) => (
          <button key={opt} className="protocol-btn" onClick={() => answerFinal(opt)}>
            {opt}
          </button>
        ))}
      </div>
    );
  }

  if (stage === "finalFeedback") {
    return <AnswerFeedback correct={finalCorrect} onDone={afterFinalFeedback} />;
  }

  return (
    <div style={{ textAlign: "center", fontFamily: "var(--font-terminal)" }}>
      {failFlash ? "PROTOCOL 02 FAILED." : "PROTOCOL 02 COMPLETE."}
    </div>
  );
}
