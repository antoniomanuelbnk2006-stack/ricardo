import {
  TV_FRAME_W,
  TV_FRAME_H,
  TV_BEZEL_LEFT,
  TV_BEZEL_TOP,
  CANVAS_W,
  CANVAS_H,
} from "../../app/constants";

interface TvFrameProps {
  children: React.ReactNode;
}

/**
 * Televisor de madera de los anos 80 alrededor del escritorio.
 *
 * Esta dibujado enteramente con CSS (degradados, sombras y un par de
 * pseudo-elementos), sin ninguna imagen: pesa cero, se ve nitido a cualquier
 * escala y no depende de ninguna fotografia con derechos.
 *
 * El hueco de la pantalla mide 1024x768 exactos y el contenido va dentro sin
 * transformaciones propias, asi que las coordenadas del puntero siguen
 * cuadrando con lo que se ve: arrastrar ventanas, pulsar iconos y el resto de
 * la interaccion funcionan igual que sin marco.
 */
export function TvFrame({ children }: TvFrameProps) {
  return (
    <div className="tv-shell" style={{ width: TV_FRAME_W, height: TV_FRAME_H }} aria-hidden={false}>
      {/* Carcasa de madera */}
      <div className="tv-wood" />
      {/* Frontal metalico cepillado */}
      <div className="tv-face" />

      {/* Columna derecha: mandos y altavoz */}
      <div className="tv-controls">
        <div className="tv-brand">
          <span className="tv-brand-text">RICKY-VISION</span>
        </div>
        <div className="tv-switch-row">
          <span className="tv-switch" />
          <span className="tv-switch" />
          <span className="tv-mini-knob" />
        </div>
        <div className="tv-dial tv-dial-top">
          <span className="tv-dial-face" />
          <span className="tv-dial-pointer" />
        </div>
        <div className="tv-dial">
          <span className="tv-dial-face" />
          <span className="tv-dial-pointer tv-dial-pointer-alt" />
        </div>
        <div className="tv-speaker" />
      </div>

      {/* Hueco de la pantalla: aqui vive el escritorio, sin escalar aparte */}
      <div
        className="tv-screen"
        style={{ left: TV_BEZEL_LEFT, top: TV_BEZEL_TOP, width: CANVAS_W, height: CANVAS_H }}
      >
        {children}
        {/* Curvatura y reflejo del cristal. No intercepta clics. */}
        <div className="tv-glass" aria-hidden="true" />
      </div>

      {/* Peana inferior */}
      <div className="tv-foot" />
    </div>
  );
}
