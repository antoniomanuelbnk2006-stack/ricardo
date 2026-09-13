# Assets

## Imagenes

`images/ricky-desktop.webp` — fondo del escritorio. **Es opcional.** El
juego lo detecta solo al arrancar (`src/components/desktop/useWallpaper.ts`):
si el archivo existe se pinta centrado y sin deformar; si no existe, el
escritorio se queda con el teal clasico de Windows y no aparece ningun
icono de imagen rota.

Formato recomendado: WebP, 1024x768 o proporcional, por debajo de 300 KB.

## Lo que todavia no existe

- Iconos como imagenes binarias. Ahora mismo se dibujan en SVG dentro de
  `src/components/desktop/icons.tsx`, lo que pesa menos y escala mejor;
  sustituirlos por `<img>` solo merece la pena si hay arte especifico.
- Cursor personalizado.
- Imagenes de protocolo. La "habitacion" de PROTOCOL 01 se renderiza con
  divs y CSS, no con una imagen.

## Derechos

No metas aqui imagenes de las que no tengas derechos de uso. El proyecto
es de fan y no oficial, y todo lo que se distribuye debe poder
distribuirse.
