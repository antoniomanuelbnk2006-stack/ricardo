# CHECKLIST DE QA — RICKYEDIT.EXE

Lo que los tests automáticos **no** pueden comprobar. La suite valida lógica,
estado y estructura del DOM; nada de eso demuestra que el juego se vea bien,
se oiga bien o se pueda jugar con el dedo.

Rellenar antes de cada publicación. Marcar `[x]` solo lo comprobado de
verdad; una casilla marcada "porque debería funcionar" es peor que una sin
marcar.

**Última revisión:** _(sin rellenar)_
**Versión / commit:** _(sin rellenar)_
**Revisado por:** _(sin rellenar)_

---

## 0. Automático (debe estar en verde antes de empezar)

```bash
npm ci
npm run validate     # typecheck + lint + tests + build
npm run test:coverage
```

- [ ] `npm ci` sin errores de dependencias
- [ ] `npm run validate` termina correctamente
- [ ] El número de tests del README coincide con la ejecución real
- [ ] `npm run preview` sirve el build sin 404 en la consola de red

---

## 1. Navegadores y resoluciones

| Navegador | Versión | Resolución | OK | Notas |
| --- | --- | --- | --- | --- |
| Chrome | | 1920×1080 | [ ] | |
| Chrome | | 1366×768 | [ ] | |
| Firefox | | | [ ] | |
| Edge | | | [ ] | |
| Safari (macOS) | | | [ ] | |

- [ ] El monitor 4:3 se centra con bandas negras y **no se deforma**
- [ ] No hay scroll horizontal en ninguna resolución
- [ ] Al redimensionar la ventana, el lienzo reescala sin cortar nada
- [ ] Ventana muy baja (400 px de alto): sigue siendo jugable

---

## 2. Dispositivos táctiles

| Dispositivo | SO / navegador | OK | Notas |
| --- | --- | --- | --- |
| iPhone | Safari | [ ] | |
| iPhone | Chrome | [ ] | |
| Android | Chrome | [ ] | |

- [ ] **Vertical**: aparece el aviso de girar el dispositivo y se puede descartar
- [ ] **Horizontal**: el aviso no aparece y el texto se lee
- [ ] Doble toque en un icono del escritorio lo abre
- [ ] El doble toque **no** provoca zoom del navegador
- [ ] Se puede arrastrar una ventana con el dedo
- [ ] Los botones de la barra de título se pueden pulsar sin fallar
- [ ] El teclado virtual **no tapa** el campo del nombre
- [ ] Al enfocar el campo del nombre, Safari **no** hace zoom
- [ ] Girar el dispositivo a mitad de partida no rompe el estado

---

## 3. Partida A — Jugador normal

- [ ] El escritorio carga y los iconos se ven
- [ ] `RICKYEDIT.EXE` se abre con doble clic
- [ ] La secuencia de arranque se tipea y se puede saltar con clic/tecla
- [ ] Pide el nombre; rechaza vacío y demasiado largo con mensaje claro
- [ ] La bienvenida muestra el nombre introducido
- [ ] PROTOCOL 01 se completa
- [ ] PROTOCOL 02 se completa
- [ ] PROTOCOL 03 se completa
- [ ] PROTOCOL 04 se completa
- [ ] PROTOCOL 05 se completa
- [ ] Responder mal a propósito da feedback correcto y **deja continuar**
- [ ] El SYSTEM REPORT muestra el nombre y métricas coherentes
- [ ] El tiempo total del informe se parece al tiempo real de la partida
- [ ] Final normal: la ventana se cierra y vuelve al escritorio

---

## 4. Partida B — Cazador de secretos

- [ ] `achievements.log` muestra 0/5 al empezar, con las cinco pistas
- [ ] **04/37** — clic en el código dentro de `README.txt`
- [ ] **EL VALOR IMPOSIBLE** — acertar la serie con anomalía en PROTOCOL 03
- [ ] **DON'T LOOK AWAY** — ratón quieto 8 s sobre el reloj
- [ ] **THE LOOP** — ESC cinco veces en menos de 2 s
- [ ] **0437** — teclear el código
- [ ] Cada secreto muestra su aviso con el **nombre** y el conteo correcto
- [ ] El conteo sube de uno en uno, sea cual sea el orden
- [ ] Ningún secreto se puede contar dos veces
- [ ] El tick aparece en vivo si `achievements.log` está abierto
- [ ] `SECRETS FOUND: X/5` coincide con `achievements.log` y con el informe
- [ ] PROTOCOL 00 arranca al pulsar Continuar en el informe
- [ ] Tras PROTOCOL 00, el icono de `RICKYEDIT.EXE` desaparece del escritorio

---

## 5. Partida C — Errores, abandono y persistencia

- [ ] Recargar la página conserva secretos y ajustes
- [ ] Cerrar la ventana a media partida y reabrirla no rompe nada
- [ ] Cerrar la pestaña durante un protocolo y volver no deja el estado corrupto
- [ ] Doble clic rápido en una respuesta **no** la cuenta dos veces
- [ ] `RESTART SESSION` reinicia protocolos y **conserva** los secretos
- [ ] `RESET GAME DATA` pide confirmación de dos pasos y borra todo
- [ ] Tras `RESET GAME DATA`, el icono de `RICKYEDIT.EXE` vuelve
- [ ] Corromper `localStorage` a mano (`rickyedit-save-v1` = `"{{{"`) y recargar:
      la web arranca igual, sin pantalla en blanco
- [ ] Modo incógnito / almacenamiento bloqueado: el juego sigue siendo jugable

> **Conocido:** el progreso *dentro* de una partida no se guarda. Al reabrir
> `RICKYEDIT.EXE` se empieza por el boot aunque hubiera protocolos hechos.
> Para llegar a PROTOCOL 00 hay que jugar los cinco del tirón.

---

## 6. Ventanas y escritorio

- [ ] Abrir las cuatro ventanas a la vez y superponerlas
- [ ] Al pulsar una ventana, pasa al frente
- [ ] Arrastrar una ventana la mueve **a la misma velocidad que el puntero**
- [ ] Una ventana no se puede perder fuera del escritorio
- [ ] Minimizar y restaurar desde la barra de tareas
- [ ] Maximizar y restaurar (botón y doble clic en la barra de título)
- [ ] Cerrar y reabrir
- [ ] El reloj de la barra de tareas avanza y abre el calendario
- [ ] El menú Inicio abre cada programa y "Apagar el sistema" funciona

---

## 7. Audio

- [ ] No suena nada antes de la primera interacción (política de autoplay)
- [ ] El sonido arranca tras el primer clic
- [ ] En iOS el audio arranca tras tocar la pantalla
- [ ] Silenciar desde Config funciona
- [ ] Desilenciar **recupera** el zumbido ambiente
- [ ] Los cuatro canales de volumen se oyen por separado
- [ ] La preferencia de audio sobrevive a una recarga
- [ ] Ningún efecto revienta el volumen

---

## 8. Accesibilidad

- [ ] Tabulador recorre toda la interfaz en orden razonable
- [ ] El foco **siempre se ve** (anillo amarillo)
- [ ] Enter/Espacio abren un icono del escritorio enfocado
- [ ] Los protocolos se pueden responder solo con teclado
- [ ] `REDUCED MOTION` corta destellos, temblor y separación RGB
- [ ] Con `prefers-reduced-motion` del sistema, las animaciones se atenúan
- [ ] Ningún dato depende **solo** del color
- [ ] Texto legible sobre el fondo del terminal a tamaño normal

---

## 9. Consola y red

- [ ] Partida completa sin un solo `error` en consola
- [ ] Sin warnings de React
- [ ] Sin 404 en la pestaña de red
- [ ] `favicon.ico`, `og-image.png` y `site.webmanifest` cargan
- [ ] La vista previa del enlace en WhatsApp/Twitter muestra la imagen OG

---

## 10. Errores encontrados

| # | Descripción | Dónde | Gravedad | Estado |
| --- | --- | --- | --- | --- |
| | | | | |
