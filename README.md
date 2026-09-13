# RICKYEDIT.EXE

Experiencia web narrativa con estetica Windows 95/98: escritorio falso,
terminal, 5 protocolos + PROTOCOL 00 secreto, 5 secretos y corrupcion
progresiva del sistema.

## Stack

React + TypeScript + Vite + Zustand (estado global) + Howler.js (reproduce
los sonidos, que se sintetizan en tiempo de ejecucion — ver
`public/audio/README.md`) + localStorage (progreso real).

## Empezar

```bash
npm install
npm run dev
```

| Comando | Que hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` | Comprueba tipos y genera `dist/`. |
| `npm run preview` | Sirve `dist/` para probar el build real. |
| `npm test` | Suite completa (vitest). |
| `npm run typecheck` | Tipos de `src/` **y** de `tests/`. |
| `npm run lint` | ESLint (incluye reglas de hooks de React). |
| `npm run validate` | Todo lo anterior de una vez, antes de publicar. |
| `npm run test:coverage` | Cobertura (informe HTML en `coverage/`). |

## Fondo de escritorio

La fotografia de escritorio es opcional. Si dejas un archivo en
`public/assets/images/ricky-desktop.webp` se pinta automaticamente,
centrado y con `background-size: contain` para no deformarla; el teal
clasico de Windows cubre lo que sobre. Si el archivo no existe, el
escritorio se queda con el teal y no aparece ninguna imagen rota.

## Privacidad

Todo ocurre en el navegador. No hay backend, ni base de datos, ni
analitica, ni variables de entorno. El nombre del jugador, el progreso,
los secretos y las estadisticas viven unicamente en el `localStorage` del
equipo, bajo la clave `rickyedit-save-v1`, y se pueden borrar por
completo desde Config -> RESET GAME DATA.

## Publicacion

El proyecto es estatico y esta preparado para **Vercel** (framework Vite,
build `npm run build`, salida `dist`), con `vercel.json` ya incluido.
Tambien se mantiene el workflow de GitHub Pages en
`.github/workflows/deploy.yml` junto al `CNAME`, por si se prefiere esa
via; los dos pueden convivir.

## Aviso

Proyecto de fan, no oficial y sin relacion ni aprobacion de RickyEdit.
No usa imagenes ni audio con copyright: los iconos son SVG propios y
todos los sonidos se generan por sintesis en tiempo de ejecucion.

## Estado del proyecto

- **Arquitectura completa**: escritorio, ventanas (arrastrables, con
  minimizar/maximizar/cerrar funcionales de verdad), terminal con boot
  tipeado (con skip de linea via click/tecla), menu Start real (con
  "Apagar el sistema..."), reloj con calendario emergente al hacer
  click, game state, sistema de secretos, corrupcion progresiva con
  glitches por nivel, persistencia real en localStorage.
- **Accesibilidad**: REDUCED MOTION en Config (desactiva flashes, temblor
  y separacion RGB de golpe) y 4 canales de volumen independientes
  (MASTER, AMBIENCE, UI, GLITCH) ademas del mute general.
- **Rejugabilidad**: RESTART SESSION en la pantalla de estadisticas
  finales (rejuega los protocolos sin perder los secretos ya
  encontrados) y RESET GAME DATA en Config (borra TODO el progreso con
  una confirmacion de dos pasos: "ARE YOU SURE? / CANCEL / DELETE").
- **Audio real via Howler**: los efectos (tecla, click, secreto, stinger
  de protocolo, glitch, zumbido ambiente, tono final) se generan una vez
  con Web Audio (varias capas: osciladores + ruido filtrado, no un beep
  suelto) y se sirven como WAV a Howler, que se encarga de la
  reproduccion/mezcla/volumen real por canal.
- **Glitches visuales rediseñados**: estatica real por canvas (pixeles
  aleatorios redibujados, no un patron CSS fijo), separacion de canales
  RGB de verdad via un filtro SVG aplicado al lienzo completo en bursts
  aleatorios, un "frame corrupto" (contraste/tono) y un microtemblor de
  1-3px -- todo con frecuencia e intensidad creciente segun el nivel de
  corrupcion (0-4), y todo desactivable con REDUCED MOTION.
- **SYSTEM REPORT**: pantalla de estadisticas oculta al final de la
  partida (tras PROTOCOL 05) con todo lo que el sistema registro en
  silencio: respuestas, tiempos, clics, secretos encontrados, etc.
- **PROTOCOL 01 (MEMORY), 02 (REACTION), 03 (PATTERN), 04 (LOGIC) y 05
  (TERMINATION) + PROTOCOL 00** implementados siguiendo la "biblia"
  completa: preguntas, secuencias, anomalias (OBJECT DOES NOT EXIST, el
  flicker 24/24/23, el "PROTOCOL 02 FAILED" de un frame, etc.) y los 5
  secretos (04/37, el valor imposible, DON'T LOOK AWAY, THE LOOP, 0437).
- **Tres puzzles de PROTOCOL 04** (el de las cajas, el de los
  interruptores y el del orden) no traian una respuesta explicita o
  consistente en la biblia — se resolvieron/corrigieron por deduccion
  logica (con tabla de verdad) y quedan comentados en
  `src/protocols/protocol04/protocol04.data.ts`, con un test que fija
  la solucion (`tests/protocols/protocol04.test.ts`).
- La pregunta final de PROTOCOL 05 ("¿cuántos protocolos has
  completado?") se responde ahora contra el progreso real en ese
  instante (4, ya que el propio PROTOCOL 05 todavia esta en curso), no
  contra un texto fijo — ver `tests/protocols/protocol05.test.tsx`.
- El zumbido ambiente ya retoma correctamente tras silenciar y volver a
  activar el audio (antes se quedaba mudo para siempre) — ver
  `tests/systems/audioManagerAmbient.test.ts`.
- **Mueble de televisor**: el escritorio se dibuja dentro de un televisor
  de madera de los 80, hecho enteramente con CSS (sin imagenes, sin peso y
  nitido a cualquier escala). Es decoracion pura: el hueco de la pantalla
  sigue midiendo 1024x768 exactos y no altera coordenadas ni clics. Se
  apaga desde Config -> TV CABINET, y se oculta solo en pantallas
  estrechas, donde el marco robaria demasiado espacio.
- **Registro de logros**: `achievements.log` dentro de "Mis archivos"
  lista los 5 secretos con un tick `[✓]` en los conseguidos. Los que
  faltan salen con el nombre censurado (`REGISTRO 04 — ████████`) y una
  pista corta que orienta sin resolver; las pistas viven junto a cada
  secreto en `src/systems/secrets/secretDefinitions.ts`. El tick aparece en vivo, con el archivo
  abierto, y la fila se resalta unos segundos al desbloquearse.
- **Identificacion del jugador**: tras el boot, el sistema pide un
  nombre (validado: 1-16 caracteres, letras con acentos, numeros y
  `. _ -`), lo usa en la bienvenida y en el SYSTEM REPORT, y lo guarda
  solo en `localStorage`. No se envia a ningun servidor.
- **Monitor 4:3 real**: todo se disena a 1024x768 y se escala entero, con
  bandas negras a los lados. Nunca se deforma. En movil vertical aparece
  un aviso (descartable) de girar el dispositivo.
- **Tactil**: ventanas arrastrables con el dedo (Pointer Events) e iconos
  que se abren con doble toque, ademas del doble click de raton.
- Faltan los iconos como imagenes binarias (ahora son SVG en
  `src/components/desktop/icons.tsx`) y el cursor personalizado — ver
  `public/assets/README.md`. La fotografia de escritorio es opcional y se
  detecta sola si la dejas en su sitio.
- **Limitacion conocida**: el progreso de una partida NO se guarda. Al
  reabrir RICKYEDIT.EXE se empieza por el arranque aunque hubiera
  protocolos completados, asi que los cinco hay que hacerlos del tiron.
  Lo que si persiste entre sesiones son los secretos, el nombre y los
  ajustes.
- **Limitacion conocida**: el secreto que depende de mantener el raton
  quieto no tiene equivalente tactil. En movil se pueden conseguir 4 de 5.
- **Documentacion**: `AUDITORIA_FINAL.md` (auditoria P0),
  `docs/QA_CHECKLIST.md` (lo que hay que probar a mano
  antes de publicar) y `docs/LOGIC_AUDIT.md` (auditoria formal de las diez
  preguntas de PROTOCOL 04, con tablas de verdad).
- **Guardado a prueba de basura**: lo que se lee de `localStorage` se sanea
  campo a campo antes de entrar en el estado, asi que un guardado editado a
  mano, escrito a medias o de una version anterior no deja la web en blanco.
- `npm run test` corre 140 tests (vitest + React Testing Library),
  incluyendo un test de integracion que enciende RICKYEDIT.EXE de verdad
  y recorre boot -> identificacion -> intro -> primer ejercicio, y otro
  que falla si la consola escupe un solo error o warning.

## Duracion estimada

Con 8 preguntas (P01) + 5 fases de reaccion + pregunta final (P02) + 10
tests (P03) + 10 tests (P04) + 10 fases (P05), el recorrido completo esta
pensado para rondar los ~10 minutos de gameplay real, dependiendo de lo
que tarde cada jugador en leer y responder (nunca hay limite de tiempo
que penalice automaticamente).
