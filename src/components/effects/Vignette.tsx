export function Vignette() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        boxShadow: "inset 0 0 90px 20px rgba(0,0,0,0.55)",
      }}
    />
  );
}
