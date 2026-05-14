import { companyInfo, products, services } from "../data/store";

interface Props {
  konBalance?: number;
  cartCount?: number;
  onOpenCatalog: (category?: string) => void;
  onOpenServices: () => void;
  onOpenAbout: () => void;
  onOpenCart: () => void;
  onOpenCard: () => void;
  onClose?: () => void;
}

export default function HomeScreen({
  konBalance = 0,
  cartCount = 0,
  onOpenCatalog,
  onOpenServices,
  onOpenAbout,
  onOpenCart,
  onOpenCard,
  onClose,
}: Props) {
  return (
    <div className="sr-home">
      <header className="sr-header">
        <button className="sr-header__back" onClick={onClose}>←</button>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onOpenCard} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "6px 12px", color: "#fff", fontSize: 12 }}>💳 Карта</button>
          <button onClick={onOpenCart} style={{ background: "rgba(42,111,214,0.3)", border: "none", borderRadius: 8, padding: "6px 12px", color: "#fff", fontSize: 12 }}>🛒 {cartCount}</button>
        </div>
      </header>
      {}
    </div>
  );
}
