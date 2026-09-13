import { useEffect, useRef, useState } from "react";

export interface SequenceStep {
  text: string;
  ms: number;
  color?: string;
}

interface MessageSequenceProps {
  steps: SequenceStep[];
  onDone: () => void;
  onStep?: (index: number) => void;
}

// Reproduce una secuencia de mensajes cronometrados uno tras otro. Se usa
// para las "anomalias" con guion fijo (OBJECT DOES NOT EXIST, el flicker
// 24/24/23, etc.) que no son preguntas, solo teatro del sistema.
export function MessageSequence({ steps, onDone, onStep }: MessageSequenceProps) {
  const [index, setIndex] = useState(0);

  // Identidad del guion por su contenido, no por la referencia del array:
  // quien llama construye `steps` en cada render, asi que comparar
  // referencias reiniciaria la secuencia constantemente.
  const signature = steps.map((s) => s.text).join("\u0000");
  const signatureRef = useRef(signature);

  // Cuando dos pantallas seguidas renderizan un MessageSequence, React
  // reutiliza la misma instancia (mismo tipo, misma posicion) y el estado
  // `index` sobrevive. Si el efecto solo dependiera de `index`, al pasar de
  // una secuencia a otra que empieza tambien en 0 no se programaria ningun
  // temporizador y la secuencia se quedaba congelada en su primera linea
  // para siempre. Reiniciar durante el render es el patron recomendado por
  // React para ajustar estado cuando cambia una prop.
  if (signatureRef.current !== signature) {
    signatureRef.current = signature;
    setIndex(0);
  }

  useEffect(() => {
    const step = steps[index];
    if (!step) return;
    onStep?.(index);
    const t = setTimeout(() => {
      if (index + 1 < steps.length) setIndex((i) => i + 1);
      else onDone();
    }, step.ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, signature]);

  const step = steps[index];
  if (!step) return null;

  return (
    <div style={{ textAlign: "center", fontFamily: "var(--font-terminal)", color: step.color ?? "#e0e0e0" }}>
      {step.text || "\u00A0"}
    </div>
  );
}
