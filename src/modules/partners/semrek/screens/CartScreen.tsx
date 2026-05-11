import type { CartItem } from "../types";

interface Props {
  items: CartItem[];
  onBack: () => void;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function CartScreen({ items, onBack, onUpdateQty, onRemove, onCheckout }: Props) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div>
      <header className="sr-header">
        <button className="sr-header__back" onClick={onBack}>← Назад</button>
        <div className="sr-header__title">Корзина</div>
        <div style={{ width: 60 }} />
      </header>

      <div className="sr-container">
        {items.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "rgba(180,210,245,0.5)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Корзина пуста</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Добавьте товары из каталога</div>
          </div>
        )}

        {items.map((item) => (
          <div key={item.id} style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 16,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 16,
            border: "1px solid rgba(120,170,255,0.1)",
            marginBottom: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{item.name}</div>
              <div style={{ fontSize: 14, color: "#7cc1ff", marginTop: 4 }}>
                {item.price.toLocaleString("ru-RU")} ₽ × {item.qty}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => onUpdateQty(item.id, item.qty - 1)} style={{
                width: 32, height: 32, borderRadius: 8, border: "none",
                background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 18, cursor: "pointer",
              }}>−</button>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", minWidth: 24, textAlign: "center" }}>{item.qty}</span>
              <button onClick={() => onUpdateQty(item.id, item.qty + 1)} style={{
                width: 32, height: 32, borderRadius: 8, border: "none",
                background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 18, cursor: "pointer",
              }}>+</button>
            </div>
            <button onClick={() => onRemove(item.id)} style={{
              width: 32, height: 32, borderRadius: 8, border: "none",
              background: "rgba(255,100,100,0.2)", color: "#ff8a8a", fontSize: 14, cursor: "pointer",
            }}>✕</button>
          </div>
        ))}

        {items.length > 0 && (
          <>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 0",
              borderTop: "1px solid rgba(120,170,255,0.15)",
              marginTop: 8,
            }}>
              <span style={{ fontSize: 16, color: "rgba(200,225,255,0.8)" }}>Итого</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>
                {total.toLocaleString("ru-RU")} ₽
              </span>
            </div>
            <button className="sr-btn sr-btn--primary" onClick={onCheckout}>
              Оформить заказ
            </button>
<div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "rgba(140,170,210,0.5)" }}>
              Менеджер свяжется с вами для подтверждения
            </div>
          </>
        )}
      </div>
    </div>
  );
}
