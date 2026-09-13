import { useEffect, useMemo, useState } from "react";
import { Terminal } from "../terminal/Terminal";
import { NameInput } from "../identity/NameInput";
import { ProtocolShell } from "../protocol/ProtocolShell";
import { ProtocolIntro } from "../protocol/ProtocolIntro";
import {
  Protocol01,
  Protocol02,
  Protocol03,
  Protocol04,
  Protocol05,
  Protocol00,
} from "../../protocols";
import { SystemReport } from "../protocol/SystemReport";
import { P01_INTRO_LINES } from "../../protocols/protocol01/protocol01.data";
import { P02_INTRO_LINES } from "../../protocols/protocol02/protocol02.data";
import { P03_INTRO_LINES } from "../../protocols/protocol03/protocol03.data";
import { P04_INTRO_LINES } from "../../protocols/protocol04/protocol04.data";
import { P05_INTRO_LINES } from "../../protocols/protocol05/protocol05.data";
import { useGameStore } from "../../store/gameStore";
import { useSecretFlash } from "../../systems/secrets/useSecretFlash";
import { useWindowStore } from "../../store/windowStore";

type Stage =
  | "boot"
  | "identity"
  | "welcome"
  | "intro01" | "p01"
  | "intro02" | "p02"
  | "intro03" | "p03"
  | "intro04" | "p04"
  | "intro05" | "p05"
  | "report"
  | "p00Available" | "p00"
  | "end";

// Orquesta boot -> identificacion -> (intro+P01) -> ... -> P05 -> (P00) -> fin.
export function RickyEditContent() {
  const [stage, setStage] = useState<Stage>("boot");
  const secretsFound = useGameStore((s) => s.secretsFound);
  const playerName = useGameStore((s) => s.playerName);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const startSession = useGameStore((s) => s.startSession);
  const endSession = useGameStore((s) => s.endSession);
  const completeProtocol = useGameStore((s) => s.completeProtocol);
  const removeProgram = useGameStore((s) => s.removeProgram);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const flash = useSecretFlash();
  const protocol00Unlocked = secretsFound.includes("s5");

  // El cronometro arranca al abrir el programa y se congela justo al
  // entrar en el informe, no antes: asi el tiempo total refleja la
  // partida completa aunque el jugador se quede leyendo el resumen.
  useEffect(() => {
    startSession();
  }, [startSession]);

  useEffect(() => {
    if (stage === "report") endSession();
    if (stage === "end") closeWindow("ricky");
  }, [stage, closeWindow, endSession]);

  // Se memoriza porque ProtocolIntro reinicia el motor de tipeo cada vez
  // que cambia la referencia del array: sin useMemo la intro se repetiria
  // en bucle en cada render.
  const welcomeLines = useMemo(
    () => [
      `USUARIO REGISTRADO: ${playerName.toUpperCase()}`,
      "",
      `Bienvenido, ${playerName}. No cierres esta ventana.`,
      "",
      "LOADING PROTOCOL 01...",
    ],
    [playerName]
  );

  function advance(id: "01" | "02" | "03" | "04" | "05", next: Stage) {
    completeProtocol(id);
    setStage(next);
  }

  if (stage === "boot")
    // Si el jugador ya se identifico en una sesion anterior no se le
    // vuelve a preguntar: el nombre vive en localStorage con el resto de
    // la partida.
    return <Terminal onBootComplete={() => setStage(playerName ? "welcome" : "identity")} />;

  if (stage === "identity")
    return (
      <NameInput
        onConfirm={(name) => {
          setPlayerName(name);
          setStage("welcome");
        }}
      />
    );

  if (stage === "welcome") return <ProtocolIntro lines={welcomeLines} onDone={() => setStage("intro01")} />;
  if (stage === "intro01") return <ProtocolIntro lines={P01_INTRO_LINES} onDone={() => setStage("p01")} />;
  if (stage === "p01")
    return (
      <ProtocolShell name="PROTOCOL 01 — MEMORY" secretsFound={secretsFound.length} flash={flash}>
        <Protocol01 onComplete={() => advance("01", "intro02")} />
      </ProtocolShell>
    );

  if (stage === "intro02") return <ProtocolIntro lines={P02_INTRO_LINES} onDone={() => setStage("p02")} />;
  if (stage === "p02")
    return (
      <ProtocolShell name="PROTOCOL 02 — REACTION" secretsFound={secretsFound.length} flash={flash}>
        <Protocol02 onComplete={() => advance("02", "intro03")} />
      </ProtocolShell>
    );

  if (stage === "intro03") return <ProtocolIntro lines={P03_INTRO_LINES} onDone={() => setStage("p03")} />;
  if (stage === "p03")
    return (
      <ProtocolShell name="PROTOCOL 03 — PATTERN" secretsFound={secretsFound.length} flash={flash}>
        <Protocol03 onComplete={() => advance("03", "intro04")} />
      </ProtocolShell>
    );

  if (stage === "intro04") return <ProtocolIntro lines={P04_INTRO_LINES} onDone={() => setStage("p04")} />;
  if (stage === "p04")
    return (
      <ProtocolShell name="PROTOCOL 04 — LOGIC" secretsFound={secretsFound.length} flash={flash}>
        <Protocol04 onComplete={() => advance("04", "intro05")} />
      </ProtocolShell>
    );

  if (stage === "intro05") return <ProtocolIntro lines={P05_INTRO_LINES} onDone={() => setStage("p05")} />;
  if (stage === "p05")
    return (
      <ProtocolShell name="PROTOCOL 05 — TERMINATION" secretsFound={secretsFound.length} flash={flash}>
        <Protocol05
          onComplete={() => {
            completeProtocol("05");
            setStage("report");
          }}
        />
      </ProtocolShell>
    );

  if (stage === "report")
    return (
      <SystemReport
        onContinue={() => setStage(protocol00Unlocked ? "p00Available" : "end")}
        onRestartSession={() => {
          startSession();
          setStage("boot");
        }}
      />
    );

  if (stage === "p00Available")
    return <ProtocolIntro lines={["C:\\RICKYEDIT>", "", "PROTOCOL 00 AVAILABLE."]} onDone={() => setStage("p00")} />;

  if (stage === "p00")
    return (
      <Protocol00
        onComplete={() => {
          removeProgram();
          closeWindow("ricky");
        }}
      />
    );

  // "end": no se desbloqueo PROTOCOL 00 -> la pantalla vuelve al escritorio
  // (el useEffect de arriba cierra la ventana; aqui no queda nada que pintar).
  return null;
}
