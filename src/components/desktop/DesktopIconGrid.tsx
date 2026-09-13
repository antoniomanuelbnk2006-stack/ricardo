import { DesktopIcon } from "./DesktopIcon";
import { useWindowStore } from "../../store/windowStore";
import { useGameStore } from "../../store/gameStore";
import { audioManager } from "../../systems/audio/audioManager";
import type { WindowKind } from "../../types/window";
import {
  RickyIconGlyph,
  FolderIconGlyph,
  TrashIconGlyph,
  GearIconGlyph,
} from "./icons";

const ICONS: { id: WindowKind; label: string; Glyph: typeof RickyIconGlyph }[] = [
  { id: "ricky", label: "RICKYEDIT.EXE", Glyph: RickyIconGlyph },
  { id: "files", label: "Mis archivos", Glyph: FolderIconGlyph },
  { id: "trash", label: "Papelera", Glyph: TrashIconGlyph },
  { id: "config", label: "Config", Glyph: GearIconGlyph },
];

interface DesktopIconGridProps {
  selected: WindowKind | null;
  onSelect: (id: WindowKind | null) => void;
}

export function DesktopIconGrid({ selected, onSelect }: DesktopIconGridProps) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const programRemoved = useGameStore((s) => s.programRemoved);

  function open(id: WindowKind) {
    audioManager.playClick();
    audioManager.startAmbient();
    openWindow(id);
  }

  // Tras completar PROTOCOL 00 el icono de RICKYEDIT.EXE desaparece
  // del escritorio (biblia, seccion PROTOCOL 00 — FINAL SECRET).
  const icons = programRemoved ? ICONS.filter((i) => i.id !== "ricky") : ICONS;

  return (
    <div className="desktop-icons">
      {icons.map(({ id, label, Glyph }) => (
        <DesktopIcon
          key={id}
          label={label}
          Glyph={Glyph}
          selected={selected === id}
          onSelect={() => onSelect(id)}
          onOpen={() => open(id)}
        />
      ))}
    </div>
  );
}
