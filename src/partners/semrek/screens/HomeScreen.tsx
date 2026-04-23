import type { SemrekScreen } from "../types";

interface Props {
  onNavigate: (screen: SemrekScreen) => void;
}

export default function HomeScreen({ onNavigate }: Props) {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 64 }}>⚓</div>
        <h1 className="sem-h1">Семь рек</h1>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
          Лодки ПВХ · Доставка по России
        </div>
      </div>

      <div className="sem-card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.9 }}>
          👋 Добро пожаловать в капитанскую рубку!
          <br />
          Выбирайте готовую лодку, собирайте свою в конструкторе или узнайте условия доставки.
          <br />
          <span style={{ color: "#f5c89a", fontWeight: 700 }}>
            За покупку начисляем кешбэк баллами КОН.
          </span>
        </div>
      </div>

      <div className="sem-tiles">
        <button className="sem-tile" onClick={() => onNavigate("catalog")}>
          <div className="sem-tile__icon">🛥</div>
          <div className="sem-tile__title">Каталог</div>
          <div className="sem-tile__sub">6 готовых моделей</div>
        </button>

        <button className="sem-tile" onClick={() => onNavigate("builder")}>
          <div className="sem-tile__icon">🛠</div>
          <div className="sem-tile__title">Конструктор</div>
          <div className="sem-tile__sub">Соберите свою</div>
        </button>

        <button className="sem-tile" onClick={() => onNavigate("delivery")}>
          <div className="sem-tile__icon">📦</div>
          <div className="sem-tile__title">Доставка</div>
          <div className="sem-tile__sub">По всей России</div>
        </button>

        <button className="sem-tile" onClick={() => onNavigate("home")}>
          <div className="sem-tile__icon">ℹ️</div>
          <div className="sem-tile__title">О нас</div>
          <div className="sem-tile__sub">Партнёр КОН</div>
        </button>
      </div>
    </div>
  );
}
