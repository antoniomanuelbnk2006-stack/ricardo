import { describe, it, expect } from "vitest";
import { encodeWavArrayBuffer, audioBufferToWavBlob } from "../../src/utils/wavEncoder";

// No hace falta un AudioContext real: la funcion solo necesita un objeto
// con la forma de AudioBuffer (numberOfChannels, sampleRate, length,
// getChannelData).
function fakeAudioBuffer(samples: number[]): AudioBuffer {
  const data = new Float32Array(samples);
  return {
    numberOfChannels: 1,
    sampleRate: 44100,
    length: data.length,
    getChannelData: () => data,
  } as unknown as AudioBuffer;
}

describe("encodeWavArrayBuffer", () => {
  it("genera la cabecera RIFF/WAVE/data correcta", () => {
    const buffer = fakeAudioBuffer([0, 0.5, -0.5, 1, -1]);
    const arrayBuffer = encodeWavArrayBuffer(buffer);
    const view = new DataView(arrayBuffer);
    const readStr = (offset: number, len: number) =>
      String.fromCharCode(...Array.from({ length: len }, (_, i) => view.getUint8(offset + i)));

    expect(readStr(0, 4)).toBe("RIFF");
    expect(readStr(8, 4)).toBe("WAVE");
    expect(readStr(36, 4)).toBe("data");
    // 44 bytes de cabecera + 5 muestras * 2 bytes (PCM16 mono)
    expect(arrayBuffer.byteLength).toBe(44 + 5 * 2);
  });

  it("audioBufferToWavBlob devuelve un Blob de tipo audio/wav", () => {
    const buffer = fakeAudioBuffer([0, 1, -1]);
    const blob = audioBufferToWavBlob(buffer);
    expect(blob.type).toBe("audio/wav");
    expect(blob.size).toBe(44 + 3 * 2);
  });
});
