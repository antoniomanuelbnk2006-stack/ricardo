import { Howl } from "howler";
import { generateSoundUrls, type SoundKey } from "./soundDesign";
import { useAudioStore } from "../../store/audioStore";
import { shouldAmbientPlay } from "./ambientLogic";

const howls: Partial<Record<SoundKey, Howl>> = {};
let ambientHowl: Howl | null = null;
let ready = false;

// "Se quiere" el ambiente sonando (alguna ventana abierta) independiente
// de si esta AUDIBLE ahora mismo (mute/volumen a 0 lo silencian sin
// "desear" que se pare). Asi, al des-silenciar o subir el volumen, se
// puede retomar la reproduccion en vez de quedarse detenido para siempre
// -- ese era exactamente el bug: refreshVolume() solo bajaba/ajustaba un
// Howl que ya estuviera sonando, nunca lo volvia a arrancar.
let ambientWanted = false;

// Genera los buffers una sola vez (async) y crea los Howl. Hasta que
// esto resuelve, playX() simplemente no hace nada -- toma unos pocos ms.
const readyPromise: Promise<void> = generateSoundUrls().then((urls) => {
  for (const key of Object.keys(urls) as SoundKey[]) {
    if (key === "ambientHum") continue;
    const url = urls[key];
    if (!url) continue;
    howls[key] = new Howl({ src: [url], format: ["wav"] });
  }
  if (urls.ambientHum) {
    ambientHowl = new Howl({ src: [urls.ambientHum], format: ["wav"], loop: true, volume: 0 });
    // Si ya se habia pedido ambiente antes de que esto terminara de
    // generarse, arrancarlo ahora.
    if (ambientWanted) applyAmbientState();
  }
  ready = true;
});

// Canales de accesibilidad (biblia de publicacion, seccion AUDIO):
// MASTER siempre multiplica; AMBIENCE/UI/GLITCH son volumenes independientes
// por categoria de sonido.
type Channel = "ambience" | "ui" | "glitch";

function channelVolume(channel: Channel): number {
  const { muted, volumeMaster, volumeAmbience, volumeUI, volumeGlitch } = useAudioStore.getState();
  if (muted) return 0;
  const perChannel = channel === "ambience" ? volumeAmbience : channel === "glitch" ? volumeGlitch : volumeUI;
  return volumeMaster * perChannel;
}

function play(key: SoundKey, channel: Channel, gainMultiplier = 1) {
  const v = channelVolume(channel);
  if (v <= 0 || !ready) return;
  const howl = howls[key];
  if (!howl) return;
  const id = howl.play();
  howl.volume(v * gainMultiplier, id);
}

// Unica funcion que decide el estado real del Howl de ambiente, a partir
// de "se quiere sonando" (ambientWanted) + "hay volumen audible ahora
// mismo" (channelVolume). Se llama tanto al pedir/parar ambiente como al
// cambiar mute/volumen -- asi nunca se puede quedar "queriendo sonar"
// pero silenciado para siempre.
function applyAmbientState() {
  if (!ambientHowl) return;
  const v = channelVolume("ambience");
  if (shouldAmbientPlay(ambientWanted, v)) {
    if (!ambientHowl.playing()) ambientHowl.play();
    ambientHowl.volume(v * 0.6);
  } else if (ambientHowl.playing()) {
    ambientHowl.stop();
  }
}

export const audioManager = {
  playKey: () => play("key", "ui", 0.8),
  playClick: () => play("click", "ui"),
  playSecret: () => play("secret", "ui"),
  playProtocolStinger: () => play("protocolStinger", "ui"),
  playGlitch: () => play("glitch", "glitch"),
  playFinalTone: () => play("finalTone", "ui"),

  startAmbient: () => {
    ambientWanted = true;
    applyAmbientState();
  },
  stopAmbient: () => {
    ambientWanted = false;
    applyAmbientState();
  },
  // Se llama al cambiar mute o cualquiera de los 4 volumenes: retoma el
  // ambiente si se queria sonando y ahora vuelve a haber volumen, o lo
  // silencia si el volumen ha bajado a 0 -- en ambos sentidos.
  refreshVolume: () => {
    applyAmbientState();
  },

  // Expuesto solo para tests: permite esperar a que los Howl esten listos
  // e inspeccionar si el ambiente "deberia" estar sonando.
  _ready: readyPromise,
  _isAmbientWanted: () => ambientWanted,
};
