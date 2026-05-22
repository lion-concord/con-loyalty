import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import TransactionCard from "../components/TransactionCard";
import type { TransactionType } from "../types";

interface Props {
  onBack: () => void;
}

export default function TransactionsScreen({ onBack }: Props) {
  const { transactions, deleteTransaction } = useWallet();
  const [filter, setFilter] = useState<TransactionType | "all">("all");
  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a1929 0%, #0d1f33 100%)", paddingBottom: 100 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "rgba(10,25,41,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(120,170,255,0.1)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#7cc1ff", fontSize: 16, cursor: "pointer" }}>← Назад</button>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>📋 История</div>
      </header>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {([["all", "Все"], ["income", "📥 Доходы"], ["expense", "📤 Расходы"]] as const).map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              style={{ flex: 1, padding: "10px", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: filter === val ? "linear-gradient(135deg,#3b82f6,#2563eb)" : "rgba(255,255,255,0.05)", color: filter === val ? "#fff" : "rgba(200,225,255,0.5)" }}>
              {label}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "rgba(200,225,255,0.4)" }}>Нет операций</div>
        ) : (
          filtered.map((tx) => <TransactionCard key={tx.id} transaction={tx} onDelete={deleteTransaction} />)
        )}
      </div>
    </div>
  );
}