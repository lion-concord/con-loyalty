import { useState } from "react";
import { EXPENSE_CATEGORIES } from "../types";
import type { Budget, CustomCategory } from "../types";

interface Props {
  budgets: Budget[];
  setBudget: (category: string, limit: number) => void;
  customCategories?: CustomCategory[];
  onBack: () => void;
}

export default function BudgetsScreen({ budgets, setBudget, customCategories = [], onBack }: Props) {
  const [editCat, setEditCat] = useState("");
  const [editVal, setEditVal] = useState("");

  const handleSave = () => {
    const num = parseFloat(editVal);
    if (num > 0 && editCat) {
      setBudget(editCat, num);
      setEditCat("");
      setEditVal("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a1929 0%, #0d1f33 100%)", paddingBottom: 100 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "rgba(10,25,41,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(120,170,255,0.1)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#7cc1ff", fontSize: 16, cursor: "pointer" }}>← Назад</button>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>📊 Бюджеты</div>
      </header>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px" }}>
        {[...EXPENSE_CATEGORIES, ...customCategories].map((cat) => {
          const budget = budgets.find((b) => b.category === cat.id);
          const spent = budget?.spent || 0;
          const limit = budget?.limit || 0;
          const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const isOver = spent > limit && limit > 0;
          return (
            <div key={cat.id}
              style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px", marginBottom: 12, border: "1px solid rgba(120,170,255,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{cat.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{cat.name}</span>
                </div>
                <button onClick={() => { setEditCat(cat.id); setEditVal(limit > 0 ? String(limit) : ""); }}
                  style={{ background: "none", border: "none", color: "#7cc1ff", fontSize: 13, cursor: "pointer" }}>
                  {limit > 0 ? "✏️" : "+ Лимит"}
                </button>
              </div>
              {limit > 0 && (
                <>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, height: 8, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ width: percent + "%", height: "100%", borderRadius: 8,
                      background: isOver ? "linear-gradient(90deg,#ef4444,#dc2626)" : percent > 70 ? "linear-gradient(90deg,#f59e0b,#d97706)" : "linear-gradient(90deg,#10b981,#059669)",
                      transition: "width 0.3s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: isOver ? "#f87171" : "rgba(200,225,255,0.5)" }}>
                      Потрачено: {spent.toLocaleString("ru-RU")} ₽
                    </span>
                    <span style={{ color: "rgba(200,225,255,0.5)" }}>
                      Лимит: {limit.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                </>
              )}
              {editCat === cat.id && (
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <input type="number" value={editVal} onChange={(e) => setEditVal(e.target.value)} placeholder="Лимит ₽"
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(120,170,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, outline: "none" }} />
                  <button onClick={handleSave}
                    style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>OK</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}