import { useState, useEffect, useCallback } from "react";
import type { Budget } from "../types";

const STORAGE_KEY = "kon-wallet-budgets";

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setBudgets(JSON.parse(stored));
  }, []);

  const save = useCallback((list: Budget[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setBudgets(list);
  }, []);

  const setBudget = useCallback((category: string, limit: number) => {
    const month = getCurrentMonth();
    const existing = budgets.find((b) => b.category === category && b.month === month);

    if (existing) {
      save(budgets.map((b) => (b.category === category && b.month === month ? { ...b, limit } : b)));
    } else {
      save([...budgets, { category, limit, spent: 0, month }]);
    }
  }, [budgets, save]);

  const updateSpent = useCallback((category: string, amount: number) => {
    const month = getCurrentMonth();
    save(budgets.map((b) => {
      if (b.category === category && b.month === month) {
        return { ...b, spent: b.spent + amount };
      }
      return b;
    }));
  }, [budgets, save]);

  const currentMonthBudgets = budgets.filter((b) => b.month === getCurrentMonth());

  return { budgets: currentMonthBudgets, setBudget, updateSpent };
}
