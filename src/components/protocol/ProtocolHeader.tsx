interface ProtocolHeaderProps {
  name: string;
}

export function ProtocolHeader({ name }: ProtocolHeaderProps) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888" }}>
        <span>C:\RICKYEDIT</span>
        <span />
      </div>
      <div style={{ textAlign: "center", fontSize: 18, letterSpacing: 2, margin: "8px 0 16px" }}>{name}</div>
    </>
  );
}
