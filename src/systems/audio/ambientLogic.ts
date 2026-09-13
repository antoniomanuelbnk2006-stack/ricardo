// Logica pura (sin Howler ni Web Audio) que decide si el ambiente
// deberia estar sonando: hace falta QUERERLO (alguna ventana abierta) Y
// que haya volumen audible (ni muted ni MASTER/AMBIENCE a 0). Separada
// de audioManager.ts para poder testearla sin un AudioContext real -- es
// exactamente la logica cuyo bug (el ambiente no retomaba tras
// des-silenciar) queremos que no pueda volver a colarse en silencio.
export function shouldAmbientPlay(wanted: boolean, ambienceVolume: number): boolean {
  return wanted && ambienceVolume > 0;
}
