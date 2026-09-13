import { useState } from "react";
import { StartButton } from "./StartButton";
import { StartMenu } from "./StartMenu";
import { RunningApps } from "./RunningApps";
import { SystemClock } from "./SystemClock";
import { useGameStore } from "../../store/gameStore";

interface TaskbarProps {
  onShutdown: () => void;
}

export function Taskbar({ onShutdown }: TaskbarProps) {
  const unlockSecret = useGameStore((s) => s.unlockSecret);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="taskbar-root">
      <StartButton active={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
      {menuOpen && <StartMenu onClose={() => setMenuOpen(false)} onShutdown={onShutdown} />}
      <RunningApps />
      <SystemClock onSecret={(id) => unlockSecret(id)} />
    </div>
  );
}
