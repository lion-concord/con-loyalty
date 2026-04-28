import { useState } from "react";
import PartnerCard from "../components/PartnerCard";
import { usePartners } from "../hooks/usePartners";
import type { Partner } from "../../../shared/types/models";

interface Props {
  onOpenPartner?: (partnerId: string) => void;
}

export default function PartnersListScreen({ onOpenPartner }: Props) {
  const { partners } = usePartners();
  const [selected, setSelected] = useState<Partner | null>(null);

  if (selected) {
    return (
      <div className="lk-screen">
        <div className="lk-card">
          <button
            type="button"
            className="lk-btn lk-btn--ghost"
            onClick={() => setSelected(null)}
          >
            Назад
          </button>

          <h2 style={{ marginTop: 12 }}>{selected.title}</h2>
          <p className="lk-muted">{selected.subtitle}</p>

          {selected.hasModule ? (
            <button
              type="button"
              className="lk-btn lk-btn--primary"
              onClick={() => {
                onOpenPartner?.(selected.id);
                setSelected(null);
              }}
              style={{ marginTop: 12, width: "100%" }}
            >
              Открыть модуль «{selected.title}»
            </button>
          ) : (
            <div className="lk-card" style={{ marginTop: 12 }}>
              <p>
                Обычная карточка партнёра: здесь будут условия, акции, адреса и
                правила начисления баллов.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="lk-screen">
      <div className="lk-card">
        <h2>Партнёры</h2>
        <p className="lk-muted">
          Каталог партнёров программы лояльности.
        </p>
      </div>

      <div
        className="lk-card"
        style={{
          marginTop: 16,
          padding: 0,
          overflow: "hidden",
          position: "relative",
          background: "linear-gradient(135deg, #06223d 0%, #0b4f6c 45%, #0ea5e9 100%)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 12px 30px rgba(3, 105, 161, 0.24)"
        }}
      >
        <style>{`
          @keyframes semrekWave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-80px); }
          }
          @keyframes semrekFloat {
            0%, 100% { transform: translateY(0) rotate(-2deg); }
            50% { transform: translateY(-5px) rotate(2deg); }
          }
          @keyframes semrekGlow {
            0%, 100% { opacity: .45; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.08); }
          }
        `}</style>

        <button
          type="button"
          onClick={() => {
            // Сразу открываем модуль, без промежуточной карточки
            onOpenPartner?.("semrek");
          }}
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            color: "inherit",
            textAlign: "left",
            padding: 0,
            cursor: "pointer",
            display: "block"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at top right, rgba(255,255,255,0.16), transparent 32%)",
              pointerEvents: "none"
            }}
/>

          <div style={{ padding: 16, position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "flex-start"
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 1,
                    opacity: 0.85,
                    textTransform: "uppercase"
                  }}
                >
                  Партнёр
                </div>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    marginTop: 6,
                    lineHeight: 1.1
                  }}
                >
                  Семь рек
                </div>

                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    marginTop: 8,
                    opacity: 0.95
                  }}
                >
                  Лодки ПВХ: ремонт, тюнинг, комплекты под ключ.
                </div>

                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.14)", fontSize: 12, fontWeight: 700 }}>
                    Ремонт лодок
                  </span>
                  <span style={{ padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.14)", fontSize: 12, fontWeight: 700 }}>
                    Тюнинг ПВХ
                  </span>
                  <span style={{ padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.14)", fontSize: 12, fontWeight: 700 }}>
                    Готовые комплекты
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                marginTop: 14,
                height: 92,
                borderRadius: 16,
                overflow: "hidden",
                background: "linear-gradient(180deg, rgba(186,230,253,0.18) 0%, rgba(125,211,252,0.10) 35%, rgba(14,116,144,0.18) 100%)"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 45%, transparent 100%)"
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 8,
                  transform: "translateX(-50%)",
                  fontSize: 18,
                  opacity: 0.4,
                  animation: "semrekGlow 2.4s ease-in-out infinite"
                }}
              >
                ✦
              </div>

              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: 34,
                  transform: "translateX(-50%)",
                  fontSize: 32,
                  zIndex: 5,
                  animation: "semrekFloat 3.6s ease-in-out infinite",
                  filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.18))"
                }}
              >
                ⛵
              </div>

              <div
                style={{
                  position: "absolute",
                  left: "-8%",
                  right: "-8%",
                  bottom: 28,
                  height: 26,
                  borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
background: "linear-gradient(180deg, rgba(125,211,252,0.55) 0%, rgba(56,189,248,0.42) 100%)",
                  transform: "translateX(0)",
                  animation: "semrekWave 7s linear infinite"
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: "-12%",
                  right: "-12%",
                  bottom: 14,
                  height: 32,
                  borderRadius: "55% 45% 0 0 / 100% 100% 0 0",
                  background: "linear-gradient(180deg, rgba(14,165,233,0.72) 0%, rgba(8,145,178,0.58) 100%)",
                  transform: "translateX(0)",
                  animation: "semrekWave 10s linear infinite reverse"
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: "-10%",
                  right: "-10%",
                  bottom: -2,
                  height: 42,
                  borderRadius: "60% 40% 0 0 / 100% 100% 0 0",
                  background: "linear-gradient(180deg, rgba(8,145,178,0.95) 0%, rgba(6,78,110,0.98) 100%)",
                  transform: "translateX(0)",
                  animation: "semrekWave 12s linear infinite"
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: 30,
                  width: 54,
                  height: 8,
                  transform: "translateX(-50%)",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.22)",
                  filter: "blur(2px)",
                  zIndex: 4
                }}
              />
            </div>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255,255,255,0.14)",
                borderRadius: 12,
                padding: "12px 14px"
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 800 }}>Открыть «Семь рек»</span>
              <span style={{ fontSize: 18, fontWeight: 900 }}>→</span>
            </div>
          </div>
        </button>
      </div>

      {partners.map((partner) => (
        <PartnerCard
          key={partner.id}
          partner={partner}
          onOpen={(item) => setSelected(item)}
        />
      ))}
    </div>
  );
}
