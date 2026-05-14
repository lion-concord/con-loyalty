import { QRCodeSVG } from "qrcode.react";
import { usePartnerCard } from "../hooks/usePartnerCard";

interface Props {
  onBack: () => void;
}

export default function PartnerCardScreen({ onBack }: Props) {
  const { card } = usePartnerCard("semrek");

  if (!card) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#0a1929", padding: "20px 16px" }}>
      <header className="sr-header">
        <button className="sr-header__back" onClick={onBack}>← Назад</button>
        <div className="sr-header__title">Карта участника</div>
        <div style={{ width: 60 }} />
      </header>

      <div style={{ maxWidth: 480, margin: "20px auto" }}>
        {}
        <div style={{
          background: `linear-gradient(135deg, ${card.gradient[0]}, ${card.gradient[1]})`,
          borderRadius: 24,
          padding: 32,
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{card.icon}</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>{card.partnerName}</div>

          <div style={{ background: "#fff", padding: 16, borderRadius: 16, display: "inline-block", marginBottom: 24 }}>
            <QRCodeSVG value={card.qrCode} size={160} />
          </div>

          <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>Баланс кешбэка</div>
          <div style={{ fontSize: 36, fontWeight: 800 }}>{card.cashbackBalance.toLocaleString("ru-RU")} ₽</div>
        </div>

        {}
        <div style={{ color: "#fff" }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>История операций</div>
          {card.history.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)" }}>Пока нет операций</div>
          ) : (
            card.history.map((tx) => (
              <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div>
                  <div style={{ fontSize: 14 }}>{tx.description}</div>
                  <div style={{ fontSize: 12, opacity: 0.5 }}>{new Date(tx.date).toLocaleDateString()}</div>
                </div>
                <div style={{ fontWeight: 700, color: tx.type === "earn" ? "#10b981" : "#ef4444" }}>
                  {tx.type === "earn" ? "+" : "-"}{tx.amount.toLocaleString("ru-RU")} ₽
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
