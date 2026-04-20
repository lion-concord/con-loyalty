"use client";

import { useCallback, useSyncExternalStore } from "react";
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
      amountKon: WELCOME BONUS,
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

let currentState: LoyaltyState = initialState;
let hydrated = false;
const listeners = new Set<() => void>();

function loadFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      currentState = JSON.parse(raw) as LoyaltyState;
    }
  } catch (e) {
    console.error("Failed to load loyalty state", e);
  }
  hydrated = true;
  emit();
}

function saveToStorage() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  } catch (e) {
    console.error("Failed to save loyalty state", e);
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentState;
}

function getHydratedSnapshot() {
  return hydrated;
}

function setState(updater: (prev: LoyaltyState) => LoyaltyState) {
  currentState = updater(currentState);
  saveToStorage();
  emit();
}

// Инициализация при загрузке модуля (один раз)
if (typeof window !== "undefined") {
  loadFromStorage();
  // Синхронизация между вкладками (на всякий случай)
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        currentState = JSON.parse(e.newValue);
        emit();
      } catch {}
    }
  });
}

export function useLoyalty() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const isHydrated = useSyncExternalStore(
    subscribe,
    getHydratedSnapshot,
    getHydratedSnapshot
  );

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

  const purchase = useCallback(
    (params: {
      productName: string;
      priceRub: number;
      priceKon: number;
      paidWith: "rub" | "kon";
    }): { success: boolean; cashback: number; error?: string } => {
      const { productName, priceRub, priceKon, paidWith } = params;

      if (paidWith === "kon" && currentState.balanceKon < priceKon) {
        return {
          success: false,
          cashback: 0,
          error: "Недостаточно КОН на балансе",
        };
      }

      const currentLevelInfo = getLevelInfo(currentState.level);
      const cashback = +(
        priceKon *
        (currentLevelInfo.cashbackPct / 100)
      ).toFixed(2);
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
    []
  );

  const reset = useCallback(() => {
    setState(() => ({
      ...initialState,
      transactions: [
        {
          id: "welcome-" + Date.now(),
          type: "bonus",
          amountKon: WELCOME BONUS,
          paidWith: "kon",
          timestamp: Date.now(),
        },
      ],
    }));
  }, []);

  return {
    state,
    hydrated: isHydrated,
    levelInfo,
    nextLevelInfo,
    progressToNext,
    konToNext,
    purchase,
    reset,
  };
}
