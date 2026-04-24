interface Props {
  children: string;
}

export default function OfferBadge({ children }: Props) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: 999,
        background: "#e8f0ff",
        color: "#2563eb",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}
