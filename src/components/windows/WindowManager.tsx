import { useWindowStore } from "../../store/windowStore";
import { DraggableWindow } from "./DraggableWindow";
import { RickyEditContent } from "./RickyEditContent";
import { FileExplorer } from "../files/FileExplorer";
import { RecycleBin } from "../recycle/RecycleBin";
import { ConfigWindow } from "../config/ConfigWindow";

export function WindowManager() {
  const open = useWindowStore((s) => s.open);

  return (
    <>
      {open.map((w) => {
        if (w.kind === "ricky")
          return (
            <DraggableWindow key={w.kind} kind="ricky" title="C:\RICKYEDIT" x={w.x} y={w.y} w={820} h={580}>
              <RickyEditContent />
            </DraggableWindow>
          );
        if (w.kind === "files")
          return (
            <DraggableWindow key={w.kind} kind="files" title="Mis archivos" x={w.x} y={w.y} w={420} h={320}>
              <FileExplorer />
            </DraggableWindow>
          );
        if (w.kind === "trash")
          return (
            <DraggableWindow key={w.kind} kind="trash" title="Papelera" x={w.x} y={w.y} w={340} h={220}>
              <RecycleBin />
            </DraggableWindow>
          );
        if (w.kind === "config")
          return (
            <DraggableWindow key={w.kind} kind="config" title="Config" x={w.x} y={w.y} w={340} h={460}>
              <ConfigWindow />
            </DraggableWindow>
          );
        return null;
      })}
    </>
  );
}
