import { QRCodeSVG } from "qrcode.react";
import { usePartnerCard } from "../hooks/usePartnerCard";

interface Props {
  onBack: () => void;
}

export default function PartnerCardScreen({ onBack }: Props) {
  const { card } = usePartnerCard("semrek");

  if (!card) return null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a1929 0%, #0d1f33 100%)", padding: "0 0 24px" }}>
      {}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        position: "sticky",
        top: 0,
        background: "rgba(10,25,41,0.9)",
        backdropFilter: "blur(12px)",
        zIndex: 10,
        borderBottom: "1px solid rgba(120,170,255,0.1)",
      }}>
        <button onClick={onBack} style={{
          background: "none",
          border: "none",
          color: "#7cc1ff",
          fontSize: 16,
          cursor: "pointer",
          padding: "8px 0",
        }}>← Назад</button>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>Карта участника</div>
        <div style={{ width: 60 }} />
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px" }}>
        {}
        <div style={{
          position: "relative",
          background: `linear-gradient(135deg, ${card.gradient[0]} 0%, ${card.gradient[1]} 50%, #0a2540 100%)`,
          borderRadius: 24,
          padding: "32px 28px",
          color: "#fff",
          boxShadow: "0 20px 60px rgba(0,60,120,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
          overflow: "hidden",
          marginBottom: 28,
        }}>
          {}
          <div style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            filter: "blur(40px)",
          }} />
          <div style={{
            position: "absolute",
            bottom: -40,
            left: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            filter: "blur(30px)",
          }} />

          {}
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              border: "1px solid rgba(255,255,255,0.2)",
            }}>{card.icon}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.3px" }}>{card.partnerName}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Партнёрская программа</div>
            </div>
          </div>

          {}
          <div style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            padding: 20,
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.15)",
            marginBottom: 24,
          }}>
<div style={{
              background: "#fff",
              borderRadius: 16,
              padding: 16,
              display: "inline-block",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}>
              <QRCodeSVG value={card.qrCode} size={150} level="M" />
            </div>
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>Покажите QR-код менеджеру</div>
          </div>

          {}
          <div style={{ position: "relative", textAlign: "center" }}>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8, textTransform: "uppercase", letterSpacing: "1px" }}>Баланс кешбэка</div>
            <div style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: "-1px",
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}>
              {card.cashbackBalance.toLocaleString("ru-RU")} <span style={{ fontSize: 24, opacity: 0.8 }}>₽</span>
            </div>
          </div>

          {}
          <div style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div style={{ fontSize: 11, opacity: 0.5, fontFamily: "monospace" }}>ID: {card.qrCode.slice(-12)}</div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 20,
              background: card.cashbackBalance > 0 ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.1)",
              color: card.cashbackBalance > 0 ? "#34d399" : "rgba(255,255,255,0.5)",
            }}>
              {card.cashbackBalance > 0 ? "Активна" : "Нет баланса"}
            </div>
          </div>
        </div>

        {}
        <div>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <span>📋</span> История операций
          </div>

          {card.history.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "48px 20px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 16,
              border: "1px dashed rgba(120,170,255,0.15)",
            }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📭</div>
              <div style={{ fontSize: 15, color: "rgba(200,225,255,0.5)" }}>Пока нет операций</div>
              <div style={{ fontSize: 13, color: "rgba(180,210,245,0.3)", marginTop: 6 }}>Кешбэк появится после первой покупки</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {card.history.map((tx) => (
                <div key={tx.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 18px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 14,
                  border: "1px solid rgba(120,170,255,0.08)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: tx.type === "earn" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                      display: "flex",
alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}>
                      {tx.type === "earn" ? "↓" : "↑"}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{tx.description}</div>
                      <div style={{ fontSize: 12, color: "rgba(180,210,245,0.5)", marginTop: 2 }}>
                        {new Date(tx.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: tx.type === "earn" ? "#34d399" : "#f87171",
                  }}>
                    {tx.type === "earn" ? "+" : "-"}{tx.amount.toLocaleString("ru-RU")} ₽
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
