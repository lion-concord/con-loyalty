import { products } from "../data/store";

interface Props {
  productId: string;
  onBack: () => void;
  onAddToCart?: (id: string, name: string, price: number) => void;
}

export default function ProductScreen({ productId, onBack, onAddToCart }: Props) {
  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  return (
    <div>
      <header className="sr-header">
        <button className="sr-header__back" onClick={onBack}>← Назад</button>
        <div className="sr-header__title">{product.name}</div>
        <div style={{ width: 60 }} />
      </header>

      <div className="sr-container">
        <div style={{
          width: "100%",
          aspectRatio: "2/1",
          maxHeight: 180,
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(135deg, #1a3a66, #0f2a4d)",
          marginBottom: 20,
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              const parent = el.parentElement;
              if (parent) {
                parent.innerHTML = product.category === "boat" ? "🚤" : product.category === "motor" ? "⚙️" : "🎒";
                parent.style.fontSize = "80px";
                parent.style.display = "flex";
                parent.style.alignItems = "center";
                parent.style.justifyContent = "center";
              }
            }}
          />
        </div>

        <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
          {product.name}
        </div>

        <div style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #5b8cff, #7cc1ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 16 }}>
          {product.price.toLocaleString("ru-RU")} ₽
        </div>

        <div style={{ fontSize: 15, color: "rgba(200,225,255,0.85)", lineHeight: 1.6, marginBottom: 24 }}>
          {product.description}
        </div>

        <div className="sr-section-title">
          <div className="sr-section-title__icon">📋</div>
          Характеристики
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(120,170,255,0.1)", overflow: "hidden", marginBottom: 24 }}>
          {Object.entries(product.specs).map(([key, value], idx, arr) => (
            <div key={key} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: idx < arr.length - 1 ? "1px solid rgba(120,170,255,0.08)" : "none",
            }}>
              <span style={{ color: "rgba(180,210,245,0.7)", fontSize: 14 }}>{key}</span>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>

        <button 
          className="sr-btn sr-btn--primary" 
          onClick={() => onAddToCart?.(product.id, product.name, product.price)}
        >
          🛒 Добавить в корзину
        </button>

        <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "rgba(140,170,210,0.5)" }}>
          Наличие уточняйте у менеджера по телефону +7 (904) 892-84-57
        </div>
      </div>
    </div>
  );
}
