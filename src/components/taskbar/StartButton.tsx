interface StartButtonProps {
  active: boolean;
  onClick: () => void;
}

export function StartButton({ active, onClick }: StartButtonProps) {
  return (
    <button
      type="button"
      className={active ? "start-btn is-active" : "start-btn"}
      aria-expanded={active}
      aria-haspopup="menu"
      onClick={onClick}
    >
      <span className="start-logo" aria-hidden="true" />
      START
    </button>
  );
}
