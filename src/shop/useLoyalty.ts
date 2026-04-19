"use client";

import { useState, useEffect, useCallback } from "react";
import type { LoyaltyState, Transaction, LoyaltyLevel } from "./types";
import { LEVELS } from "./products";

const STORAGE_KEY = "kon-coffee-loyalty-v1";
const WELCOME_BONUS = 100;

const initialState: LoyaltyState = {
  balanceKon: WELCOME_BONUS,
  totalSpentKon: 0,
  transactions: [
    {
      id: "welcome",
      type: "bonus",
      amountKon: WELCOME_BONUS,
      paidWith: "kon",
      timestamp: Date.now(),
    },
  ],
  level: "bronze",
};

function calcLevel(totalSpent: number): LoyaltyLevel {
  const sorted = [...LEVELS].sort((a, b) => b.threshold - a.threshold);
  for (const lvl of sorted) {
    if (totalSpent >= lvl.threshold) return lvl.id;
  }
  return "bronze";
}

function getLevelInfo(level: LoyaltyLevel) {
  return LEVELS.find((l) => l.id === level) ?? LEVELS[0];
}

function getNextLevelInfo(level: LoyaltyLevel) {
  const idx = LEVELS.findIndex((l) => l.id === level);
  return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function useLoyalty() {
  const [state, setState] = useState<LoyaltyState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  // Загрузка из localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LoyaltyState;
        setState(parsed);
      }
    } catch (e) {
      console.error("Failed to load loyalty state", e);
    }
    setHydrated(true);
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save loyalty state", e);
    }
  }, [state, hydrated]);

  const levelInfo = getLevelInfo(state.level);
  const nextLevelInfo = getNextLevelInfo(state.level);

  const progressToNext = nextLevelInfo
    ? Math.min(
        100,
        ((state.totalSpentKon - levelInfo.threshold) /
          (nextLevelInfo.threshold - levelInfo.threshold)) *
          100
      )
    : 100;

  const konToNext = nextLevelInfo
    ? Math.max(0, nextLevelInfo.threshold - state.totalSpentKon)
    : 0;

  // Покупка товара
  const purchase = useCallback(
    (params: {
      productName: string;
      priceRub: number;
      priceKon: number;
      paidWith: "rub" | "kon";
    }): { success: boolean; cashback: number; error?: string } => {
      const { productName, priceRub, priceKon, paidWith } = params;

      // Проверка баланса при оплате КОН
      if (paidWith === "kon" && state.balanceKon < priceKon) {
        return {
          success: false,
          cashback: 0,
          error: "Недостаточно КОН на балансе",
        };
      }

      const cashback = +(priceKon * (levelInfo.cashbackPct / 100)).toFixed(2);
      const now = Date.now();

      const purchaseTx: Transaction = {
        id: `p-${now}`,
        type: "purchase",
        productName,
        amountRub: priceRub,
        amountKon: priceKon,
        paidWith,
        timestamp: now,
      };

      const cashbackTx: Transaction = {
        id: `c-${now}`,
        type: "cashback",
        productName,
        amountKon: cashback,
        paidWith: "kon",
        timestamp: now + 1,
      };

      setState((prev) => {
        const newBalance =
          paidWith === "kon"
            ? prev.balanceKon - priceKon + cashback
            : prev.balanceKon + cashback;

        const newTotalSpent = prev.totalSpentKon + priceKon;
const newLevel = calcLevel(newTotalSpent);

        return {
          ...prev,
          balanceKon: +newBalance.toFixed(2),
          totalSpentKon: +newTotalSpent.toFixed(2),
          level: newLevel,
          transactions: [cashbackTx, purchaseTx, ...prev.transactions].slice(
            0,
            50
          ),
        };
      });

      return { success: true, cashback };
    },
    [state.balanceKon, levelInfo.cashbackPct]
  );

  // Сброс демо-данных
  const reset = useCallback(() => {
    setState({
      ...initialState,
      transactions: [
        {
          id: `welcome-${Date.now()}`,
          type: "bonus",
          amountKon: WELCOME_BONUS,
          paidWith: "kon",
          timestamp: Date.now(),
        },
      ],
    });
  }, []);

  return {
    state,
    hydrated,
    levelInfo,
    nextLevelInfo,
    progressToNext,
    konToNext,
    purchase,
    reset,
  };
}
