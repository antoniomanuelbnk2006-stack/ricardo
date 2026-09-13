# AUDITORÍA E IMPLEMENTACIÓN — RICKYEDIT.EXE

Informe correspondiente a las fases 1–5 del proceso definido en el
documento maestro. Estado del proyecto al recibirlo y trabajo realizado
sobre él.

---

## 1. Estado de partida

| Comprobación | Antes | Ahora |
| --- | --- | --- |
| `npm run build` | ✅ | ✅ |
| `npm test` | ✅ 40 tests (21 archivos) | ✅ 65 tests (26 archivos) |
| `npm run lint` | ❌ 7 errores | ✅ limpio |
| `npm run typecheck` | no existía | ✅ (incluye `tests/`) |

**Stack:** React 18 + TypeScript estricto + Vite 5 + Zustand + Howler.
Sin backend, sin router, sin variables de entorno. Coincide con lo que
pide la biblia (secciones 14 y 24), así que no se ha tocado.

**Arquitectura:** ya era buena. Datos separados de la presentación
(`*.data.ts`), lógica separada de los componentes (`*.logic.ts`), estado
centralizado en tres stores, sistemas aislados en `src/systems/`. No se
ha reorganizado nada: la biblia dice explícitamente "no se debe
reorganizar todo sin necesidad".

---

## 2. Problemas encontrados

### Críticos

**C1 — El arrastre de ventanas ignoraba la escala del lienzo.**
El monitor 1024×768 se pinta a tamaño lógico y se escala entero con
`transform: scale()`, pero el arrastre usaba los deltas de `clientX`
directamente. En cualquier ventana de navegador que no midiera
exactamente 1056×800 —es decir, casi siempre— la ventana se movía a
distinta velocidad que el puntero. Con el navegador a media altura el
error era del doble.
*Solución:* `screenDeltaToCanvas()` divide el delta por la escala, que
ahora se comparte por contexto (`ScaleContext`).
*Archivos:* `app/ScaleContext.tsx`, `app/AppShell.tsx`,
`components/windows/dragGeometry.ts`, `DraggableWindow.tsx`.
*Riesgo:* ninguno; cubierto por `tests/windows/dragGeometry.test.ts`.

**C2 — Se podían perder ventanas fuera del escritorio.**
No había límites de arrastre. Una ventana empujada lo bastante lejos
quedaba inaccesible.
*Solución:* `clampWindowPosition()` deja siempre 60 px agarrables por
cada lado, impide subir por encima del borde superior y esconderse bajo
la barra de tareas.

**C3 — Nada funcionaba con el dedo.**
El arrastre escuchaba solo `mousedown` y los iconos abrían solo con
`dblclick`. En móvil no se podía ni mover una ventana ni abrir el `.exe`,
pese a que la biblia exige iPhone y Android (sección 13).
*Solución:* Pointer Events para el arrastre (`touch-action: none` en la
barra de título) y doble toque replicado a mano en los iconos, porque
`dblclick` en táctil es poco fiable y el navegador lo confunde con zoom.

**C4 — `npm run lint` fallaba.**
Había comentarios `eslint-disable-next-line react-hooks/exhaustive-deps`
repartidos por el código, pero `eslint-plugin-react-hooks` no estaba
instalado: ESLint abortaba con "Definition for rule was not found".
*Solución:* plugin instalado y configurado. De paso, las reglas de hooks
ahora se comprueban de verdad; sobraba una de esas supresiones.

**C5 — Faltaba el sistema de identificación entero.**
Las secciones 4, 5, 9 y 17 de la biblia lo dan por hecho ("Pantalla de
identificación", "El nombre se valida", "Nombre del jugador" entre las
métricas mínimas) y no existía: ni `playerName` en el estado, ni
pantalla, ni validación.
*Solución:* `validatePlayerName()` + componente `NameInput` + campo en el
estado y en la persistencia + bienvenida tipeada con el nombre + fila
`USUARIO` en el SYSTEM REPORT.

**C6 — Bloqueantes de publicación.**
`index.html` enlazaba `/favicon.ico`, que no existía (404 en cada carga).
No había descripción, Open Graph, Twitter Card, manifest ni
`theme-color`. Y el despliegue estaba montado sobre GitHub Pages cuando
la biblia pide Vercel (sección 18).
*Solución:* favicon `.ico` multiresolución + SVG + apple-touch-icon,
imagen OG 1200×630, `site.webmanifest`, metadatos completos y
`vercel.json`. El workflow de Pages se conserva: los dos pueden convivir.

### Altas

**A1 — Accesibilidad.** `outline: none` en los iconos dejaba el foco
invisible; los botones de ventana eran glifos sin etiqueta (`_`, `□`,
`X`); el reloj era un `<div>` con `onClick`, inalcanzable por teclado; y
los iconos no respondían a Enter ni Espacio. Todo ello lo exige la
sección 12.
*Solución:* `a11y.css` con `:focus-visible` de doble anillo (contrasta
tanto sobre el gris de las ventanas como sobre el negro del terminal),
`aria-label` en los controles, reloj convertido en `<button>`, y
Enter/Espacio en los iconos.

**A2 — Estado duplicado y a la deriva.** `currentScreen` y
`currentProtocol` estaban en `GameState` pero no se leían en ninguna
parte. Peor: `systems/game/gameActions.ts` era una copia manual de la
firma del store que ya se había desincronizado —declaraba un `setVolume`
inexistente y le faltaban la mitad de las acciones reales—. La biblia
pide explícitamente evitar estados duplicados (sección 10).
*Solución:* campos muertos eliminados; `GameActions` ahora se **deriva**
del store con un tipo mapeado, así que no puede volver a desincronizarse.

**A3 — Métricas incompletas.** Faltaban cinco de las métricas mínimas de
la sección 9: fecha/hora de inicio, tiempo total, porcentaje de acierto,
reinicios y final obtenido.
*Solución:* cronómetro de sesión (idempotente: volver al escritorio y
reentrar no lo reinicia; se congela al llegar al informe),
`accuracyPercent()`, contador de reinicios que sobrevive al
`RESTART SESSION`, y fila `ENDING`. El tiempo sigue siendo métrica y
nunca barrera.

### Medias

**M1 — Safari iOS.** `height: 100vh` incluye la barra de direcciones y
recortaba el lienzo. El campo de nombre con fuente < 16 px provocaba zoom
automático al enfocarlo, y el teclado virtual lo tapaba.
*Solución:* `100dvh` con fallback, `viewport-fit=cover`, input a 16 px,
`env(safe-area-inset-bottom)` y `-webkit-text-size-adjust: 100%`.

**M2 — Móvil vertical ilegible.** En un teléfono de pie el 4:3 se reduce
a una escala ~0,35 y el texto de 11 px queda en 4 px reales.
*Solución:* margen reducido en viewports estrechos y aviso descartable de
girar el dispositivo, que solo aparece cuando la escala baja de 0,5 —un
móvil en horizontal o una ventana pequeña de escritorio no lo ven.

**M3 — Temblor del glitch mal escalado.** `scale()` se aplicaba antes que
`translate()`, así que el microtemblor se multiplicaba por la escala:
invisible en móvil, exagerado en un 4K.
*Solución:* invertido el orden; el temblor se mide en píxeles de
pantalla.

**M4 — Alto de la barra de tareas triplicado a mano.** 24 px escritos por
separado en el CSS, en el maximizado de ventanas y en dos popups.
*Solución:* una sola constante `TASKBAR_H`.

**M5 — Los tests no se comprobaban con TypeScript.** `tsconfig.app.json`
solo incluye `src`, así que `tests/` nunca pasaba por el compilador. De
hecho `persistence.test.ts` llamaba a `saveGame()` sin el campo
`programRemoved`, obligatorio desde hacía tiempo, y nadie se enteró.
*Solución:* `tsconfig.test.json` + script `npm run typecheck`.

### Bajas

- Estética Windows 95 más fiel: biseles de dos tonos reales en ventanas,
  botones y barra de tareas, en vez de `border: outset`.
- `<noscript>` para quien entre con JavaScript desactivado.
- Cabeceras de seguridad y caché en `vercel.json`.

---

## 3. Lo que NO se ha tocado, y por qué

- **Los nombres de los protocolos.** La biblia los enumera como MEMORY,
  LOGIC, SIGNAL, ADAPTATION y ACCESS, mientras que el proyecto tiene
  MEMORY, REACTION, PATTERN, LOGIC y TERMINATION. No es un error: la
  propia biblia admite modificar la implementación concreta si hay una
  solución mejor, y el diseño actual (PROTOCOL 02 como prueba de control
  de impulsos con el botón rojo) es una decisión tomada a conciencia.
  Renombrarlos habría roto contenido ya escrito y probado.
- **La estructura de carpetas** de la sección 15, que es una sugerencia.
  La actual es equivalente y está más ajustada al proyecto real.
- **Howler.** Sigue instalado y sin usar mientras no haya archivos de
  audio reales; los efectos se sintetizan con Web Audio. Quitarlo o
  usarlo es una decisión que depende de si vas a añadir audio grabado.

---

## 4. Verificación (fase 4)

Comprobado de forma automática:

- Suite completa: 65 tests en 26 archivos, en verde.
- Test de integración que recorre encendido → boot → identificación →
  bienvenida → intro → primer ejercicio de PROTOCOL 01.
- Test que falla si la consola emite **un solo** `error` o `warn` al
  abrir, arrastrar, minimizar y cerrar ventanas.
- Geometría del arrastre a distintas escalas y contra los cuatro bordes.
- Validación del nombre: vacío, solo espacios, acentos, longitud límite,
  intento de inyectar marcado.
- Build de producción y assets servidos con código 200 (`favicon.ico`,
  `og-image.png`, `site.webmanifest`).

**Sin comprobar aquí:** el render visual en un navegador real. El entorno
donde he trabajado no permite descargar Chromium, así que la parte visual
está razonada y escrita con cuidado, pero no la he visto pintada. Antes
de publicar conviene que hagas una pasada manual: `npm run preview` en
PC, y la URL de Vercel en el iPhone, en vertical y en horizontal.

---

## 5. Publicación (fase 5)

Listo para importar en Vercel: framework Vite, build `npm run build`,
salida `dist`, sin variables de entorno. `vercel.json` ya lo declara.

Quedan dos decisiones tuyas:

1. **Dominio.** Hay un `CNAME` con `0437.gg` apuntando a GitHub Pages. Si
   te vas a Vercel, el dominio se configura allí y el `CNAME` deja de
   tener efecto (es inofensivo, queda como archivo estático).
2. **La fotografía de escritorio.** Déjala en
   `public/assets/images/ricky-desktop.webp` y aparece sola.
