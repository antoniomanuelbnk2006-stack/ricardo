import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface ProtocolTransitionProps {
  children: ReactNode;
  durationMs?: number;
}

// Envoltorio de fundido breve entre protocolos. La deteccion de ESC x5
// (secreto #04) es global (keyboardManager) y funciona durante esta
// ventana de transicion igual que en el resto del juego.
export function ProtocolTransition({ children, durationMs = 250 }: ProtocolTransitionProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ opacity: visible ? 1 : 0, transition: `opacity ${durationMs}ms` }}>{children}</div>
  );
}
