import { useEffect, useRef, useState } from "react";
import { TypingEngine } from "./TypingEngine";
import { TerminalLine } from "./TerminalLine";
import { TerminalCursor } from "./TerminalCursor";
import { useSkipTyping } from "./useSkipTyping";
import { audioManager } from "../../systems/audio/audioManager";

const BOOT_LINES = [
  "C:\\RICKYEDIT>",
  "",
  "INITIALIZING...",
  "",
  "CHECKING MEMORY...",
  "CHECKING INPUT...",
  "CHECKING DISPLAY...",
  "",
  "OK",
  "",
  "RICKYEDIT.EXE",
  "",
  "SESSION READY.",
];

interface TerminalProps {
  onBootComplete: () => void;
}

export function Terminal({ onBootComplete }: TerminalProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [curLine, setCurLine] = useState("");
  const engineRef = useRef<TypingEngine | null>(null);
  const onBootCompleteRef = useRef(onBootComplete);
  onBootCompleteRef.current = onBootComplete;

  useEffect(() => {
    // Se crea una instancia NUEVA en cada montaje real (nunca se reutiliza
    // una ya cancelada -- ver el comentario en useSkipTyping.ts).
    setLines([]);
    setCurLine("");
    const engine = new TypingEngine({
      lines: BOOT_LINES,
      onChar: () => audioManager.playKey(),
      onLineComplete: (line) => setLines((prev) => [...prev, line]),
      onDone: () => setTimeout(() => onBootCompleteRef.current(), 500),
    });
    engineRef.current = engine;
    engine.start(setCurLine);
    return () => {
      engine.cancel();
      if (engineRef.current === engine) engineRef.current = null;
    };
  }, []);

  const { onClick } = useSkipTyping(engineRef);

  return (
    <div className="terminal-screen" onClick={onClick}>
      {lines.map((l, i) => (
        <TerminalLine key={i} text={l} />
      ))}
      <div>
        {curLine}
        <TerminalCursor />
      </div>
    </div>
  );
}
