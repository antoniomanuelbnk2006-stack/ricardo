# Audio

No hay ficheros de audio grabados, y probablemente no hagan falta.

Todos los efectos (tecla, click, secreto, stinger de protocolo, glitch,
zumbido ambiente, tono final) se **sintetizan** con la Web Audio API en
`src/systems/audio/soundDesign.ts`: varias capas de osciladores y ruido
filtrado, no un beep suelto. Los buffers resultantes se codifican a WAV
(`src/utils/wavEncoder.ts`) y se le pasan a **Howler**, que es quien se
encarga de la reproduccion, la mezcla y el volumen por canal.

Es decir: Howler **si** se usa. No es una dependencia a la espera.

## Ventajas de seguir asi

- Cero peso de assets y cero peticiones de red.
- Ningun problema de derechos: no hay audio de terceros.
- Los sonidos se ajustan cambiando numeros, no reexportando ficheros.

## Si algun dia se quieren sonidos grabados

Dejarlos en esta carpeta y sustituir en `audioManager.ts` la generacion de
buffers por `new Howl({ src: ["/audio/<fichero>.mp3"] })`. El resto del
sistema (canales, volumenes, silencio, ambiente) no cambia.

Usar solo audio con derechos de uso: el proyecto es de fan y no oficial.
