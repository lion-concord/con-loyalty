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
    reset,
  } = useLoyalty();

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleBuy = (product: Product, paidWith: "rub" | "kon") => {
    const result = purchase({
      productName: product.name,
      priceRub: product.priceRub,
      priceKon: product.priceKon,
      paidWith,
    });

    if (result.success) {
      showToast(
        `✅ Куплено: ${product.name} – +${result.cashback.toFixed(1)} КОН кешбэк`
      );
    } else {
      showToast(`⚠️ ${result.error ?? "Ошибка покупки"}`);
    }
  };

  const handleProductClick = (product: Product) => {
    const useKon = state.balanceKon >= product.priceKon;
    const payMethod = confirm(
      `Купить «${product.name}»?\n\n` +
        `Цена: ${product.priceRub} ₽ или ${product.priceKon} КОН\n` +
        `Ваш баланс: ${state.balanceKon.toFixed(2)} КОН\n\n` +
        `OK — оплатить баллами КОН${!useKon ? " (недостаточно баллов)" : ""}\n` +
        `Отмена — оплатить рублями ₽`
    );
    handleBuy(product, payMethod ? "kon" : "rub");
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Загрузка магазина...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {}
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

        <LoyaltyCardPremium
balanceKon={state.balanceKon}
          levelInfo={levelInfo}
          nextLevelInfo={nextLevelInfo}
          progressToNext={progressToNext}
          konToNext={konToNext}
        />

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
                Демо-режим
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Все покупки виртуальные. Баланс и история хранятся локально.
              </p>
              <button
                onClick={() => {
                  if (confirm("Сбросить демо-баланс и историю?")) {
                    reset();
                    showToast("🔄 Демо-данные сброшены");
                  }
                }}
                className="mt-3 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 active:scale-95 transition-transform"
              >
                Сбросить демо-данные
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-4">
          КОН Coffee · Демо-версия · v1.0
        </div>
      </div>

      {}
      {toast && (
        <div className="fixed left-1/2 bottom-6 -translate-x-1/2 z-50 bg-slate-800 border border-slate-700 text-white text-sm px-4 py-2.5 rounded-full shadow-lg max-w-[90vw]">
          {toast}
        </div>
      )}
    </div>
  );
}
