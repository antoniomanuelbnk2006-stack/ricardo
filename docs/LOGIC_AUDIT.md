# AUDITORÍA LÓGICA — PROTOCOL 04

Análisis formal de las diez pruebas de `src/protocols/protocol04/protocol04.data.ts`.
Para cada una: premisas, conclusión, si la respuesta configurada es la única
válida, y por qué las demás opciones no lo son.

**Criterio de aceptación:** una pregunta solo es válida si las premisas
enunciadas determinan la respuesta **sin premisas implícitas**. Si hace
falta suponer algo que no está escrito, la pregunta está mal planteada
aunque su respuesta "se entienda".

Resultado: **8 correctas, 1 corregida por enunciado incompleto, 1 corregida
por ambigüedad de referencia.**

---

## LOGIC-01 — Las tres cajas

### Premisas
- `a ⟺ ¬EnA` — A: "El objeto no está en A."
- `b ⟺ EnA` — B: "El objeto está en A."
- `c ⟺ ¬b` — C: "B está mintiendo."
- Exactamente una de `a, b, c` es verdadera.

### Conclusión
El objeto está en A.

### Resultado
Necesariamente verdadera. Solución única.

### Justificación
`a` y `c` afirman lo mismo (`¬EnA`), así que siempre comparten valor de
verdad. Si `EnA` es falso, `a` y `c` son ambas verdaderas: dos verdaderas,
contradice la premisa. Si `EnA` es verdadero, `a` y `c` son falsas y `b` es
la única verdadera: exactamente una. Única solución consistente.

| Ubicación | a | b | c | Verdaderas |
| --- | --- | --- | --- | --- |
| **A** | F | V | F | **1 ✓** |
| B | V | F | V | 2 ✗ |
| C | V | F | V | 2 ✗ |

### Respuestas incorrectas
- **B** y **C**: producen dos afirmaciones verdaderas, violando el enunciado.

### Corrección aplicada
El texto original era `A: "El objeto no está aquí."`. El "aquí" es deíctico:
depende de que el jugador entienda que la etiqueta A está pegada a la caja
A, algo que no se enuncia. Reescrito como `"El objeto no está en A."`, que
es la misma proposición sin depender del contexto. La lógica no cambia.

---

## LOGIC-02 — Silogismo

### Premisas
- `∀x (X(x) → Y(x))`
- `∃x (Y(x) ∧ Z(x))`

### Conclusión
`∃x (X(x) ∧ Z(x))`

### Resultado
**Indeterminada.** Respuesta: `CANNOT DETERMINE`.

### Justificación
Los `Y` que son `Z` pueden ser exactamente los que no son `X`. Contramodelo:
X = {1}, Y = {1, 2}, Z = {2}. Cumple ambas premisas y ningún X es Z. Modelo
opuesto: X = {1}, Y = {1}, Z = {1}. Cumple las premisas y algún X sí es Z.
Al existir modelos de ambos signos, la conclusión no se sigue ni se refuta.

### Respuestas incorrectas
- **YES**: falacia del medio no distribuido; el contramodelo la refuta.
- **NO**: afirmar que *ningún* X es Z también excede lo que dicen las premisas.

---

## LOGIC-03 — Los tres interruptores

### Premisas
- `a ⟺ ¬c` — A: "C es falso."
- `b ⟺ a` — B: "A es verdadero."
- `c ⟺ ¬b` — C: "B es falso."
- Exactamente una de `a, b, c` es verdadera.
- **La salida la activa el interruptor que dice la verdad.**

### Conclusión
C activa la salida.

### Resultado
Necesariamente verdadera. Solución única.

### Justificación
De `a ⟺ ¬c` y `c ⟺ ¬b` se obtiene `a ⟺ b`, coherente con `b ⟺ a`. Quedan dos
asignaciones consistentes con las autorreferencias:

| a | b | c | Coherente | Verdaderas |
| --- | --- | --- | --- | --- |
| V | V | F | sí | 2 ✗ |
| **F** | **F** | **V** | **sí** | **1 ✓** |

Solo la segunda cumple "exactamente una verdadera". C es la afirmación
verdadera y, por la quinta premisa, el interruptor que abre la salida.

### Respuestas incorrectas
- **A** y **B**: en la única asignación válida son falsas.

### Corrección aplicada
**Esta era la pregunta rota.** Las cuatro premisas originales determinaban
*qué afirmación es verdadera*, pero la pregunta era *qué interruptor activa
la salida*, y en ningún sitio se decía que fueran lo mismo. Un jugador
riguroso podía deducir correctamente que C es la única verdadera y aun así
no tener base para elegir interruptor: nada impedía que el interruptor
bueno fuera el mentiroso.

Se ha añadido la premisa que faltaba como línea visible del enunciado. La
deducción y la respuesta no cambian; lo que cambia es que ahora la pregunta
se puede responder con lo que está escrito.

---

## LOGIC-04 — Orden

### Premisas
- `A < B`
- `D < C`
- `B < D`

### Conclusión
Orden `A, B, D, C`.

### Resultado
Necesariamente verdadera. Orden total único.

### Justificación
`A < B` y `B < D` dan `A < B < D`. `D < C` extiende la cadena a
`A < B < D < C`, que fija los cuatro elementos sin grados de libertad.

### Respuestas incorrectas
- `A, D, B, C`: viola `B < D`.
- `D, A, B, C`: viola `B < D` (y `A < B` queda tras D).
- `A, B, C, D`: viola `D < C`.

---

## LOGIC-05 — Comparación

### Premisas
- `A > B`
- `C < A`
- `B > C`

### Conclusión
A es el mayor.

### Resultado
Necesariamente verdadera.

### Justificación
`A > B` y `B > C` bastan: por transitividad `A > B > C`. La segunda premisa
(`C < A`) es redundante, se deduce de las otras dos.

### Respuestas incorrectas
- **B**: contradice `A > B`.
- **C**: contradice `B > C`.

### Nota
La redundancia de la premisa 2 no rompe nada, pero baja la dificultad: si
alguna vez se quiere endurecer, sustituirla por una premisa independiente.

---

## LOGIC-06 — Ciclo

### Premisas
- `A > B`, `B > C`, `C > A`

### Conclusión
¿Pueden ser las tres verdaderas a la vez? **NO**.

### Resultado
Necesariamente falsa la conjunción.

### Justificación
`>` es transitiva y estricta sobre un orden. De `A > B` y `B > C` se sigue
`A > C`, que contradice `C > A` por antisimetría. El conjunto es
insatisfacible.

### Respuestas incorrectas
- **SÍ**: exigiría una relación no transitiva o no estricta, que no es lo que
  denota `>`.

---

## LOGIC-07 — AND

### Premisas
`TRUE`, `TRUE`, `FALSE`.

### Conclusión
`TRUE ∧ TRUE ∧ FALSE = FALSE`.

### Resultado
Necesariamente verdadera.

### Justificación
La conjunción es verdadera solo si todos los operandos lo son. Un `FALSE`
basta para anularla.

### Respuestas incorrectas
- **TRUE**: solo si se confundiera `AND` con `OR`.

---

## LOGIC-08 — XOR encadenado

### Premisas
- `A ⊕ B = V`
- `B ⊕ C = V`
- `A = V`

### Conclusión
`C = TRUE`.

### Resultado
Necesariamente verdadera. Valor único.

### Justificación
`A ⊕ B = V` con `A = V` fuerza `B = F` (XOR es verdadero solo con operandos
distintos). `B ⊕ C = V` con `B = F` fuerza `C = V`.

### Respuestas incorrectas
- **FALSE**: daría `B ⊕ C = F ⊕ F = F`, contradiciendo la segunda premisa.

---

## LOGIC-09 — Lo imposible

### Conclusión
"Un número par que sea primo y mayor que 2" es imposible.

### Resultado
Necesariamente verdadera. Única opción imposible.

### Justificación
Todo par mayor que 2 es divisible por 2 y por sí mismo *y además* por 2 con
cociente distinto de 1, luego tiene un divisor propio y no es primo. 2 es el
único primo par, y queda excluido por el "mayor que 2".

### Respuestas incorrectas (todas posibles)
- Triángulo con tres ángulos agudos: el equilátero (60°/60°/60°).
- Cuadrado con cuatro lados iguales: es la definición de cuadrado.
- Semana con siete días: es la definición de semana.

### Nota
Las tres incorrectas son *trivialmente* posibles, así que la pregunta es de
las más fáciles del protocolo. Funciona como respiro antes del cierre, pero
no aporta dificultad.

---

## LOGIC-10 — Negación

### Premisas
- Se sabe que una afirmación `p` es falsa.

### Conclusión
`¬p` es verdadera.

### Resultado
Necesariamente verdadera (lógica clásica bivalente).

### Justificación
Por bivalencia, toda proposición es verdadera o falsa; si `p` es falsa, `¬p`
es verdadera. Es la definición de la negación en la tabla de verdad.

### Respuestas incorrectas
- "Todas las demás afirmaciones son verdaderas": no se sigue; la falsedad de
  `p` no dice nada del resto.
- "El sistema está roto": no es una conclusión lógica.
- "Nada": incorrecta, ya que `¬p` sí se deduce.

---

## Resumen

| ID | Estado | Observación |
| --- | --- | --- |
| LOGIC-01 | Corregida | Deixis ("aquí") sustituida por referencia explícita |
| LOGIC-02 | Correcta | — |
| LOGIC-03 | **Corregida** | Faltaba la premisa que une "decir la verdad" con "activar la salida" |
| LOGIC-04 | Correcta | — |
| LOGIC-05 | Correcta | Premisa 2 redundante |
| LOGIC-06 | Correcta | — |
| LOGIC-07 | Correcta | — |
| LOGIC-08 | Correcta | — |
| LOGIC-09 | Correcta | Dificultad baja |
| LOGIC-10 | Correcta | — |

Las tablas de verdad de LOGIC-01, LOGIC-03 y LOGIC-08 están fijadas en
`tests/protocols/protocol04.test.ts`, de modo que cualquier cambio futuro en
las respuestas hace fallar la suite.
