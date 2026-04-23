import PartnerTile from "./PartnerTile";
import { partners } from "../../partners";

interface Props {
  onOpen: (partnerId: string) => void;
}

export default function PartnersSection({ onOpen }: Props) {
  const enabled = partners.filter((p) => p.enabled);
  if (enabled.length === 0) return null;

  return (
    <section style={{ marginTop: 24 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 1.5,
          color: "rgba(255,255,255,0.55)",
          textTransform: "uppercase",
          margin: "0 0 12px 4px",
        }}
      >
        Наши партнёры
      </h2>

      <div style={{ display: "grid", gap: 16 }}>
        {enabled.map((p) => (
          <PartnerTile
            key={p.id}
            title={p.title}
            subtitle={p.subtitle}
            badge={p.badge}
            footnote={p.footnote}
            onOpen={() => onOpen(p.id)}
          />
        ))}
      </div>
    </section>
  );
}
