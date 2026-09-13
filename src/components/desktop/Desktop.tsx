import { useState } from "react";
import { DesktopIconGrid } from "./DesktopIconGrid";
import { WindowManager } from "../windows/WindowManager";
import { useWallpaper } from "./useWallpaper";
import type { WindowKind } from "../../types/window";

export function Desktop() {
  const [selected, setSelected] = useState<WindowKind | null>(null);
  const wallpaper = useWallpaper();

  return (
    <div
      className="desktop-root"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setSelected(null);
      }}
    >
      {wallpaper && (
        <div className="desktop-wallpaper" style={{ backgroundImage: `url(${wallpaper})` }} />
      )}
      <DesktopIconGrid selected={selected} onSelect={setSelected} />
      <WindowManager />
    </div>
  );
}
