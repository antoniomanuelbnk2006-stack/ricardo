import type { Statistics } from "./statistics";

export type ProtocolId = "01" | "02" | "03" | "04" | "05" | "00";
export type SecretId = "s1" | "s2" | "s3" | "s4" | "s5";

export interface Settings {
  audioMuted: boolean;
  volumeMaster: number; // 0..1
  volumeAmbience: number; // 0..1 -- zumbido ambiente
  volumeUI: number; // 0..1 -- tecla, click, secreto, stinger de protocolo, tono final
  volumeGlitch: number; // 0..1 -- efecto de glitch
  crtEnabled: boolean;
  reducedMotion: boolean; // desactiva/atenua flashes, temblor y separacion RGB
  tvFrameEnabled: boolean; // dibuja el escritorio dentro de un televisor antiguo
}

export interface GameState {
  /**
   * true en cuanto se ha leido la partida de localStorage. Sirve para que
   * los avisos de "secreto encontrado" no salten por los secretos que ya
   * venian guardados de una sesion anterior.
   */
  hydrated: boolean;
  /** Nombre introducido en la pantalla de identificacion. "" = sin registrar. */
  playerName: string;
  completedProtocols: ProtocolId[];
  secretsFound: SecretId[];
  corruptionLevel: 0 | 1 | 2 | 3 | 4;
  stats: Statistics;
  settings: Settings;
  programRemoved: boolean;
}
