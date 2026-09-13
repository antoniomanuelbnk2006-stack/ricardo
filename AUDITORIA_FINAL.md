# P0 — INFORME DE AUDITORÍA

## 1. Resumen ejecutivo

| | |
| --- | --- |
| **Proyecto** | rickyedit-exe 0.1.0 |
| **Fecha** | 12 de septiembre de 2026 |
| **Entorno** | Linux (Ubuntu 24), Node v22.22.2, npm 10.9.7, instalación limpia vía `npm ci` |
| **Alcance** | Solo P0. No se han hecho mejoras P1/P2 salvo las necesarias para desbloquear un P0 |
| **Veredicto** | **P0 NO APROBADO** |

El motivo del veredicto **no** es que queden defectos conocidos sin corregir. Es
que la validación manual exigida (navegador real, Safari iOS, Android, audio,
resoluciones) **no se ha podido ejecutar en este entorno**, que no dispone de
navegador gráfico. Las reglas de esta auditoría son explícitas: `P0 NO APROBADO`
si una validación esencial no se puede completar. Marcar otra cosa sería
declarar probado algo que no se ha probado.

Se han encontrado y corregido **tres defectos P0**, uno de ellos bloqueante
absoluto: el juego era **imposible de terminar**.

---

## 2. Comandos ejecutados

Todos desde `/tmp/p0/rickyedit-exe`, extraído del paquete y con `node_modules`
eliminado previamente.

| Comando | Código de salida | Resultado | Observaciones |
| --- | --- | --- | --- |
| `npm ci` | 0 | PASS | 334 paquetes. Sin conflictos de peer dependencies. Dos avisos de deprecación heredados (`eslint@9`, `whatwg-encoding`), sin efecto funcional |
| `npx tsc --version` | 0 | PASS | 5.9.3, resuelto desde `node_modules` local |
| `npx eslint --version` | 0 | PASS | v9.39.5, local |
| `npx vitest --version` | 0 | PASS | 2.1.9, local |
| `npm run typecheck` | 0 | PASS | `src/` y `tests/` |
| `npm run lint` | 0 | PASS | Sin errores ni warnings |
| `npm run test:run` | 0 | PASS | 127 tests en 32 archivos |
| `npm run build` | 0 | PASS | 248 kB JS (77 kB gzip), 14 kB CSS |
| `npm run validate` | 0 | PASS | Encadena los cuatro anteriores |
| `npm run test:coverage` | 0 | PASS | 59,8 % de líneas |

No hizo falta ninguna instalación global. Ninguna herramienta se ejecutó fuera
de las dependencias del proyecto.

### Dependencias

Contraste entre lo importado por el código y lo declarado en `package.json`:

- Importados: `react`, `react-dom`, `zustand`, `howler`, `@testing-library/react`, `vitest`.
- **Todos declarados.** No hay dependencias fantasma (usadas sin declarar).
- No hay dependencias declaradas sin usar: `howler` **sí** se usa
  (`src/systems/audio/audioManager.ts`); la documentación que decía lo
  contrario estaba desactualizada y se corrigió.

---

## 3. Problemas encontrados

### P0-01 — El juego no se podía terminar (BLOQUEANTE)

| | |
| --- | --- |
| **Prioridad** | P0 — bloqueante absoluto |
| **Archivo** | `src/components/protocol/MessageSequence.tsx` |
| **Síntoma** | La partida se congelaba de forma permanente en `SESSION COMPLETE.`, al final de PROTOCOL 05. El SYSTEM REPORT, el final normal y PROTOCOL 00 eran **inalcanzables** |

**Causa.** `MessageSequence` programaba su temporizador en un efecto que solo
dependía de `index`. En PROTOCOL 05, las fases `blackout` y `final` renderizan
las dos un `MessageSequence` como valor de retorno directo del componente. React
ve el mismo tipo en la misma posición del árbol, **reutiliza la instancia** y
conserva su estado: `index` seguía valiendo 0 al pasar de una secuencia a la
otra, el efecto no volvía a ejecutarse, no se programaba ningún temporizador y
la nueva secuencia se quedaba congelada en su primera línea para siempre.

No era un fallo intermitente ni dependiente del entorno: ocurría en el 100 % de
las partidas.

**Corrección.** La secuencia se identifica ahora por el contenido de sus pasos,
no por la referencia del array (que quien llama reconstruye en cada render), y
el índice se reinicia durante el render cuando ese contenido cambia — el patrón
que React documenta para ajustar estado ante un cambio de props. El efecto pasa
a depender también de esa identidad.

**Validación.** `tests/app/playthrough.test.tsx` recorre una partida completa y
llega al informe final. Antes de la corrección, los cinco tests de ese archivo
fallaban con "No se alcanzó el informe final".

---

### P0-02 — El secreto THE LOOP se desbloqueaba solo

| | |
| --- | --- |
| **Prioridad** | P0 — falso positivo en el sistema de secretos |
| **Archivos** | `src/systems/input/keyboardManager.ts`, `src/systems/secrets/secretSystem.ts` |
| **Síntoma** | El secreto se activaba sin que el jugador hiciera el gesto previsto |

**Causa.** El contador de pulsaciones de `ESC` usaba un temporizador que se
**reiniciaba en cada pulsación**. La condición real no era "cinco ESC en dos
segundos" sino "cinco ESC con menos de dos segundos entre una y la siguiente",
sin límite total. Pulsando Escape cada segundo y medio durante una partida
larga —algo que cualquiera hace para cerrar cosas— el secreto acababa saltando
por su cuenta. Contradecía además la pista que ve el jugador.

**Corrección.** Se sustituye el contador con temporizador por las marcas de
tiempo de las últimas pulsaciones; se exige que las cinco quepan dentro de la
ventana completa. La lógica se extrae a `registerEscPress()`, función pura y
testeable, y de paso desaparece un `setTimeout` que nunca se limpiaba.

**Validación.** `tests/secrets/secretSystem.test.ts` (4 casos, incluido el de
seis segundos que antes desbloqueaba) y `tests/secrets/secretUnlock.test.tsx`.

---

### P0-03 — Un guardado corrupto podía dejar la aplicación inutilizable

| | |
| --- | --- |
| **Prioridad** | P0 — arranque |
| **Archivos** | `src/systems/persistence/sanitize.ts` (nuevo), `loadGame.ts`, `saveGame.ts` |
| **Síntoma** | `localStorage` editado a mano, escrito a medias o de una versión anterior entraba en el estado sin validar |

**Causa.** `loadGame()` devolvía el contenido del almacenamiento tal cual.
Comprobado: con `{"secretsFound": "s1s2s3s4"}`, como `.includes("s1")` sobre una
cadena compara subcadenas, **los logros aparecían desbloqueados solos** y el
contador marcaba 4/5 contando letras.

**Corrección.** Saneado campo a campo que repara en vez de descartar: lo válido
se conserva, lo imposible vuelve a su valor por defecto. Se añade `version` al
formato guardado para permitir migraciones futuras.

**Validación.** `tests/systems/corruptSave.test.tsx`, 13 casos.

---

### Defectos de contenido corregidos en la misma revisión

- **LOGIC-03** (`protocol04.data.ts`): la pregunta no se podía responder con lo
  enunciado. Las premisas determinaban qué afirmación es verdadera, pero la
  pregunta era qué interruptor abre la salida y nada las relacionaba. Se añadió
  la premisa que faltaba. Detalle en `docs/LOGIC_AUDIT.md`.
- **LOGIC-01**: `"El objeto no está aquí"` dependía de un "aquí" no enunciado.
  Reescrito como `"El objeto no está en A"`. Misma proposición, sin deixis.

---

## 4. Validación automatizada

| Área | Estado | Evidencia |
| --- | --- | --- |
| TypeScript | PASS | `npm run typecheck`, incluye `tests/` |
| ESLint | PASS | 0 errores, 0 warnings. Reglas de hooks activas |
| Tests | PASS | 127 en 32 archivos |
| Cobertura | 59,8 % líneas | Protocolos, tipos y `systems/game` al 100 %; audio 33 % e input 40 % (Web Audio y listeners, mal representables en jsdom) |
| Build | PASS | `dist/` generado, 8 referencias de `index.html` resueltas |

Sin `@ts-ignore`, sin `@ts-nocheck`, sin `eslint-disable` globales y sin relajar
`tsconfig` en ningún punto de esta auditoría.

### Cobertura funcional añadida

- **Partida completa** (`tests/app/playthrough.test.tsx`): abre el programa,
  escribe el nombre, recorre los cinco protocolos y llega al informe final.
  Comprueba métricas sin `NaN`/`Infinity`/`undefined`, precisión entre 0 y 100,
  final normal, final secreto vía PROTOCOL 00 y que `RESTART SESSION` no hereda
  métricas.
- **Secretos** (`tests/secrets/secretUnlock.test.tsx`, 17 casos): los cinco se
  desbloquean **con la acción real del jugador** (clic, teclas, hover), nunca
  llamando a `unlockSecret`. Incluye los casos negativos: código parecido
  (`0473`), código incompleto, cuatro ESC, ESC demasiado separados, fallar la
  serie de PROTOCOL 03, y teclear `0437` dentro del campo de nombre.

---

## 5. Validación manual

**NO VERIFICADO.** Este entorno no tiene navegador gráfico; la descarga de
Chromium está bloqueada por la política de red. Nada de lo siguiente se ha
ejecutado:

| Área | Prueba | Resultado | Entorno |
| --- | --- | --- | --- |
| Escritorio | Render visual, arrastre con ratón real | NO VERIFICADO | — |
| Móvil | Safari iOS, Chrome Android | NO VERIFICADO | — |
| Touch | Doble toque, arrastre táctil, teclado virtual | NO VERIFICADO | — |
| Audio | Autoplay, mute, ausencia de clipping | NO VERIFICADO | — |
| Resoluciones | 1920×1080, 1366×768, 1024×768, 390×844 | NO VERIFICADO | — |
| Consola en preview | Errores runtime en navegador real | NO VERIFICADO | — |
| Vercel | Despliegue real | NO VERIFICADO | — |

Lo que sí se ha comprobado de forma equivalente: los assets se sirven con código
200 desde el build (`favicon.ico`, `og-image.png`, `site.webmanifest`,
`apple-touch-icon.png`), y un test falla ante un solo `console.error` o
`console.warn` durante la interacción con ventanas.

`docs/QA_CHECKLIST.md` contiene la lista completa para ejecutar esta parte a
mano.

---

## 6. Protocolos

| Protocolo | Estado | Evidencia | Observaciones |
| --- | --- | --- | --- |
| 01 MEMORY | PASS (lógico) | Recorrido en la partida completa | Solución determinista por datos |
| 02 REACTION | PASS (lógico) | Recorrido en la partida completa | `pressedRef` impide registrar dos veces el mismo estímulo |
| 03 PATTERN | PASS (lógico) | Partida completa + test del secreto | La anomalía exige **acertar**; fallar no la dispara |
| 04 LOGIC | PASS | `docs/LOGIC_AUDIT.md` + 7 tests | 10 preguntas auditadas formalmente; 2 corregidas |
| 05 TERMINATION | PASS tras P0-01 | Partida completa | Antes de la corrección no terminaba nunca |

---

## 7. Secretos

| Secreto | Activación | Falso positivo | Persiste | Táctil |
| --- | --- | --- | --- | --- |
| `04/37` | Clic en el código dentro de `README.txt` | No se activa por abrir el archivo ni por pulsar alrededor | Sí | Sí |
| `EL VALOR IMPOSIBLE` | Acertar la serie con anomalía en PROTOCOL 03 | Fallar la serie **no** lo da | Sí | Sí |
| `DON'T LOOK AWAY` | Ratón quieto 8 s sobre el reloj | Apartar el ratón reinicia la cuenta a cero | Sí | **No** (ver riesgos) |
| `THE LOOP` | 5 × ESC dentro de 2 s | Corregido en P0-02 | Sí | **No** (requiere teclado) |
| `0437` | Teclear el código | `0473` y `043` no valen; dentro del campo de nombre tampoco | Sí | Con teclado virtual |

Ninguno se registra dos veces. El contador, `achievements.log` y el informe
final leen todos `secretsFound.length`, así que no pueden discrepar.

---

## 8. Persistencia y recuperación

| Caso | Resultado |
| --- | --- |
| `localStorage` vacío | PASS — arranca con estado inicial |
| Datos válidos | PASS |
| JSON inválido (`{{{`) | PASS — `loadGame()` devuelve `null` |
| Propiedades ausentes | PASS — se reponen por defecto, se conserva lo válido |
| Tipos incorrectos | PASS — cadena por array, número por objeto, booleano por texto |
| Propiedades desconocidas | PASS — se ignoran |
| Valores negativos | PASS — se normalizan a 0 |
| Volúmenes fuera de rango | PASS — recortados a 0..1 |
| Identificadores inventados | PASS — filtrados de secretos y protocolos |
| Nivel de corrupción imposible | PASS — se deriva del progreso real |
| Almacenamiento bloqueado | PASS — `storage.ts` captura y sigue |
| Nueva partida tras una completada | PASS — `RESTART SESSION` no hereda métricas |

---

## 9. Compatibilidad

**Ningún navegador ha sido probado.** No se afirma compatibilidad con nada.

Lo ejecutado es jsdom 24 sobre Node 22, que simula el DOM pero **no** es un
navegador: no valida render, CSS, Web Audio, Pointer Events reales, `100dvh`,
safe areas ni el comportamiento de Safari.

---

## 10. Problemas pendientes

### Bloqueadores P0

Ninguno conocido en el código. El bloqueador que queda es de **proceso**: falta
la validación manual del apartado 5.

### Observaciones no bloqueantes

- **`DON'T LOOK AWAY` no tiene alternativa táctil.** Depende de `mouseenter`
  sostenido, y en táctil no existe hover. En móvil solo se pueden conseguir 4 de
  5 secretos, y con ellos no se puede completar `achievements.log`. No impide
  terminar el juego ni acceder a PROTOCOL 00 (que solo necesita `0437`).
  Decisión pendiente: aceptarlo como exclusivo de escritorio y documentarlo, o
  darle un gesto táctil equivalente (mantener pulsado).
- **PROTOCOL 00 no se registra en `completedProtocols`.** Su `onComplete` llama
  a `removeProgram()` y cierra la ventana, pero no a `completeProtocol("00")`.
  No rompe nada —el informe deriva el final de `secretsFound`— pero deja el
  estado incompleto.
- **LOGIC-05** tiene una premisa redundante y **LOGIC-09** es trivial. Bajan la
  dificultad; no son errores.

### Mejoras P1 registradas y no implementadas

- **El progreso de una partida no se guarda.** `stage` es estado local de
  `RickyEditContent`. Cerrar la ventana obliga a repetir los cinco protocolos
  desde el arranque. Con P0-01 corregido el juego ya se puede terminar, pero hay
  que hacerlo del tirón. Es la mejora de mayor impacto pendiente.
- Temporizadores de cierre en Protocol01/02 (`setTimeout(onComplete, …)`) sin
  limpieza al desmontar.

### No verificado

Todo el apartado 5.

---

## 11. Veredicto

```
P0 NO APROBADO
```

**Por qué, exactamente.** Los tres defectos P0 encontrados están corregidos y
cubiertos por tests de regresión. Las seis validaciones automatizadas terminan
con código 0 desde una instalación limpia. El juego se puede completar de
principio a fin, los cinco secretos se desbloquean con la acción real del
jugador y los dos finales son alcanzables — todo ello demostrado con pruebas
ejecutadas, no por lectura del código.

Lo que falta es la mitad que una máquina sin navegador no puede cubrir: ver el
juego pintado, tocarlo con el dedo, oírlo y desplegarlo. La auditoría exige
haber probado los cinco protocolos, los cinco secretos y los dos finales **en un
navegador real** antes de aprobar. Eso no se ha hecho.

Para pasar a `P0 APROBADO CON OBSERVACIONES` basta con recorrer
`docs/QA_CHECKLIST.md` en un equipo y en un móvil, y anotar el resultado.
