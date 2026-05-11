import { companyInfo } from "../data/store";

interface Props {
  onBack: () => void;
}

export default function AboutScreen({ onBack }: Props) {
  return (
    <div>
      <header className="sr-header">
        <button className="sr-header__back" onClick={onBack}>← Назад</button>
        <div className="sr-header__title">О компании</div>
        <div style={{ width: 60 }} />
      </header>

      <div className="sr-container">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚤</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{companyInfo.fullName}</div>
        </div>

        {companyInfo.about.map((text, i) => (
          <p key={i} style={{ fontSize: 15, color: "rgba(200,225,255,0.85)", lineHeight: 1.7, marginBottom: 16 }}>
            {text}
          </p>
        ))}

        <div className="sr-section-title" style={{ marginTop: 28 }}>
          <div className="sr-section-title__icon">📊</div>
          В цифрах
        </div>
        <div className="sr-stats">
          {companyInfo.stats.map((stat) => (
            <div key={stat.label} className="sr-stat">
              <div className="sr-stat__value">{stat.value}</div>
              <div className="sr-stat__label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="sr-section-title" style={{ marginTop: 28 }}>
          <div className="sr-section-title__icon">📍</div>
          Контакты
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(120,170,255,0.1)", padding: 20, marginBottom: 24 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "rgba(180,210,245,0.6)", marginBottom: 4 }}>Адрес</div>
            <div style={{ fontSize: 15, color: "#fff", fontWeight: 600 }}>{companyInfo.address}</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "rgba(180,210,245,0.6)", marginBottom: 4 }}>Телефон</div>
            <div style={{ fontSize: 15, color: "#7cc1ff", fontWeight: 700 }}>{companyInfo.phone}</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "rgba(180,210,245,0.6)", marginBottom: 4 }}>Email</div>
            <div style={{ fontSize: 15, color: "#fff", fontWeight: 600 }}>{companyInfo.email}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "rgba(180,210,245,0.6)", marginBottom: 4 }}>Режим работы</div>
            <div style={{ fontSize: 15, color: "#fff", fontWeight: 600 }}>{companyInfo.workHours}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
