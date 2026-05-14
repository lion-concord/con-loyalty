import { companyInfo, products, services } from "../data/store";

interface Props {
  konBalance?: number;
  cartCount?: number;
  onOpenCatalog: (category?: string) => void;
  onOpenServices: () => void;
  onOpenAbout: () => void;
  onOpenCart: () => void;
  onOpenCard: () => void;
  onClose?: () => void;
}

export default function HomeScreen({
  konBalance = 0,
  cartCount = 0,
  onOpenCatalog,
  onOpenServices,
  onOpenAbout,
  onOpenCart,
  onOpenCard,
  onClose,
}: Props) {
  const featuredProducts = products.slice(0, 3);

  return (
    <div>
      <header className="sr-header">
        <button className="sr-header__back" onClick={onClose}>← Назад</button>
        <div className="sr-header__title">Семь рек</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onOpenCard}
            style={{
              position: "relative",
              padding: "6px 10px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(120,170,255,0.2)",
              fontSize: 16,
              cursor: "pointer",
              color: "#fff",
            }}
          >
            💳
          </button>
          <button
            onClick={onOpenCart}
            style={{
              position: "relative",
              padding: "6px 10px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(120,170,255,0.2)",
              fontSize: 16,
              cursor: "pointer",
              color: "#fff",
            }}
          >
            🛒
            {cartCount > 0 && (
              <span style={{
                position: "absolute",
                top: -6,
                right: -6,
                background: "#ff4757",
                color: "#fff",
                fontSize: 11,
                fontWeight: 800,
                padding: "2px 6px",
                borderRadius: 10,
                minWidth: 18,
                textAlign: "center",
              }}>
                {cartCount}
              </span>
            )}
          </button>
          <div style={{
            padding: "6px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(120,170,255,0.2)",
            fontSize: 13,
            fontWeight: 700,
            color: "#7cc1ff",
          }}>
            {konBalance} КОН
          </div>
        </div>
      </header>

      <div className="sr-container">
        <div className="sr-hero">
          <video className="sr-hero__video" autoPlay loop muted playsInline src="/videos/semrek-banner.mp4" />
          <div className="sr-hero__overlay" />
          <div className="sr-hero__content">
            <div className="sr-hero__title">Лодочный центр</div>
            <div className="sr-hero__subtitle">Продажа, ремонт и тюнинг лодок ПВХ в Красноярске</div>
          </div>
        </div>

        <div className="sr-section-title"><div className="sr-section-title__icon">🚤</div>Каталог</div>
        <div className="sr-categories">
          <div className="sr-category" onClick={() => onOpenCatalog("boat")}>
            <div className="sr-category__icon">🚤</div>
            <div className="sr-category__name">Лодки ПВХ</div>
          </div>
          <div className="sr-category" onClick={() => onOpenCatalog("motor")}>
            <div className="sr-category__icon">⚙️</div>
            <div className="sr-category__name">Моторы</div>
          </div>
          <div className="sr-category" onClick={() => onOpenCatalog("accessory")}>
            <div className="sr-category__icon">🎒</div>
            <div className="sr-category__name">Аксессуары</div>
          </div>
        </div>

        <div className="sr-section-title"><div className="sr-section-title__icon">🔧</div>Услуги</div>
        <div className="sr-scroll">
          {services.slice(0, 3).map((s) => (
            <div key={s.id} className="sr-scroll-item">
<div className="sr-service">
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
            </div>
          ))}
        </div>
        <button className="sr-btn sr-btn--secondary" onClick={onOpenServices} style={{ marginBottom: 28 }}>Все услуги</button>

        <div className="sr-section-title"><div className="sr-section-title__icon">⭐</div>Популярные товары</div>
        {featuredProducts.map((p) => (
          <div key={p.id} className="sr-product" onClick={() => onOpenCatalog()}>
            <img
              src={p.image}
              alt={p.name}
              className="sr-product__img"
              style={{ objectFit: "cover" }}
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = "none";
                const parent = el.parentElement;
                if (parent) {
                  parent.innerHTML = p.category === "boat" ? "🚤" : p.category === "motor" ? "⚙️" : "🎒";
                  parent.style.fontSize = "36px";
                  parent.style.display = "flex";
                  parent.style.alignItems = "center";
                  parent.style.justifyContent = "center";
                }
              }}
            />
            <div className="sr-product__info">
              <div className="sr-product__name">{p.name}</div>
              <div className="sr-product__desc">{p.description}</div>
              <div className="sr-product__price">{p.price.toLocaleString("ru-RU")} ₽</div>
            </div>
          </div>
        ))}
        <button className="sr-btn sr-btn--secondary" onClick={() => onOpenCatalog("all")} style={{ marginTop: 12, marginBottom: 28 }}>Весь каталог</button>

        <div className="sr-section-title"><div className="sr-section-title__icon">📊</div>О компании</div>
        <div className="sr-stats">
          {companyInfo.stats.map((stat) => (
            <div key={stat.label} className="sr-stat">
              <div className="sr-stat__value">{stat.value}</div>
              <div className="sr-stat__label">{stat.label}</div>
            </div>
          ))}
        </div>
        <button className="sr-btn sr-btn--secondary" onClick={onOpenAbout} style={{ marginBottom: 28 }}>Подробнее о компании</button>

        <div className="sr-footer">
          {companyInfo.fullName}<br />
          {companyInfo.address}<br />
          {companyInfo.phone}<br />© 2026
        </div>
      </div>
    </div>
  );
}
