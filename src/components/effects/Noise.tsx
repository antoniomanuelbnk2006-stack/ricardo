export function Noise({ opacity = 0.05 }: { opacity?: number }) {
  return <div className="static-noise" style={{ position: "absolute", inset: 0, opacity }} />;
}
