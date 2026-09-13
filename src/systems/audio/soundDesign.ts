import { audioBufferToWavBlob } from "../../utils/wavEncoder";

const SAMPLE_RATE = 44100;

function hasOfflineAudio(): boolean {
  return typeof OfflineAudioContext !== "undefined";
}

async function render(seconds: number, build: (ctx: OfflineAudioContext) => void): Promise<AudioBuffer> {
  const ctx = new OfflineAudioContext(1, Math.ceil(SAMPLE_RATE * seconds), SAMPLE_RATE);
  build(ctx);
  return ctx.startRendering();
}

function noiseBuffer(ctx: OfflineAudioContext, seconds: number): AudioBuffer {
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function tone(ctx: OfflineAudioContext, opts: { freq: number; type: OscillatorType; start: number; dur: number; gain: number; sweepTo?: number; detune?: number }) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = opts.type;
  osc.frequency.setValueAtTime(opts.freq, opts.start);
  if (opts.detune) osc.detune.setValueAtTime(opts.detune, opts.start);
  if (opts.sweepTo) osc.frequency.exponentialRampToValueAtTime(opts.sweepTo, opts.start + opts.dur);
  g.gain.setValueAtTime(0.0001, opts.start);
  g.gain.exponentialRampToValueAtTime(opts.gain, opts.start + Math.min(0.01, opts.dur / 4));
  g.gain.exponentialRampToValueAtTime(0.0001, opts.start + opts.dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(opts.start);
  osc.stop(opts.start + opts.dur + 0.02);
}

// --- Efectos individuales -------------------------------------------------
// Cada uno mezcla mas de una capa (osc + ruido filtrado) en vez de un beep
// unico, para que suenen a "sonido de sistema" real y no a pitido de prueba.

async function buildKey(): Promise<AudioBuffer> {
  return render(0.05, (ctx) => {
    tone(ctx, { freq: 1400 + Math.random() * 300, type: "square", start: 0, dur: 0.015, gain: 0.12 });
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 0.02);
    const filt = ctx.createBiquadFilter();
    filt.type = "highpass";
    filt.frequency.value = 3000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.05, 0);
    g.gain.exponentialRampToValueAtTime(0.0001, 0.02);
    src.connect(filt).connect(g).connect(ctx.destination);
    src.start(0);
  });
}

async function buildClick(): Promise<AudioBuffer> {
  return render(0.08, (ctx) => {
    tone(ctx, { freq: 260, type: "square", start: 0, dur: 0.04, gain: 0.18, sweepTo: 160 });
    tone(ctx, { freq: 520, type: "triangle", start: 0, dur: 0.03, gain: 0.08 });
  });
}

async function buildSecret(): Promise<AudioBuffer> {
  return render(0.6, (ctx) => {
    tone(ctx, { freq: 1046, type: "sine", start: 0, dur: 0.16, gain: 0.14 });
    tone(ctx, { freq: 1568, type: "sine", start: 0.09, dur: 0.22, gain: 0.14 });
    tone(ctx, { freq: 2093, type: "sine", start: 0.18, dur: 0.3, gain: 0.09 });
  });
}

async function buildProtocolStinger(): Promise<AudioBuffer> {
  return render(0.7, (ctx) => {
    tone(ctx, { freq: 220, type: "triangle", start: 0, dur: 0.22, gain: 0.16 });
    tone(ctx, { freq: 220, type: "sawtooth", start: 0, dur: 0.22, gain: 0.05, detune: 6 });
    tone(ctx, { freq: 330, type: "triangle", start: 0.16, dur: 0.32, gain: 0.16 });
    tone(ctx, { freq: 330, type: "sawtooth", start: 0.16, dur: 0.32, gain: 0.05, detune: -6 });
  });
}

async function buildGlitch(): Promise<AudioBuffer> {
  return render(0.35, (ctx) => {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 0.3);
    const filt = ctx.createBiquadFilter();
    filt.type = "bandpass";
    filt.frequency.setValueAtTime(1200, 0);
    filt.frequency.exponentialRampToValueAtTime(120, 0.3);
    filt.Q.value = 4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.16, 0);
    g.gain.exponentialRampToValueAtTime(0.0001, 0.3);
    src.connect(filt).connect(g).connect(ctx.destination);
    src.start(0);
    tone(ctx, { freq: 90, type: "sawtooth", start: 0, dur: 0.28, gain: 0.1, sweepTo: 35 });
  });
}

async function buildFinalTone(): Promise<AudioBuffer> {
  return render(3, (ctx) => {
    tone(ctx, { freq: 110, type: "sine", start: 0, dur: 2.6, gain: 0.13, sweepTo: 40 });
    tone(ctx, { freq: 220, type: "sine", start: 0, dur: 2.2, gain: 0.05, sweepTo: 80 });
  });
}

async function buildAmbientHum(): Promise<AudioBuffer> {
  // Buffer looping de 2s: zumbido electrico con un LFO muy lento en el
  // filtro para que no sea un tono plano y muerto.
  return render(2, (ctx) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 58;
    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(300, 0);
    filt.frequency.linearRampToValueAtTime(420, 1);
    filt.frequency.linearRampToValueAtTime(300, 2);
    const g = ctx.createGain();
    g.gain.value = 0.05;
    osc.connect(filt).connect(g).connect(ctx.destination);
    osc.start(0);
    osc.stop(2);

    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 2);
    const nf = ctx.createBiquadFilter();
    nf.type = "lowpass";
    nf.frequency.value = 500;
    const ng = ctx.createGain();
    ng.gain.value = 0.01;
    src.connect(nf).connect(ng).connect(ctx.destination);
    src.start(0);
  });
}

export type SoundKey = "key" | "click" | "secret" | "protocolStinger" | "glitch" | "finalTone" | "ambientHum";

const BUILDERS: Record<SoundKey, () => Promise<AudioBuffer>> = {
  key: buildKey,
  click: buildClick,
  secret: buildSecret,
  protocolStinger: buildProtocolStinger,
  glitch: buildGlitch,
  finalTone: buildFinalTone,
  ambientHum: buildAmbientHum,
};

// Genera todos los sonidos una vez y devuelve sus blob URLs. Si el
// entorno no soporta OfflineAudioContext (por ejemplo jsdom en tests),
// se resuelve con un mapa vacio en vez de lanzar.
export async function generateSoundUrls(): Promise<Partial<Record<SoundKey, string>>> {
  if (!hasOfflineAudio()) return {};
  const entries = await Promise.all(
    (Object.keys(BUILDERS) as SoundKey[]).map(async (key) => {
      try {
        const buffer = await BUILDERS[key]();
        const blob = audioBufferToWavBlob(buffer);
        return [key, URL.createObjectURL(blob)] as const;
      } catch {
        return [key, undefined] as const;
      }
    })
  );
  const out: Partial<Record<SoundKey, string>> = {};
  for (const [key, url] of entries) if (url) out[key] = url;
  return out;
}
