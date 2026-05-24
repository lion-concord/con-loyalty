import { useState } from "react";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, getCategoriesByType } from "../types";
import type { CustomCategory } from "../types";
import type { TransactionType } from "../types";

interface Props {
  onBack: () => void;
  onSave: (type: TransactionType, amount: number, category: string, description: string) => void;
  customCategories?: CustomCategory[];
  onAddCategory?: (name: string, icon: string, type: TransactionType) => void;
  onRemoveCategory?: (id: string) => void;
  availableColors?: string[];
  availableIcons?: string[];
}

export default function AddTransactionScreen({ onBack, onSave, customCategories = [], onAddCategory, availableIcons = [] }: Props) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("⭐");
  const categories = getCategoriesByType(type, customCategories);

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0 || !category) return;
    onSave(type, num, category, description);
    onBack();
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a1929 0%, #0d1f33 100%)", paddingBottom: 100 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "rgba(10,25,41,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(120,170,255,0.1)" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#7cc1ff", fontSize: 16, cursor: "pointer" }}>← Назад</button>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>Новая операция</div>
      </header>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["expense", "income"] as const).map((t) => (
            <button key={t} onClick={() => { setType(t); setCategory(""); }}
              style={{ flex: 1, padding: "12px", borderRadius: 14, border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer",
                background: type === t ? (t === "expense" ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#10b981,#059669)") : "rgba(255,255,255,0.05)",
                color: type === t ? "#fff" : "rgba(200,225,255,0.5)" }}>
              {t === "expense" ? "📤 Расход" : "📥 Доход"}
            </button>
          ))}
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: "rgba(200,225,255,0.5)", marginBottom: 8, display: "block" }}>Сумма (₽)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"
            style={{ width: "100%", padding: "16px 20px", borderRadius: 16, border: "1px solid rgba(120,170,255,0.15)",
              background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 28, fontWeight: 700, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: "rgba(200,225,255,0.5)", marginBottom: 10, display: "block" }}>Категория</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 4px", borderRadius: 14, border: "none", cursor: "pointer",
                  background: category === cat.id ? cat.color + "30" : "rgba(255,255,255,0.04)",
                  outline: category === cat.id ? "2px solid " + cat.color : "none" }}>
                <span style={{ fontSize: 24 }}>{cat.icon}</span>
                <span style={{ fontSize: 10, color: "#fff", fontWeight: 500 }}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setShowAddCat(!showAddCat)} style={{ width: "100%", padding: "10px", borderRadius: 12, border: "1px dashed rgba(120,170,255,0.3)", background: "rgba(255,255,255,0.02)", color: "#7cc1ff", fontSize: 13, cursor: "pointer" }}>
            {showAddCat ? "✕ Скрыть" : "➕ Добавить свою категорию"}
          </button>
          {showAddCat && (
            <div style={{ marginTop: 12, padding: 16, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(120,170,255,0.1)" }}>
              <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Название категории"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(120,170,255,0.15)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 14, marginBottom: 10, outline: "none", boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                {availableIcons.slice(0, 20).map((icon) => (
                  <button key={icon} onClick={() => setNewCatIcon(icon)}
                    style={{ width: 36, height: 36, borderRadius: 10, border: "none", fontSize: 18, cursor: "pointer",
                      background: newCatIcon === icon ? "rgba(124,193,255,0.2)" : "rgba(255,255,255,0.05)",
                      outline: newCatIcon === icon ? "2px solid #7cc1ff" : "none" }}>
                    {icon}
                  </button>
                ))}
              </div>
              <button onClick={() => { if (newCatName && onAddCategory) { onAddCategory(newCatName, newCatIcon, type); setNewCatName(""); setNewCatIcon("⭐"); setShowAddCat(false); } }}
                disabled={!newCatName}
                style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  background: newCatName ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "rgba(255,255,255,0.1)", color: newCatName ? "#fff" : "rgba(255,255,255,0.3)" }}>
                Добавить категорию
              </button>
            </div>
          )}
        </div>
        <div style={{ marginBottom: 32 }}>
          <label style={{ fontSize: 13, color: "rgba(200,225,255,0.5)", marginBottom: 8, display: "block" }}>Описание</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Например: Покупки в Пятёрочке"
            style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(120,170,255,0.15)",
              background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>
        <button onClick={handleSubmit}
          disabled={!amount || !category}
          style={{ width: "100%", padding: "16px", borderRadius: 16, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer",
            background: !amount || !category ? "rgba(255,255,255,0.1)" : type === "expense" ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#10b981,#059669)",
            color: !amount || !category ? "rgba(255,255,255,0.3)" : "#fff" }}>
          Сохранить
        </button>
      </div>
    </div>
  );
}
