import { useState } from "react";
import { useGoals } from "../hooks/useGoals";

interface Props { onBack: () => void; }

export default function GoalsScreen({ onBack }: Props) {
  const { goals, addGoal, addToGoal, deleteGoal } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [topUp, setTopUp] = useState<{ id: string; val: string } | null>(null);
  const icons = ["🎯", "🏖️", "📱", "🚗", "🏠", "💻", "🎓", "✈️"];
  const [icon, setIcon] = useState("🎯");

  const handleAdd = () => {
    const num = parseFloat(target);
    if (name && num > 0) { addGoal(name, num, icon, "#3b82f6"); setName(""); setTarget(""); setShowForm(false); }
  };

  const handleTopUp = () => {
    if (topUp) { const num = parseFloat(topUp.val); if (num > 0) addToGoal(topUp.id, num); setTopUp(null); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a1929 0%, #0d1f33 100%)", paddingBottom: 100 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "rgba(10,25,41,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(120,170,255,0.1)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#7cc1ff", fontSize: 16, cursor: "pointer" }}>← Назад</button>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>🎯 Цели</div>
      </header>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px" }}>
        {goals.map((g) => {
          const percent = g.targetAmount > 0 ? Math.min((g.currentAmount / g.targetAmount) * 100, 100) : 0;
          return (
            <div key={g.id}
              style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "20px", marginBottom: 14, border: "1px solid rgba(120,170,255,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{g.icon}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{g.name}</div>
                    <div style={{ fontSize: 13, color: "rgba(200,225,255,0.5)" }}>
                      {g.currentAmount.toLocaleString("ru-RU")} / {g.targetAmount.toLocaleString("ru-RU")} ₽
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteGoal(g.id)}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 18, cursor: "pointer" }}>×</button>
              </div>
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, height: 10, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ width: percent + "%", height: "100%", borderRadius: 8, background: percent >= 100 ? "linear-gradient(90deg,#10b981,#059669)" : "linear-gradient(90deg,#3b82f6,#8b5cf6)", transition: "width 0.3s" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: percent >= 100 ? "#34d399" : "#7cc1ff" }}>{Math.round(percent)}%</span>
                {percent < 100 && (
                  <button onClick={() => setTopUp({ id: g.id, val: "" })}
                    style={{ padding: "6px 14px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    + Пополнить
                  </button>
                )}
              </div>
              {topUp?.id === g.id && (
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <input type="number" value={topUp.val} onChange={(e) => setTopUp({ id: g.id, val: e.target.value })} placeholder="Сумма ₽"
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(120,170,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, outline: "none" }} />
                  <button onClick={handleTopUp}
                    style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: "#10b981", color: "#fff", fontWeight: 600, cursor: "pointer" }}>OK</button>
                </div>
              )}
            </div>
          );
        })}
        {showForm && (
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "20px", marginBottom: 14, border: "1px solid rgba(120,170,255,0.15)" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Новая цель</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              {icons.map((ic) => (
                <button key={ic} onClick={() => setIcon(ic)}
                  style={{ fontSize: 24, width: 40, height: 40, borderRadius: 10, border: icon === ic ? "2px solid #3b82f6" : "none",
                    background: icon === ic ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)", cursor: "pointer" }}>{ic}</button>
              ))}
            </div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название цели"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(120,170,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
            <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Целевая сумма ₽"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(120,170,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, outline: "none", marginBottom: 14, boxSizing: "border-box" }} />
            <button onClick={handleAdd}
              style={{ width: "100%", padding: "12px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Создать цель
            </button>
          </div>
        )}
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            style={{ width: "100%", padding: "14px", borderRadius: 16, border: "1px dashed rgba(120,170,255,0.2)", background: "rgba(255,255,255,0.03)",
              color: "#7cc1ff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            + Добавить цель
          </button>
        )}
      </div>
    </div>
  );
}