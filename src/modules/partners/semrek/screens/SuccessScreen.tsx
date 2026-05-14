import { useEffect } from "react";
import { usePartnerCard } from "../hooks/usePartnerCard";

interface Props {
  orderData: {
    orderId: string;
    total: number;
    items: Array<{ name: string; qty: number; price: number }>;
  };
  onClose: () => void;
  onAddKon?: (amount: number) => void;
}

export default function SuccessScreen({ orderData, onClose, onAddKon }: Props) {
  const { card, earnCashback } = usePartnerCard("semrek");

  useEffect(() => {
    // Начисляем КОН (3% от суммы)
    const konAmount = Math.round(orderData.total * 0.03);
    if (onAddKon) onAddKon(konAmount);

    // Начисляем кешбэк партнёра (3% в рублях)
    earnCashback(orderData.total, orderData.orderId);
  }, []);

  const cashbackEarned = card ? Math.round(orderData.total * (card.cashbackPercent / 100)) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a1929, #1a2f45)", padding: "20px 16px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", paddingTop: 60 }}>
        {}
        <div style={{
          width: 120,
          height: 120,
          margin: "0 auto 32px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #10b981, #34d399)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          boxShadow: "0 8px 32px rgba(16, 185, 129, 0.4)",
        }}>
          ✓
        </div>

        {}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
            Заказ оформлен!
          </div>
          <div style={{ fontSize: 15, color: "rgba(200,225,255,0.7)", lineHeight: 1.6 }}>
            Номер заказа: <span style={{ color: "#7cc1ff", fontWeight: 600 }}>#{orderData.orderId}</span>
          </div>
        </div>

        {}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 20,
          border: "1px solid rgba(120,170,255,0.15)",
          padding: 24,
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 20 }}>
            🎉 Вам начислено:
          </div>

          {}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            borderBottom: "1px solid rgba(120,170,255,0.1)",
          }}>
            <div>
              <div style={{ fontSize: 14, color: "rgba(200,225,255,0.7)" }}>Баллы КОН</div>
              <div style={{ fontSize: 12, color: "rgba(180,210,245,0.5)", marginTop: 4 }}>
                3% от суммы заказа
              </div>
            </div>
            <div style={{
              fontSize: 20,
              fontWeight: 800,
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              +{Math.round(orderData.total * 0.03).toLocaleString("ru-RU")} КОН
            </div>
          </div>

          {}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 16,
          }}>
            <div>
              <div style={{ fontSize: 14, color: "rgba(200,225,255,0.7)" }}>Кешбэк «Семь рек»</div>
<div style={{ fontSize: 12, color: "rgba(180,210,245,0.5)", marginTop: 4 }}>
                Можно потратить при следующей покупке
              </div>
            </div>
            <div style={{
              fontSize: 20,
              fontWeight: 800,
              background: "linear-gradient(135deg, #10b981, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              +{cashbackEarned.toLocaleString("ru-RU")} ₽
            </div>
          </div>
        </div>

        {}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: 16,
          border: "1px solid rgba(120,170,255,0.1)",
          padding: 20,
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
            Состав заказа:
          </div>
          {orderData.items.map((item, idx) => (
            <div key={idx} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: idx < orderData.items.length - 1 ? "1px solid rgba(120,170,255,0.08)" : "none",
            }}>
              <div style={{ fontSize: 13, color: "rgba(200,225,255,0.8)" }}>
                {item.name} × {item.qty}
              </div>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>
                {(item.price * item.qty).toLocaleString("ru-RU")} ₽
              </div>
            </div>
          ))}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 16,
            marginTop: 16,
            borderTop: "2px solid rgba(120,170,255,0.2)",
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Итого:</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#7cc1ff" }}>
              {orderData.total.toLocaleString("ru-RU")} ₽
            </div>
          </div>
        </div>

        {}
        <div style={{
          textAlign: "center",
          fontSize: 13,
          color: "rgba(180,210,245,0.6)",
          lineHeight: 1.6,
          marginBottom: 24,
        }}>
          Менеджер свяжется с вами в течение 30 минут для подтверждения заказа.
          <br />
          Работаем ежедневно с 9:00 до 20:00.
        </div>

        {}
        <button
          onClick={onClose}
          className="sr-btn sr-btn--primary"
          style={{
            width: "100%",
            padding: 16,
            fontSize: 16,
            fontWeight: 700,
            boxShadow: "0 4px 20px rgba(42,111,214,0.3)",
          }}
        >
          Вернуться в каталог
        </button>
      </div>
    </div>
  );
}
