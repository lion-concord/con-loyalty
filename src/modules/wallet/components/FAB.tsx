interface Props {
  onClick: () => void;
}

export default function FAB({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 120,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        border: "none",
        boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
        color: "#fff",
        fontSize: 28,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      +
    </button>
  );
}
