interface Props {
  level: string;
}

export default function LevelBadge({ level }: Props) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: 999,
        background: "#e8f0ff",
        color: "#2563eb",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      Уровень: {level}
    </span>
  );
}
