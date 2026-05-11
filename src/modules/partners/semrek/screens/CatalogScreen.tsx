import { useState, useMemo } from "react";
import { products } from "../data/store";

interface Props {
  initialCategory: string;
  onBack: () => void;
  onOpenProduct: (id: string) => void;
}

const categories = [
  { id: "all", name: "Все" },
  { id: "boat", name: "Лодки" },
  { id: "motor", name: "Моторы" },
  { id: "accessory", name: "Аксессуары" },
];

const categoryEmoji: Record<string, string> = {
  boat: "🚤",
  motor: "⚙️",
  accessory: "🎒",
};

export default function CatalogScreen({ initialCategory, onBack, onOpenProduct }: Props) {
  const [activeCat, setActiveCat] = useState(initialCategory);

  const filtered = useMemo(() => {
    if (activeCat === "all") return products;
    return products.filter((p) => p.category === activeCat);
  }, [activeCat]);

  return (
    <div>
      <header className="sr-header">
        <button className="sr-header__back" onClick={onBack}>← Назад</button>
        <div className="sr-header__title">Каталог</div>
        <div style={{ width: 60 }} />
      </header>

      <div className="sr-container">
        <div className="sr-scroll" style={{ marginBottom: 16 }}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              style={{
                flexShrink: 0,
                padding: "8px 16px",
                borderRadius: 12,
                border: "none",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                background: activeCat === c.id
                  ? "linear-gradient(135deg, #2a6fd6, #3dbde0)"
                  : "rgba(255,255,255,0.06)",
                color: activeCat === c.id ? "#fff" : "rgba(200,225,255,0.8)",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {filtered.map((p) => (
          <div key={p.id} className="sr-product" onClick={() => onOpenProduct(p.id)}>
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
                  parent.innerHTML = categoryEmoji[p.category] || "📦";
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="sr-product__price">{p.price.toLocaleString("ru-RU")} ₽</div>
                {!p.inStock && (
                  <span style={{ fontSize: 12, color: "#ff8a8a", fontWeight: 600 }}>Нет в наличии</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "rgba(180,210,245,0.5)" }}>
            Товары не найдены
          </div>
        )}
      </div>
    </div>
  );
}
