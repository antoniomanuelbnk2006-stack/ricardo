import { useEffect, useRef, useState } from "react";
import { TypingEngine } from "../terminal/TypingEngine";
import { useSkipTyping } from "../terminal/useSkipTyping";
import { audioManager } from "../../systems/audio/audioManager";

interface ProtocolIntroProps {
  lines: string[];
  onDone: () => void;
}

// Pantalla de intro tipeada, reutilizada por los 5 protocolos
// ("LOADING PROTOCOL 0X... PROTOCOL 0X <NOMBRE> ..."). Click o cualquier
// tecla completa la linea actual (useSkipTyping). Se crea una instancia
// NUEVA de TypingEngine en cada montaje real (ver Terminal.tsx / el
// comentario en useSkipTyping.ts sobre por que no se reutiliza una ya
// cancelada).
export function ProtocolIntro({ lines, onDone }: ProtocolIntroProps) {
  const [shown, setShown] = useState<string[]>([]);
  const [cur, setCur] = useState("");
  const engineRef = useRef<TypingEngine | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setShown([]);
    setCur("");
    const engine = new TypingEngine({
      lines,
      onChar: () => audioManager.playKey(),
      onLineComplete: (line) => setShown((prev) => [...prev, line]),
      onDone: () => setTimeout(() => onDoneRef.current(), 700),
    });
    engineRef.current = engine;
    engine.start(setCur);
    return () => {
      engine.cancel();
      if (engineRef.current === engine) engineRef.current = null;
    };
  }, [lines]);

  const { onClick } = useSkipTyping(engineRef);

  return (
    <div className="terminal-screen" style={{ padding: 0 }} onClick={onClick}>
      {shown.map((l, i) => (
        <div key={i}>{l || "\u00A0"}</div>
      ))}
      <div>
        {cur}
        <span style={{ animation: "cursor-blink 1s step-end infinite" }}>&#9608;</span>
      </div>
    </div>
  );
}
