// Resolucion logica del "monitor". Toda la interfaz se disena a este
// tamano y despues se escala entera, de forma que la proporcion 4:3
// nunca se deforma (biblia, seccion 3 "Direccion visual").
export const CANVAS_W = 1024;
export const CANVAS_H = 768;

// Margen negro alrededor del monitor. En pantallas grandes deja respirar
// el marco; en moviles se reduce para no desperdiciar pixeles, que es
// justo donde mas falta hacen.
export const CANVAS_PADDING = 32;
export const CANVAS_PADDING_COMPACT = 8;
export const COMPACT_VIEWPORT_PX = 820;

// Alto de la barra de tareas en pixeles de lienzo. Lo consumen la propia
// barra, el maximizado de ventanas y el limite de arrastre, para que no
// haya tres numeros distintos que se desincronicen.
export const TASKBAR_H = 28;

// Cuanta ventana debe quedar siempre visible al arrastrarla, para que no
// se pueda perder fuera del escritorio.
export const WINDOW_DRAG_MARGIN = 60;

// --- Marco de televisor ---
// El escritorio se dibuja dentro de un televisor de madera de los anos 80.
// El hueco de la pantalla sigue midiendo 1024x768 exactos: el marco solo
// anade borde alrededor, no deforma ni recorta nada. Todas las medidas van
// en pixeles de lienzo, asi que escalan junto al resto.
export const TV_BEZEL_LEFT = 72;
export const TV_BEZEL_TOP = 64;
export const TV_BEZEL_BOTTOM = 88;
// El lado derecho es mas ancho: ahi van los mandos y la rejilla del altavoz.
export const TV_BEZEL_RIGHT = 232;

export const TV_FRAME_W = TV_BEZEL_LEFT + CANVAS_W + TV_BEZEL_RIGHT;
export const TV_FRAME_H = TV_BEZEL_TOP + CANVAS_H + TV_BEZEL_BOTTOM;
