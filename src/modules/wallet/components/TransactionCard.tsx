import type { Transaction, CustomCategory } from "../types";
import { getCategoryById } from "../types";

interface Props {
  transaction: Transaction;
  onDelete?: (id: string) => void;
  customCategories?: CustomCategory[];
}

export default function TransactionCard({ transaction, onDelete, customCategories = [] }: Props) {
  const category = getCategoryById(transaction.category, customCategories);
  const date = new Date(transaction.date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 14,
        border: "1px solid rgba(120,170,255,0.08)",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: category ? `${category.color}20` : "rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {category?.icon || "💰"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {transaction.description || category?.name || "Операция"}
        </div>
        <div style={{ fontSize: 12, color: "rgba(180,210,245,0.5)", marginTop: 2 }}>
          {date} · {category?.name}
        </div>
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: transaction.type === "income" ? "#34d399" : "#f87171",
          flexShrink: 0,
        }}
      >
        {transaction.type === "income" ? "+" : "-"}{transaction.amount.toLocaleString("ru-RU")} ₽
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(transaction.id)}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.3)",
            fontSize: 18,
            cursor: "pointer",
            padding: "4px 8px",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
