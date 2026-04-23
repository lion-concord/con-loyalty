import type { OrderResult } from "../types";

interface Props {
  order: OrderResult;
  onClose: () => void;
}

export default function SuccessScreen({ order, onClose }: Props) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
      <div className="sem-h2" style={{ textAlign: "center" }}>
        Заказ оформлен!
      </div>
      <div style={{ fontSize: 14, opacity: 0.75, marginBottom: 20 }}>
        Номер заказа: <b>#{order.id}</b>
      </div>

      <div className="sem-card" style={{ textAlign: "left" }}>
        <div className="sem-row">
          <span className="sem-row__label">Модель</span>
          <span className="sem-row__value">{order.boatName}</span>
        </div>
        <div className="sem-row">
          <span className="sem-row__label">Доставка</span>
          <span className="sem-row__value">{order.delivery.region}</span>
        </div>
        <div className="sem-row">
          <span className="sem-row__label">Способ оплаты</span>
          <span className="sem-row__value">{order.paymentLabel}</span>
        </div>
        {order.konUsed > 0 && (
          <div className="sem-row">
            <span className="sem-row__label">Списано баллов</span>
            <span className="sem-row__value" style={{ color: "#4ade80" }}>
              −{order.konUsed.toLocaleString("ru-RU")}
            </span>
          </div>
        )}
        <div className="sem-row sem-row--total">
          <span className="sem-row__label">Оплачено</span>
          <span className="sem-row__value">
            {order.finalPrice.toLocaleString("ru-RU")} ₽
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 12,
          background: "rgba(74, 222, 128, 0.12)",
          border: "1px solid rgba(74, 222, 128, 0.35)",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
          🎁 Начислено {order.cashback.toLocaleString("ru-RU")} баллов КОН
        </div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Баллы появятся на счёте в течение 24 часов
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 12,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          fontSize: 13,
          textAlign: "left",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 6 }}>📞 Что дальше?</div>
        <div style={{ opacity: 0.8, lineHeight: 1.5 }}>
          Менеджер «Семирек» свяжется с вами в течение <b>1 часа</b> для
          подтверждения заказа и уточнения деталей доставки.
        </div>
      </div>

      <button
        className="sem-btn"
        style={{ marginTop: 20, width: "100%" }}
        onClick={onClose}
      >
        Вернуться в каталог
      </button>
    </div>
  );
}
