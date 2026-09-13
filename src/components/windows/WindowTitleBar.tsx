import { WindowControls } from "./WindowControls";

interface WindowTitleBarProps {
  title: string;
  active: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  onDoubleClick?: () => void;
}

export function WindowTitleBar({
  title,
  active,
  onClose,
  onMinimize,
  onMaximize,
  onPointerDown,
  onDoubleClick,
}: WindowTitleBarProps) {
  return (
    <div
      className={active ? "win-titlebar win-titlebar-active" : "win-titlebar"}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
    >
      <span className="win-titlebar-text">{title}</span>
      <WindowControls
        title={title}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />
    </div>
  );
}
