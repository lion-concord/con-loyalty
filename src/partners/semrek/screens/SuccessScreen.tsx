import type { OrderResult } from "../types";

interface Props {
  order: OrderResult;
  onClose: () => void;
}

export default function SuccessScreen({ order, onClose }: Props) {
  return (
    <div>
      <div className="sem-h2">✅ Заказ оформлен</div>

      <div className="sem-card" style={{ marginBottom: 16 }}>
        <div className="sem-row">
          <span className="sem-row__label">Номер заказа</span>
          <span className="sem-row__value">{order.id}</span>
        </div>

        <div className="sem-row">
          <span className="sem-row__label">Товар</span>
          <span className="sem-row__value">{order.boatName}</span>
        </div>

        <div className="sem-row">
          <span className="sem-row__label">Способ оплаты</span>
          <span className="sem-row__value">{order.paymentLabel}</span>
        </div>

        <div className="sem-row">
          <span className="sem-row__label">Сумма заказа</span>
          <span className="sem-row__value">
            {order.totalPrice.toLocaleString("ru-RU")} ₽
          </span>
        </div>

        {order.partnerCashbackUsed > 0 && (
          <div className="sem-row">
            <span className="sem-row__label">Списано с виртуальной карты</span>
            <span className="sem-row__value" style={{ color: "#4ade80" }}>
              −{order.partnerCashbackUsed.toLocaleString("ru-RU")} ₽
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
          padding: 14,
          borderRadius: 12,
          background: "rgba(74, 222, 128, 0.1)",
          border: "1px solid rgba(74, 222, 128, 0.3)",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
          ⭐ Начислено {order.konEarned} баллов КОН
        </div>
        <div style={{ fontSize: 14, marginBottom: 4 }}>
          🎁 Начислено {order.partnerCashbackEarned.toLocaleString("ru-RU")} ₽ кешбэка
          на виртуальную карту «Семь рек»
        </div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Баллы и кешбэк появятся после подтверждения покупки.
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
          Менеджер «Семь рек» свяжется с вами в течение <b>1 часа</b> для
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
