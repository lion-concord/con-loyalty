import { useState } from "react";
import { parseReceiptQR, type ReceiptQRData } from "../utils/qrParser";
import QRScanner from "../components/QRScanner";
import { EXPENSE_CATEGORIES } from "../types";
import type { CustomCategory } from "../types";

interface ScanReceiptScreenProps {
  customCategories?: CustomCategory[];
  onAddTransaction: (type: "expense" | "income", amount: number, category: string, description: string) => void;
  onBack: () => void;
}

export default function ScanReceiptScreen({ customCategories = [], onAddTransaction, onBack }: ScanReceiptScreenProps) {
  const [scanned, setScanned] = useState<ReceiptQRData | null>(null);
  const [rawQR, setRawQR] = useState("");
  const [rawAmount, setRawAmount] = useState("");
  const [rawDesc, setRawDesc] = useState("");
  const [category, setCategory] = useState("food");
  const [error, setError] = useState("");

  const handleScan = (text: string) => {
    const data = parseReceiptQR(text);
    if (!data) {
      setRawQR(text);
      setRawDesc(text.slice(0, 60));
      setError("");
      return;
    }
    setScanned(data);
    setRawQR("");
    setError("");
  };

  const handleAdd = () => {
    if (!scanned) return;
    const date = new Date(scanned!.date);
    const desc = "Чек ФНС " + scanned.fn.slice(-4) + " на " + scanned!.sum.toLocaleString("ru-RU") + " ₽";
    onAddTransaction("expense", scanned.sum, category, desc);
    onBack();
  };

  const handleAddRaw = () => {
    const amount = parseFloat(rawAmount);
    if (isNaN(amount) || amount <= 0) { setError("Введите сумму"); return; }
    onAddTransaction("expense", amount, category, rawDesc || "QR: " + rawQR.slice(0, 30));
    onBack();
  };

  if (!scanned && !rawQR) {
    return <QRScanner onScan={handleScan} onCancel={onBack} />;
  }

  const allCats = [...EXPENSE_CATEGORIES, ...customCategories];

  if (rawQR) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a1929 0%, #0d1f33 100%)", color: "#fff", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => { setRawQR(""); setRawAmount(""); }} style={{ background: "none", border: "none", color: "#7cc1ff", fontSize: 16, cursor: "pointer" }}>← Назад</button>
          <div style={{ fontSize: 17, fontWeight: 700 }}>📷 QR распознан</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid rgba(120,170,255,0.1)" }}>
          <div style={{ fontSize: 14, color: "rgba(200,225,255,0.6)", marginBottom: 4 }}>Текст QR</div>
          <div style={{ fontSize: 13, color: "#fff", wordBreak: "break-all" }}>{rawQR.slice(0, 100)}{rawQR.length > 100 ? "..." : ""}</div>
        </div>
        <div style={{ fontSize: 14, color: "rgba(200,225,255,0.6)", marginBottom: 4 }}>Сумма</div>
        <input type="number" value={rawAmount} onChange={(e) => setRawAmount(e.target.value)} placeholder="Введите сумму"
          style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(120,170,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 16, marginBottom: 12, outline: "none" }} />
        <div style={{ fontSize: 14, color: "rgba(200,225,255,0.6)", marginBottom: 4 }}>Описание</div>
        <input type="text" value={rawDesc} onChange={(e) => setRawDesc(e.target.value)} placeholder="Описание траты"
          style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid rgba(120,170,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, marginBottom: 16, outline: "none" }} />
        <div style={{ fontSize: 14, color: "rgba(200,225,255,0.6)", marginBottom: 8 }}>Категория</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {allCats.map((cat) => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              style={{ padding: "8px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13,
                background: category === cat.id ? "#3b82f6" : "rgba(255,255,255,0.08)",
                color: "#fff" }}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
        <button onClick={handleAddRaw}
          style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#10b981", color: "#fff", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>
          ➕ Добавить трату
        </button>
        {error && <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: "rgba(239,68,68,0.15)", color: "#f87171", fontSize: 14 }}>{error}</div>}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a1929 0%, #0d1f33 100%)", color: "#fff", padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setScanned(null)} style={{ background: "none", border: "none", color: "#7cc1ff", fontSize: 16, cursor: "pointer" }}>← Назад</button>
        <div style={{ fontSize: 17, fontWeight: 700 }}>✅ Чек распознан</div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid rgba(120,170,255,0.1)" }}>
        <div style={{ fontSize: 14, color: "rgba(200,225,255,0.6)", marginBottom: 4 }}>Сумма</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>{scanned!.sum.toLocaleString("ru-RU")} ₽</div>
        <div style={{ fontSize: 14, color: "rgba(200,225,255,0.6)", marginTop: 12, marginBottom: 4 }}>Дата</div>
        <div style={{ fontSize: 16, color: "#fff" }}>{new Date(scanned!.date).toLocaleString("ru-RU")}</div>
      </div>

      <div style={{ fontSize: 14, color: "rgba(200,225,255,0.6)", marginBottom: 8 }}>Категория траты</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {allCats.map((cat) => (
          <button key={cat.id} onClick={() => setCategory(cat.id)}
            style={{ padding: "8px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13,
              background: category === cat.id ? "#3b82f6" : "rgba(255,255,255,0.08)",
              color: "#fff" }}>
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <button onClick={handleAdd}
        style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#10b981", color: "#fff", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>
        ➕ Добавить трату
      </button>

      {error && <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: "rgba(239,68,68,0.15)", color: "#f87171", fontSize: 14 }}>{error}</div>}
    </div>
  );
}
