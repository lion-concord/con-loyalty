import { useState } from "react";
import { REGIONS } from "../data/boats";
import type { DeliveryInfo } from "../types";

interface Props {
  onContinue: (info: DeliveryInfo) => void;
  backLabel?: string;
  onBack?: () => void;
}

type Method = "pickup" | "courier" | "transport";

const METHOD_LABELS: Record<Method, string> = {
  pickup: "🏬 Самовывоз со склада",
  courier: "🚚 Курьер до двери",
  transport: "🚛 Транспортная компания",
};

export default function DeliveryScreen({ onContinue, backLabel, onBack }: Props) {
  const [regionId, setRegionId] = useState<string | null>(null);
  const [method, setMethod] = useState<Method>("courier");
  const [address, setAddress] = useState("");

  const region = REGIONS.find((r) => r.id === regionId);
  const cost = region ? region[method] : 0;

  const canContinue = regionId !== null && (method === "pickup" || address.trim().length > 3);

  const handleContinue = () => {
    if (!region) return;
    onContinue({
      region: region.label,
      method,
      address: method === "pickup" ? undefined : address.trim(),
      cost,
    });
  };

  return (
    <div>
      <div className="sem-h2">📦 Доставка</div>

      <div style={{ fontSize: 15, fontWeight: 700, margin: "12px 0 8px" }}>
        Регион доставки
      </div>
      <div>
        {REGIONS.map((r) => (
          <button
            key={r.id}
            className={"sem-chip " + (regionId === r.id ? "sem-chip--active" : "")}
            onClick={() => setRegionId(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, margin: "20px 0 8px" }}>
        Способ доставки
      </div>
      {(Object.keys(METHOD_LABELS) as Method[]).map((m) => (
        <div
          key={m}
          className={"sem-check " + (method === m ? "sem-check--active" : "")}
          onClick={() => setMethod(m)}
        >
          <div className="sem-check__box">{method === m ? "✓" : ""}</div>
          <div className="sem-check__label">{METHOD_LABELS[m]}</div>
          <div className="sem-check__price">
            {region
              ? region[m] === 0
                ? "Бесплатно"
                : region[m].toLocaleString("ru-RU") + " ₽"
              : "—"}
          </div>
        </div>
      ))}

      {method !== "pickup" && (
        <>
          <div style={{ fontSize: 15, fontWeight: 700, margin: "20px 0 8px" }}>
            Адрес доставки
          </div>
          <input
            className="sem-input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Город, улица, дом, квартира"
          />
        </>
      )}

      {region && (
        <div className="sem-card" style={{ marginTop: 20 }}>
          <div className="sem-row">
            <span className="sem-row__label">Регион</span>
            <span className="sem-row__value">{region.label}</span>
          </div>
          <div className="sem-row">
            <span className="sem-row__label">Способ</span>
            <span className="sem-row__value">{METHOD_LABELS[method]}</span>
          </div>
          <div className="sem-row sem-row--total">
            <span className="sem-row__label">Стоимость доставки</span>
            <span className="sem-row__value">
              {cost === 0 ? "Бесплатно" : cost.toLocaleString("ru-RU") + " ₽"}
            </span>
          </div>
        </div>
      )}
<div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        {onBack && (
          <button className="sem-btn sem-btn--ghost" onClick={onBack}>
            ← {backLabel || "Назад"}
          </button>
        )}
        <button className="sem-btn" onClick={handleContinue} disabled={!canContinue}>
          К оплате →
        </button>
      </div>
    </div>
  );
}
