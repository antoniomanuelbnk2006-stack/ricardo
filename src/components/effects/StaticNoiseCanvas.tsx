import { useEffect, useRef } from "react";

interface StaticNoiseCanvasProps {
  opacity: number;
  intervalMs?: number;
}

// Estatica real (pixeles aleatorios redibujados), no un patron CSS fijo.
// Se renderiza en baja resolucion interna y se escala con
// image-rendering:pixelated -- efecto "TV sin senal" autentico y barato
// de calcular (redibuja pocas veces por segundo, no cada frame).
export function StaticNoiseCanvas({ opacity, intervalMs = 90 }: StaticNoiseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      ctx = null;
    }
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.createImageData(w, h);

    function draw() {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = Math.random() * 255;
      }
      ctx!.putImageData(imageData, 0, 0);
    }

    draw();
    const id = setInterval(draw, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={120}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        imageRendering: "pixelated",
        mixBlendMode: "overlay",
      }}
    />
  );
}
