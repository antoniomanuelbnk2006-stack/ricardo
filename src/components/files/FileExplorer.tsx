import { useState } from "react";
import { FileItem } from "./FileItem";
import { FileProperties } from "./FileProperties";
import { AchievementsFile } from "./AchievementsFile";
import { TOTAL_SECRETS } from "../../systems/secrets/secretDefinitions";
import { useGameStore } from "../../store/gameStore";
import { audioManager } from "../../systems/audio/audioManager";

type OpenFile = "readme" | "log" | "dat" | "achievements" | null;

// README.txt esconde el SECRET #01 (04/37): una referencia que no
// deberia estar ahi, camuflada como un "codigo de referencia interno".
export function FileExplorer() {
  const [open, setOpen] = useState<OpenFile>(null);
  const unlockSecret = useGameStore((s) => s.unlockSecret);
  const secretsFound = useGameStore((s) => s.secretsFound);

  if (!open) {
    return (
      <div className="files-content">
        <FileItem name="README.txt" onOpen={() => setOpen("readme")} />
        <FileItem name="system.log" onOpen={() => setOpen("log")} />
        <FileItem name="old_data.dat" onOpen={() => setOpen("dat")} />
        <FileItem
          name="achievements.log"
          badge={`${secretsFound.length}/${TOTAL_SECRETS}`}
          onOpen={() => setOpen("achievements")}
        />
      </div>
    );
  }

  if (open === "achievements") {
    return (
      <div className="files-content">
        <FileProperties onBack={() => setOpen(null)}>
          <AchievementsFile />
        </FileProperties>
      </div>
    );
  }

  if (open === "readme") {
    return (
      <div className="files-content">
        <FileProperties onBack={() => setOpen(null)}>
          <div>Ultima sesion de calibracion: OK.</div>
          <div>
            Codigo de referencia interno:{" "}
            <span
              onClick={() => {
                audioManager.playSecret();
                unlockSecret("s1");
              }}
              style={{ cursor: "pointer", color: "#e0e0e0" }}
            >
              04/37
            </span>
          </div>
        </FileProperties>
      </div>
    );
  }

  if (open === "log") {
    return (
      <div className="files-content">
        <FileProperties onBack={() => setOpen(null)}>
          <div>[LOG] sesion iniciada.</div>
          <div>[LOG] MEMORY ADDRESS: 04/37</div>
          <div>[LOG] sesion finalizada sin errores.</div>
        </FileProperties>
      </div>
    );
  }

  return (
    <div className="files-content">
      <FileProperties onBack={() => setOpen(null)}>
        <div>[ARCHIVO BINARIO — SIN VISOR DISPONIBLE]</div>
      </FileProperties>
    </div>
  );
}
