import { useWindowStore } from "../../store/windowStore";
import type { WindowKind } from "../../types/window";

const LABELS: Record<WindowKind, string> = {
  ricky: "RICKYEDIT.EXE",
  files: "Mis archivos",
  trash: "Papelera",
  config: "Config",
};

export function RunningApps() {
  const open = useWindowStore((s) => s.open);
  const focused = useWindowStore((s) => s.focused);
  const toggleMinimize = useWindowStore((s) => s.toggleMinimize);

  return (
    <div className="taskbar-apps">
      {open.map((w) => {
        const active = focused === w.kind && !w.minimized;
        return (
          <button
            key={w.id}
            type="button"
            className={active ? "taskbar-app-btn is-active" : "taskbar-app-btn"}
            aria-pressed={active}
            onClick={() => toggleMinimize(w.kind)}
          >
            {LABELS[w.kind]}
          </button>
        );
      })}
    </div>
  );
}
