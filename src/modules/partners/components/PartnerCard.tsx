import Button from "../../../shared/ui/Button";
import type { Partner } from "../../../shared/types/models";

interface Props {
  partner: Partner;
  onOpen?: (partner: Partner) => void;
}

export default function PartnerCard({ partner, onOpen }: Props) {
  return (
    <div
      className="lk-card"
      style={{
        background: partner.bgColor || "#fff",
        borderColor: partner.accentColor || "#dbe3f0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h3 style={{ margin: 0 }}>{partner.title}</h3>
          <p className="lk-muted" style={{ marginTop: 8 }}>
            {partner.subtitle}
          </p>
          {partner.category && (
            <div className="lk-muted" style={{ fontSize: 14 }}>
              Категория: {partner.category}
            </div>
          )}
        </div>

        {partner.badge && (
          <div
            style={{
              height: "fit-content",
              padding: "6px 10px",
              borderRadius: 999,
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.08)",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {partner.badge}
          </div>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <Button variant="secondary" onClick={() => onOpen?.(partner)}>
          {partner.hasModule ? "Открыть модуль" : "Подробнее"}
        </Button>
      </div>
    </div>
  );
}
