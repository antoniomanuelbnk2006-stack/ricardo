import { useState } from "react";
import { useGameStore } from "../../store/gameStore";

function VolumeSlider({ label, value, disabled, onChange }: { label: string; value: number; disabled: boolean; onChange: (v: number) => void }) {
  return (
    <div className="config-row" style={{ opacity: disabled ? 0.5 : 1 }}>
      <div style={{ marginBottom: 4 }}>
        {label}: {Math.round(value * 100)}%
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(value * 100)}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        style={{ width: "100%" }}
      />
    </div>
  );
}

export function ConfigWindow() {
  const settings = useGameStore((s) => s.settings);
  const setMuted = useGameStore((s) => s.setMuted);
  const setVolumeMaster = useGameStore((s) => s.setVolumeMaster);
  const setVolumeAmbience = useGameStore((s) => s.setVolumeAmbience);
  const setVolumeUI = useGameStore((s) => s.setVolumeUI);
  const setVolumeGlitch = useGameStore((s) => s.setVolumeGlitch);
  const setCrtEnabled = useGameStore((s) => s.setCrtEnabled);
  const setTvFrameEnabled = useGameStore((s) => s.setTvFrameEnabled);
  const setReducedMotion = useGameStore((s) => s.setReducedMotion);
  const resetGameData = useGameStore((s) => s.resetGameData);
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <div className="config-panel">
      <div className="config-title">SYSTEM CONFIGURATION</div>

      <div className="config-section-title">AUDIO</div>
      <label className="config-row">
        <input type="checkbox" checked={!settings.audioMuted} onChange={(e) => setMuted(!e.target.checked)} /> AUDIO
        ENABLED
      </label>
      <VolumeSlider label="MASTER" value={settings.volumeMaster} disabled={settings.audioMuted} onChange={setVolumeMaster} />
      <VolumeSlider label="AMBIENCE" value={settings.volumeAmbience} disabled={settings.audioMuted} onChange={setVolumeAmbience} />
      <VolumeSlider label="UI" value={settings.volumeUI} disabled={settings.audioMuted} onChange={setVolumeUI} />
      <VolumeSlider label="GLITCH" value={settings.volumeGlitch} disabled={settings.audioMuted} onChange={setVolumeGlitch} />

      <div className="config-section-title">DISPLAY</div>
      <label className="config-row">
        <input type="checkbox" checked={settings.crtEnabled} onChange={(e) => setCrtEnabled(e.target.checked)} /> CRT
        EFFECT
      </label>
      <label className="config-row">
        <input
          type="checkbox"
          checked={settings.tvFrameEnabled}
          onChange={(e) => setTvFrameEnabled(e.target.checked)}
        />{" "}
        TV CABINET (el mueble roba espacio: desactivalo en pantallas pequenas)
      </label>
      <label className="config-row">
        <input
          type="checkbox"
          checked={settings.reducedMotion}
          onChange={(e) => setReducedMotion(e.target.checked)}
        />{" "}
        REDUCED MOTION (desactiva flashes, temblor y separacion RGB)
      </label>

      <div className="config-section-title">DATA</div>
      {!confirmingReset ? (
        <button className="config-danger-btn" onClick={() => setConfirmingReset(true)}>
          RESET GAME DATA...
        </button>
      ) : (
        <div className="config-confirm-box">
          <div style={{ marginBottom: 6, fontWeight: "bold" }}>ARE YOU SURE?</div>
          <div style={{ marginBottom: 8 }}>THIS WILL DELETE: PROGRESS, SECRET DISCOVERIES, STATISTICS.</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="config-danger-btn" style={{ color: "#000" }} onClick={() => setConfirmingReset(false)}>
              CANCEL
            </button>
            <button
              className="config-danger-btn"
              onClick={() => {
                resetGameData();
                setConfirmingReset(false);
              }}
            >
              DELETE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
