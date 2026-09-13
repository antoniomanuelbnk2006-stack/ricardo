import { useEffect } from "react";
import { P00_LINES } from "./protocol00.data";
import { MessageSequence } from "../../components/protocol/MessageSequence";
import { audioManager } from "../../systems/audio/audioManager";

interface Protocol00Props {
  onComplete: () => void;
}

// "Pantalla negra. Sin musica. Sin ambiente. Solo texto verde." -- se
// detiene el zumbido ambiente mientras dure este protocolo.
export function Protocol00({ onComplete }: Protocol00Props) {
  useEffect(() => {
    audioManager.stopAmbient();
  }, []);

  return (
    <div className="p00-text" style={{ background: "#000", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <MessageSequence steps={P00_LINES} onDone={onComplete} />
    </div>
  );
}
