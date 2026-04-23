import { useState } from "react";
import type { PaymentMethod } from "../types";

interface Props {
  totalPrice: number;
  konBalance: number;
  konDiscount: number; // сколько ₽ можно списать максимум
  onPay: (method: PaymentMethod, useKon: number) => void;
  onBack?: () => void;
}

const METHODS: { id: PaymentMethod; label: string; note?: string }[] = [
  { id: "card", label: "💳 Банковская карта", note: "Visa / MasterCard / МИР" },
  { id: "sbp", label: "⚡ СБП", note: "Перевод по QR" },
  { id: "installment", label: "📅 Рассрочка 0-0-12", note: "без процентов" },
  { id: "invoice", label: "🧾 Счёт для юр. лиц" },
];

export default function PaymentScreen({
  totalPrice,
  konBalance,
  konDiscount,
  onPay,
  onBack,
}: Props) {
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [useKon, setUseKon] = useState(0);

  const maxKon = Math.min(konBalance, konDiscount);
  const finalPrice = Math.max(0, totalPrice - useKon);
  const cashback = Math.round(finalPrice * 0.03);

  return (
    <div>
      <div className="sem-h2">💳 Оплата</div>

      <div className="sem-card" style={{ marginBottom: 16 }}>
        <div className="sem-row">
          <span className="sem-row__label">Сумма заказа</span>
          <span className="sem-row__value">
            {totalPrice.toLocaleString("ru-RU")} ₽
          </span>
        </div>
        {useKon > 0 && (
          <div className="sem-row">
            <span className="sem-row__label">Скидка баллами КОН</span>
            <span className="sem-row__value" style={{ color: "#4ade80" }}>
              −{useKon.toLocaleString("ru-RU")} ₽
            </span>
          </div>
        )}
        <div className="sem-row sem-row--total">
          <span className="sem-row__label">К оплате</span>
          <span className="sem-row__value">
            {finalPrice.toLocaleString("ru-RU")} ₽
          </span>
        </div>
      </div>

      {konBalance > 0 && (
        <div className="sem-card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
            ⭐ Баллы КОН
          </div>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 12 }}>
            Доступно: <b>{konBalance.toLocaleString("ru-RU")}</b> баллов ·
            Можно списать до <b>{konDiscount.toLocaleString("ru-RU")} ₽</b>
          </div>
          <input
            type="range"
            min={0}
            max={maxKon}
            step={100}
            value={useKon}
            onChange={(e) => setUseKon(Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span>0</span>
            <b>{useKon.toLocaleString("ru-RU")} баллов</b>
            <span>{maxKon.toLocaleString("ru-RU")}</span>
          </div>
        </div>
      )}

      <div style={{ fontSize: 15, fontWeight: 700, margin: "8px 0 8px" }}>
        Способ оплаты
      </div>
      {METHODS.map((m) => (
        <div
          key={m.id}
          className={"sem-check " + (method === m.id ? "sem-check--active" : "")}
          onClick={() => setMethod(m.id)}
        >
          <div className="sem-check__box">{method === m.id ? "✓" : ""}</div>
          <div className="sem-check__label">
            {m.label}
            {m.note && (
              <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>
                {m.note}
              </div>
            )}
          </div>
        </div>
      ))}
<div
        style={{
          marginTop: 16,
          padding: 12,
          borderRadius: 12,
          background: "rgba(74, 222, 128, 0.1)",
          border: "1px solid rgba(74, 222, 128, 0.3)",
          fontSize: 13,
        }}
      >
        🎁 Кешбэк <b>3%</b> = <b>{cashback.toLocaleString("ru-RU")}</b> баллов КОН
        после покупки
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        {onBack && (
          <button className="sem-btn sem-btn--ghost" onClick={onBack}>
            ← Назад
          </button>
        )}
        <button className="sem-btn" onClick={() => onPay(method, useKon)}>
          Оплатить {finalPrice.toLocaleString("ru-RU")} ₽
        </button>
      </div>
    </div>
  );
}
