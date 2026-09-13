import { useEffect, useRef, useState } from "react";
import { PLAYER_NAME_MAX, validatePlayerName } from "../../utils/validation";
import { audioManager } from "../../systems/audio/audioManager";

interface NameInputProps {
  onConfirm: (name: string) => void;
}

// Pantalla de identificacion (biblia, seccion 5). El nombre no sale del
// navegador: se guarda en localStorage junto al resto de la partida y se
// usa solo para los mensajes del terminal y el informe final.
export function NameInput({ onConfirm }: NameInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function submit() {
    const result = validatePlayerName(value);
    if (!result.ok) {
      setError(result.error);
      audioManager.playGlitch();
      return;
    }
    setError(null);
    audioManager.playProtocolStinger();
    onConfirm(result.value);
  }

  return (
    <div className="identity-screen">
      <p className="identity-title">IDENTIFICACION DEL USUARIO REQUERIDA</p>
      <p className="identity-sub">Introduce tu nombre para iniciar el protocolo.</p>

      <div className="identity-row">
        <label className="identity-prompt" htmlFor="player-name">
          C:\RICKYEDIT&gt;
        </label>
        <input
          id="player-name"
          ref={inputRef}
          className="identity-input"
          type="text"
          value={value}
          maxLength={PLAYER_NAME_MAX}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          inputMode="text"
          enterKeyHint="go"
          aria-describedby="identity-feedback"
          aria-invalid={error !== null}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            // El terminal escucha teclas globalmente para los secretos;
            // aqui paramos la propagacion para que escribir un nombre con
            // numeros no dispare el codigo 0437 sin querer.
            e.stopPropagation();
            if (e.key === "Enter") submit();
          }}
        />
      </div>

      <p
        id="identity-feedback"
        className={error ? "identity-error" : "identity-hint"}
        role={error ? "alert" : undefined}
      >
        {error ?? `${value.trim().length}/${PLAYER_NAME_MAX} — el nombre no sale de este equipo.`}
      </p>

      <button type="button" className="protocol-btn identity-submit" onClick={submit}>
        REGISTRAR
      </button>
    </div>
  );
}
