import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { getCategoryById, EXPENSE_CATEGORIES } from "../types";

interface Props { onBack: () => void; }

export default function StatsScreen({ onBack }: Props) {
  const { transactions, totalIncome, totalExpense } = useWallet();
  const [period, setPeriod] = useState<"week" | "month" | "year" | "all">("month");

  const now = new Date();
  const filteredTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    if (period === "all") return true;
    if (period === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    }
    if (period === "month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (period === "year") {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const filteredIncome = filteredTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const filteredExpense = filteredTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const total = filteredIncome + filteredExpense || 1;

  const byCategory = EXPENSE_CATEGORIES.map((cat) => {
    const sum = filteredTransactions.filter((t) => t.category === cat.id && t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { ...cat, sum };
  }).filter((c) => c.sum > 0).sort((a, b) => b.sum - a.sum);

  const topCategory = byCategory[0];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a1929 0%, #0d1f33 100%)", paddingBottom: 100 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "rgba(10,25,41,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(120,170,255,0.1)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#7cc1ff", fontSize: 16, cursor: "pointer" }}>← Назад</button>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>📈 Статистика</div>
      </header>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {(["week","month","year","all"] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: period === p ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "rgba(255,255,255,0.05)",
                color: period === p ? "#fff" : "rgba(200,225,255,0.5)" }}>
              {p === "week" ? "Неделя" : p === "month" ? "Месяц" : p === "year" ? "Год" : "Всё"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, background: "linear-gradient(135deg,#059669,#10b981)", borderRadius: 20, padding: "20px", color: "#fff" }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Доходы</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{filteredIncome.toLocaleString("ru-RU")} ₽</div>
          </div>
          <div style={{ flex: 1, background: "linear-gradient(135deg,#dc2626,#ef4444)", borderRadius: 20, padding: "20px", color: "#fff" }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Расходы</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{filteredExpense.toLocaleString("ru-RU")} ₽</div>
          </div>
        </div>
        {topCategory && (
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px 20px", marginBottom: 24, border: "1px solid rgba(120,170,255,0.08)", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 32 }}>{topCategory.icon}</span>
            <div>
              <div style={{ fontSize: 13, color: "rgba(200,225,255,0.5)" }}>Топ категория расходов</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{topCategory.name} — {topCategory.sum.toLocaleString("ru-RU")} ₽</div>
            </div>
          </div>
        )}
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Расходы по категориям</div>
        {byCategory.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "rgba(200,225,255,0.4)" }}>Нет данных</div>
        ) : (
          byCategory.map((cat) => {
            const pct = totalExpense > 0 ? (cat.sum / totalExpense) * 100 : 0;
            return (
              <div key={cat.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: "#fff" }}>{cat.icon} {cat.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(200,225,255,0.7)" }}>{cat.sum.toLocaleString("ru-RU")} ₽ ({Math.round(pct)}%)</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, height: 10, overflow: "hidden" }}>
                  <div style={{ width: pct + "%", height: "100%", borderRadius: 8, background: cat.color, transition: "width 0.3s" }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}