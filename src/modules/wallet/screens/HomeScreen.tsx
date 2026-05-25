import { useWallet } from "../hooks/useWallet";
import type { CustomCategory } from "../types";
import TransactionCard from "../components/TransactionCard";
import FAB from "../components/FAB";

interface Props {
  onAdd: () => void;
  onTransactions: () => void;
  onBudgets: () => void;
  onGoals: () => void;
  onStats: () => void;
  onScanReceipt: () => void;
  customCategories?: CustomCategory[];
}

export default function HomeScreen({ onAdd, onTransactions, onBudgets, onGoals, onStats, onScanReceipt, customCategories = [] }: Props) {
  const { balance, totalIncome, totalExpense, recent } = useWallet();
  const quickActions = [
    { label: "📋 История", onClick: onTransactions },
    { label: "📊 Бюджеты", onClick: onBudgets },
    { label: "🎯 Цели", onClick: onGoals },
    { label: "📈 Статистика", onClick: onStats },
    { label: "📷 Сканировать чек", onClick: onScanReceipt },
  ];
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a1929 0%, #0d1f33 100%)", padding: "0 0 100px" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", position: "sticky", top: 0, background: "rgba(10,25,41,0.9)", backdropFilter: "blur(12px)", zIndex: 10, borderBottom: "1px solid rgba(120,170,255,0.1)" }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>💰 КОН Кошелёк</div>
      </header>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px" }}>
        <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)", borderRadius: 24, padding: "28px 24px", color: "#fff", boxShadow: "0 20px 60px rgba(0,60,120,0.3)", marginBottom: 24 }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8, textTransform: "uppercase", letterSpacing: "1px" }}>Общий баланс</div>
          <div style={{ fontSize: 42, fontWeight: 800, marginBottom: 20 }}>{balance.toLocaleString("ru-RU")} <span style={{ fontSize: 24, opacity: 0.8 }}>₽</span></div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Доходы</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#34d399" }}>+{totalIncome.toLocaleString("ru-RU")} ₽</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Расходы</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#f87171" }}>-{totalExpense.toLocaleString("ru-RU")} ₽</div>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
          {quickActions.map((item) => (
            <button key={item.label} onClick={item.onClick}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(120,170,255,0.1)",
                borderRadius: 16, padding: "16px 12px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              {item.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Последние операции</div>
          <button onClick={onTransactions} style={{ background: "none", border: "none", color: "#7cc1ff", fontSize: 13, cursor: "pointer" }}>Все →</button>
        </div>
        {recent.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px dashed rgba(120,170,255,0.15)" }}>
            <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.3 }}>📝</div>
            <div style={{ fontSize: 15, color: "rgba(200,225,255,0.5)" }}>Нет операций</div>
            <div style={{ fontSize: 13, color: "rgba(180,210,245,0.3)", marginTop: 6 }}>Добавьте первый доход или расход</div>
          </div>
        ) : (
          recent.map((tx) => <TransactionCard key={tx.id} transaction={tx} customCategories={customCategories} />)
        )}
      </div>
      <FAB onClick={onAdd} />
    </div>
  );
}
