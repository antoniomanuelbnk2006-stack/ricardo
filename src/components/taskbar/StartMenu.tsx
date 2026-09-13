import { TASKBAR_H } from "../../app/constants";
import { useWindowStore } from "../../store/windowStore";
import { audioManager } from "../../systems/audio/audioManager";
import type { WindowKind } from "../../types/window";

interface StartMenuProps {
  onClose: () => void;
  onShutdown: () => void;
}

const PROGRAMS: { id: WindowKind; label: string }[] = [
  { id: "ricky", label: "RICKYEDIT.EXE" },
  { id: "files", label: "Mis archivos" },
  { id: "trash", label: "Papelera" },
  { id: "config", label: "Config" },
];

export function StartMenu({ onClose, onShutdown }: StartMenuProps) {
  const openWindow = useWindowStore((s) => s.openWindow);

  function open(id: WindowKind) {
    audioManager.playClick();
    audioManager.startAmbient();
    openWindow(id);
    onClose();
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 2,
        bottom: TASKBAR_H,
        width: 180,
        background: "var(--win-bg)",
        border: "2px outset #ffffff",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.5)",
        zIndex: 10000,
        fontFamily: "var(--font-ui)",
        fontSize: 12,
      }}
    >
      <div style={{ padding: "6px 10px", color: "#000", opacity: 0.6 }}>Programas</div>
      {PROGRAMS.map((p) => (
        <button
          key={p.id}
          onClick={() => open(p.id)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "5px 14px",
            background: "transparent",
            border: "none",
            color: "#000",
            cursor: "default",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--titlebar-active-a)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {p.label}
        </button>
      ))}
      <div style={{ borderTop: "1px solid #808080", margin: "4px 0" }} />
      <button
        onClick={() => {
          onShutdown();
          onClose();
        }}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          padding: "5px 14px",
          background: "transparent",
          border: "none",
          color: "#000",
          cursor: "default",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--titlebar-active-a)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        Apagar el sistema...
      </button>
    </div>
  );
}
