import { services } from "../data/store";

interface Props {
  onBack: () => void;
}

export default function ServicesScreen({ onBack }: Props) {
  return (
    <div>
      <header className="sr-header">
        <button className="sr-header__back" onClick={onBack}>← Назад</button>
        <div className="sr-header__title">Услуги</div>
        <div style={{ width: 60 }} />
      </header>

      <div className="sr-container">
        {services.map((s) => (
          <div key={s.id} className="sr-service">
            <div className="sr-service__header">
              <div className="sr-service__icon">🔧</div>
              <div className="sr-service__name">{s.name}</div>
            </div>
            <div className="sr-service__desc">{s.description}</div>
            <div className="sr-service__meta">
              <span className="sr-service__price">от {s.priceFrom.toLocaleString("ru-RU")} ₽</span>
              <span className="sr-service__duration">{s.duration}</span>
            </div>
          </div>
        ))}

        <div style={{ textAlign: "center", padding: "20px 16px", color: "rgba(140,170,210,0.6)", fontSize: 13, lineHeight: 1.6 }}>
          Для оформления заявки свяжитесь с нами<br />
          <strong style={{ color: "#7cc1ff" }}>+7 (904) 892-84-57</strong>
        </div>
      </div>
    </div>
  );
}
