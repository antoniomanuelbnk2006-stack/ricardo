import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock de Howler: un Howl falso que registra play/stop/playing/volume de
// verdad, y guarda cada instancia creada para poder inspeccionarla desde
// el test (audioManager no expone el Howl interno).
const createdHowls: FakeHowl[] = [];
class FakeHowl {
  private isPlaying = false;
  public lastVolume: number | null = null;
  constructor() {
    createdHowls.push(this);
  }
  play() {
    this.isPlaying = true;
    return 1;
  }
  stop() {
    this.isPlaying = false;
  }
  playing() {
    return this.isPlaying;
  }
  volume(v?: number) {
    if (v !== undefined) this.lastVolume = v;
    return this.lastVolume ?? 1;
  }
}
vi.mock("howler", () => ({ Howl: FakeHowl }));

vi.mock("../../src/systems/audio/soundDesign", () => ({
  generateSoundUrls: async () => ({ ambientHum: "blob:fake-ambient" }),
}));

describe("audioManager: retomar el ambiente tras silenciar/des-silenciar", () => {
  beforeEach(() => {
    vi.resetModules();
    createdHowls.length = 0;
  });

  it(
    "el ambiente se detiene al silenciar y VUELVE A SONAR de verdad al des-silenciar (bug ya arreglado)",
    async () => {
      const { useAudioStore } = await import("../../src/store/audioStore");
      const { audioManager } = await import("../../src/systems/audio/audioManager");
      await audioManager._ready;

      const ambientHowl = createdHowls[0];
      expect(ambientHowl).toBeTruthy();

      useAudioStore.setState({ muted: false, volumeMaster: 0.5, volumeAmbience: 1, volumeUI: 1, volumeGlitch: 1 });
      audioManager.startAmbient();
      expect(ambientHowl.playing()).toBe(true);

      // Silenciar: el ambiente debe pararse de verdad.
      useAudioStore.setState({ muted: true });
      audioManager.refreshVolume();
      expect(ambientHowl.playing()).toBe(false);

      // Des-silenciar: este es el caso que estaba roto. Antes del fix,
      // refreshVolume() solo ajustaba el volumen de un Howl que ya
      // estuviera sonando (con el `if (ambientHowl.playing())` de
      // guardia), y como se acababa de parar, nunca llamaba a play()
      // de nuevo -- se quedaba en silencio para siempre.
      useAudioStore.setState({ muted: false });
      audioManager.refreshVolume();
      expect(ambientHowl.playing()).toBe(true);
    }
  );
});
