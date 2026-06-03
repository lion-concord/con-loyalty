import { useState } from "react";
import { usePartnerCard } from "../hooks/usePartnerCard";
import type { CartItem } from "../types";

interface Props {
  items: CartItem[];
  onBack: () => void;
  onSubmit: (data: OrderData) => void;
  isSubmitting?: boolean;
}

export interface OrderData {
  name: string;
  phone: string;
  email: string;
  address: string;
  payment: "card" | "cash" | "sbp";
  comment: string;
  cashbackUsed: number;
}

export default function CheckoutScreen({ items, onBack, onSubmit, isSubmitting }: Props) {
  const { card, spendCashback } = usePartnerCard("semrek");
  const [form, setForm] = useState<OrderData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    payment: "card",
    comment: "",
    cashbackUsed: 0,
  });
  const [focus, setFocus] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const maxCashback = Math.min(
    card?.cashbackBalance || 0,
    Math.floor(subtotal * 0.1) // до 10% от суммы
  );
  const total = subtotal - form.cashbackUsed;
  const konEarn = Math.round(total * 0.03);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      alert("Заполните имя и телефон");
      return;
    }

    // Списываем кешбэк
    if (form.cashbackUsed > 0) {
      const orderId = `SR${Date.now()}`;
      spendCashback(form.cashbackUsed, orderId);
    }

    onSubmit(form);
  };

  const inp = (f: string): React.CSSProperties => ({
    padding: "14px 16px",
    borderRadius: 12,
    border: `1px solid ${focus === f ? "rgba(120,170,255,0.5)" : "rgba(120,170,255,0.15)"}`,
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    fontSize: 15,
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
    transition: "all .25s",
    boxShadow: focus === f ? "0 0 0 3px rgba(42,111,214,0.15)" : "none",
  });

  const paymentMethods = [
    { id: "card" as const, label: "Банковская карта", icon: "💳", desc: "Visa, Mastercard, МИР" },
    { id: "sbp" as const, label: "СБП (без комиссии)", icon: "📱", desc: "Быстрый перевод по номеру" },
    { id: "cash" as const, label: "Наличные при получении", icon: "💵", desc: "Оплата в магазине или курьеру" },
  ];

  return (
    <div>
      <header className="sr-header">
        <button className="sr-header__back" onClick={onBack}>← Назад</button>
        <div className="sr-header__title">Оформление заказа</div>
        <div style={{ width: 60 }} />
      </header>

      <div className="sr-container">
        {}
        <div style={{
          background: "linear-gradient(135deg, rgba(42,111,214,0.25), rgba(61,189,224,0.15))",
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
          border: "1px solid rgba(120,170,255,0.2)",
        }}>
          <div style={{ fontSize: 14, color: "rgba(200,225,255,0.8)", marginBottom: 10, fontWeight: 600 }}>
            Состав заказа
          </div>
          {items.map((item) => (
            <div key={item.id} style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              marginBottom: 8,
              color: "#fff",
              alignItems: "center",
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  background: "rgba(42,111,214,0.3)",
                  borderRadius: 8,
                  padding: "2px 8px",
                  fontSize: 12,
fontWeight: 700,
                  color: "#7cc1ff",
                }}>
                  ×{item.qty}
                </span>
                {item.name}
              </span>
              <span style={{ fontWeight: 600 }}>
                {(item.price * item.qty).toLocaleString("ru-RU")} ₽
              </span>
            </div>
          ))}

          {}
          {maxCashback > 0 && (
            <div style={{
              marginTop: 16,
              padding: 16,
              background: "rgba(16,185,129,0.1)",
              borderRadius: 12,
              border: "1px solid rgba(16,185,129,0.3)",
            }}>
              <div style={{ fontSize: 14, color: "#10b981", fontWeight: 700, marginBottom: 12 }}>
                💰 Списать кешбэк
              </div>
              <div style={{ fontSize: 12, color: "rgba(200,225,255,0.7)", marginBottom: 12 }}>
                Доступно: {card?.cashbackBalance.toLocaleString("ru-RU")} ₽ (можно списать до {maxCashback.toLocaleString("ru-RU")} ₽)
              </div>
              <input
                type="range"
                min="0"
                max={maxCashback}
                step="100"
                value={form.cashbackUsed}
                onChange={(e) => setForm({ ...form, cashbackUsed: Number(e.target.value) })}
                style={{
                  width: "100%",
                  accentColor: "#10b981",
                  marginBottom: 8,
                }}
              />
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span style={{ fontSize: 13, color: "rgba(200,225,255,0.7)" }}>
                  Списать:
                </span>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#10b981" }}>
                  {form.cashbackUsed.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>
          )}

          {}
          <div style={{
            borderTop: "1px solid rgba(120,170,255,0.2)",
            marginTop: 16,
            paddingTop: 16,
          }}>
            {form.cashbackUsed > 0 && (
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                color: "rgba(200,225,255,0.7)",
                marginBottom: 8,
              }}>
                <span>Сумма заказа:</span>
                <span>{subtotal.toLocaleString("ru-RU")} ₽</span>
              </div>
            )}
            {form.cashbackUsed > 0 && (
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                color: "#10b981",
                marginBottom: 12,
              }}>
                <span>Списано кешбэком:</span>
                <span>-{form.cashbackUsed.toLocaleString("ru-RU")} ₽</span>
              </div>
            )}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 800,
              color: "#fff",
              fontSize: 18,
            }}>
              <span>К оплате:</span>
              <span>{total.toLocaleString("ru-RU")} ₽</span>
            </div>
          </div>

          <div style={{
            marginTop: 12,
            fontSize: 13,
            color: "#7cc1ff",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <span>✨</span>
            <span>+{konEarn.toLocaleString("ru-RU")} КОН начислится после покупки</span>
          </div>
        </div>
<form onSubmit={handleSubmit}>
          {}
          <div className="sr-section-title">
            <div className="sr-section-title__icon">👤</div>
            Контактные данные
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            <input
              type="text"
              placeholder="Имя и фамилия *"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onFocus={() => setFocus("name")}
              onBlur={() => setFocus(null)}
              style={inp("name")}
            />
            <input
              type="tel"
              placeholder="Телефон *"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              onFocus={() => setFocus("phone")}
              onBlur={() => setFocus(null)}
              style={inp("phone")}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocus("email")}
              onBlur={() => setFocus(null)}
              style={inp("email")}
            />
            <input
              type="text"
              placeholder="Адрес доставки или самовывоза"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              onFocus={() => setFocus("addr")}
              onBlur={() => setFocus(null)}
              style={inp("addr")}
            />
          </div>

          {}
          <div className="sr-section-title">
            <div className="sr-section-title__icon">💳</div>
            Способ оплаты
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 16,
                  borderRadius: 14,
                  background: form.payment === method.id ? "rgba(42,111,214,0.2)" : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${form.payment === method.id ? "rgba(120,170,255,0.5)" : "rgba(120,170,255,0.1)"}`,
                  cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={form.payment === method.id}
                  onChange={() => setForm({ ...form, payment: method.id })}
                  style={{ width: 20, height: 20, accentColor: "#2a6fd6", cursor: "pointer" }}
                />
                <span style={{ fontSize: 24 }}>{method.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, color: "#fff", fontWeight: 700 }}>{method.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(200,225,255,0.6)", marginTop: 2 }}>{method.desc}</div>
                </div>
                {form.payment === method.id && <span style={{ color: "#7cc1ff", fontSize: 18 }}>✓</span>}
              </label>
            ))}
          </div>

          {}
          <div className="sr-section-title">
            <div className="sr-section-title__icon">📝</div>
            Комментарий
          </div>
<textarea
            placeholder="Пожелания по доставке, удобное время звонка..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            onFocus={() => setFocus("comm")}
            onBlur={() => setFocus(null)}
            rows={3}
            style={{ ...inp("comm"), resize: "none", lineHeight: 1.5, marginBottom: 24 }}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="sr-btn sr-btn--primary"
            style={{
              width: "100%",
              padding: 16,
              fontSize: 16,
              fontWeight: 700,
              boxShadow: "0 4px 20px rgba(42,111,214,0.3)",
            }}
          >
            {isSubmitting ? "Отправка..." : "Подтвердить заказ"}
          </button>

          <div style={{
            textAlign: "center",
            marginTop: 14,
            fontSize: 12,
            color: "rgba(140,170,210,0.5)",
            lineHeight: 1.5,
          }}>
            Менеджер перезвонит для подтверждения в течение 30 минут
            <br />
            Работаем ежедневно с 9:00 до 20:00
          </div>
        </form>
      </div>
    </div>
  );
}
