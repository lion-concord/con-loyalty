import type { PartnerModuleProps } from "../_shared/types";

export default function SemrekModule({ onClose }: PartnerModuleProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "linear-gradient(180deg,#0a2540 0%,#1e3a5f 60%,#0a2540 100%)",
        color: "white",
        overflowY: "auto",
        padding: "56px 20px 24px",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        ← Назад
      </button>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <div style={{ fontSize: 72 }}>🚤</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "12px 0 6px" }}>
          Семь рек
        </h1>
        <p
          style={{
            color: "#c77a3a",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          КАПИТАНСКАЯ РУБКА
        </p>
        <p
          style={{
            color: "#94a3b8",
            fontSize: 14,
            marginTop: 24,
            lineHeight: 1.6,
          }}
        >
          Модуль в разработке.
          <br />
          Скоро здесь появятся:
          <br />
          🛠 Конструктор лодок ПВХ
          <br />
          📦 Доставка по регионам
          <br />
          💳 Оплата баллами КОН
        </p>
      </div>
    </div>
  );
}
