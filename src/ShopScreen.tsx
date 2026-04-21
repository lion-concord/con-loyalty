import { useState } from "react";
import { useLoyalty } from "./shop/useLoyalty";
import { PRODUCTS } from "./shop/products";
import type { Product } from "./shop/types";
import ShopBanner from "./components/shop/ShopBanner";
import { LoyaltyCardPremium } from "./components/shop/LoyaltyCardPremium";
import ProductGrid from "./components/shop/ProductGrid";

type Props = {
  onClose?: () => void;
};

export function ShopScreen({ onClose }: Props) {
  const {
    state,
    hydrated,
    levelInfo,
    nextLevelInfo,
    progressToNext,
    konToNext,
    purchase,
  } = useLoyalty();

  const [toast, setToast] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleBuy = (product: Product, paidWith: "rub" | "kon") => {
    alert("[SHOP] handleBuy: " + product.name + " / " + paidWith);
    try {
      const result = purchase({
        productName: product.name,
        priceRub: product.priceRub,
        priceKon: product.priceKon,
        paidWith,
      });
      alert("[SHOP] result: " + JSON.stringify(result));
      setSelectedProduct(null);
      if (result.success) {
        showToast("✅ Kуплено: " + product.name + " +" + result.cashback.toFixed(1) + " KОН кешбэк");
      } else {
        showToast("⚠️ " + (result.error || "Ошибка покупки"));
      }
    } catch (e) {
      const msg = (e && (e as any).message) ? (e as any).message : String(e);
      alert("[SHOP] ERROR: " + msg);
    }
  };

  const handleProductClick = (product: Product) => { alert("[SHOP] open modal: " + product.name);
    setSelectedProduct(product);
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Загрузка магазина...</div>
      </div>
    );
  }

  const canPayKon = selectedProduct
    ? state.balanceKon >= selectedProduct.priceKon
    : false;

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {onClose && (
        <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 px-4 py-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm text-slate-300 active:scale-95 transition-transform"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Назад
          </button>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <ShopBanner levelInfo={levelInfo} />

        <LoyaltyCardPremium />

        <div className="flex items-center justify-between pt-2">
          <h2 className="text-lg font-bold text-white">Меню</h2>
          <span className="text-xs text-slate-400">
            {PRODUCTS.length} позиций
          </span>
        </div>

        <ProductGrid
          products={PRODUCTS}
          cashbackPct={levelInfo.cashbackPct}
          onProductClick={handleProductClick}
        />

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🧪</div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">
                Тестовый режим
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Это демо-версия магазина. Покупки не списывают настоящие деньги.
              </div>
</div>
          </div>
        </div>
      </div>

      {}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 480,
              background: "linear-gradient(135deg, #1a1210, #0f0a08)",
              borderRadius: "20px 20px 0 0",
              padding: 20,
              border: "1px solid rgba(249,115,22,0.2)",
              boxShadow: "0 -20px 60px rgba(0,0,0,0.7)",
              color: "#fef3e2",
            }}
          >
            <div style={{
              width: 40, height: 4, background: "rgba(255,255,255,0.2)",
              borderRadius: 2, margin: "0 auto 16px",
            }} />

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: selectedProduct.gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, flexShrink: 0,
              }}>
                {selectedProduct.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>
                  {selectedProduct.name}
                </div>
                <div style={{ fontSize: 11, color: "#a8927b", marginTop: 2 }}>
                  {selectedProduct.description}
                </div>
              </div>
            </div>

            <div style={{
              padding: 12, borderRadius: 10,
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.2)",
              marginBottom: 14, fontSize: 12,
            }}>
              Ваш баланс: <b>{state.balanceKon.toFixed(2)} КОН</b>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, opacity: 0.8 }}>
              Выберите способ оплаты:
            </div>

            <button
              onClick={() => handleBuy(selectedProduct, "rub")}
              style={{
                width: "100%", padding: 14, borderRadius: 12,
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                border: "none", color: "#fff",
                fontWeight: 800, fontSize: 15,
                marginBottom: 8, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: "0 4px 16px -4px rgba(249,115,22,0.6)",
              }}
            >
              <span>Оплатить рублями</span>
              <span>{selectedProduct.priceRub} ₽</span>
            </button>

            <button
              onClick={() => canPayKon && handleBuy(selectedProduct, "kon")}
              disabled={!canPayKon}
              style={{
                width: "100%", padding: 14, borderRadius: 12,
                background: canPayKon
                  ? "linear-gradient(135deg, #fbbf24, #d97706)"
                  : "rgba(255,255,255,0.08)",
                border: canPayKon
                  ? "none"
                  : "1px solid rgba(255,255,255,0.15)",
                color: canPayKon ? "#1a1210" : "#555",
                fontWeight: 800, fontSize: 15,
                marginBottom: 8,
                cursor: canPayKon ? "pointer" : "not-allowed",
display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: canPayKon ? "0 4px 16px -4px rgba(251,191,36,0.6)" : "none",
              }}
            >
              <span>Оплатить баллами {canPayKon ? "⭐" : ""}</span>
              <span>{selectedProduct.priceKon} КОН {!canPayKon && "(недостаточно)"}</span>
            </button>

            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                width: "100%", padding: 12, borderRadius: 12,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#a8927b", fontWeight: 600, fontSize: 13,
                cursor: "pointer",
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {}
      {toast && (
        <div style={{
          position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
          zIndex: 10000,
          padding: "12px 20px", borderRadius: 12,
          background: "rgba(26,18,16,0.95)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(249,115,22,0.3)",
          color: "#fef3e2", fontSize: 13, fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          maxWidth: "90%", textAlign: "center",
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}

export default ShopScreen;
