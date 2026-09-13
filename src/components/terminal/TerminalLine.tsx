interface TerminalLineProps {
  text: string;
}

export function TerminalLine({ text }: TerminalLineProps) {
  return <div>{text || "\u00A0"}</div>;
}
