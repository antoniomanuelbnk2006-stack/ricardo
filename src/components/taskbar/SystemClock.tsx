import { useEffect, useState } from "react";
import { useIdleZone } from "../../systems/input/cursorTracker";
import { useGameStore } from "../../store/gameStore";
import { formatClock } from "../../utils/time";
import { ClockPopup } from "./ClockPopup";
import { audioManager } from "../../systems/audio/audioManager";

interface SystemClockProps {
  onSecret: (id: "s3") => void;
}

export function SystemClock({ onSecret }: SystemClockProps) {
  const [time, setTime] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const secretsFound = useGameStore((s) => s.secretsFound);
  const { onMouseEnter, onMouseLeave } = useIdleZone(() => {
    if (!secretsFound.includes("s3")) onSecret("s3");
  });

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!showPopup) return;
    function onDocClick() {
      setShowPopup(false);
    }
    document.addEventListener("pointerdown", onDocClick);
    return () => document.removeEventListener("pointerdown", onDocClick);
  }, [showPopup]);

  return (
    <div className="taskbar-clock-wrap">
      <button
        type="button"
        className="taskbar-clock"
        aria-expanded={showPopup}
        aria-label={`Reloj del sistema: ${formatClock(time)}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          audioManager.playClick();
          setShowPopup((v) => !v);
        }}
      >
        {formatClock(time)}
      </button>
      {showPopup && <ClockPopup date={time} />}
    </div>
  );
}
