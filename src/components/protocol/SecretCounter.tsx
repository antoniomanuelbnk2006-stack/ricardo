interface SecretCounterProps {
  found: number;
  flash: boolean;
}

export function SecretCounter({ found, flash }: SecretCounterProps) {
  return (
    <div
      style={{
        textAlign: "right",
        fontSize: 11,
        color: "#555",
        marginTop: 8,
        opacity: flash ? 1 : 0.6,
        transition: "opacity 0.3s",
      }}
    >
      SECRETS FOUND: {found}/5
    </div>
  );
}
