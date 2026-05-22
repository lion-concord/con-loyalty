import { useState, useEffect, useCallback } from "react";
import type { Goal } from "../types";

const STORAGE_KEY = "kon-wallet-goals";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setGoals(JSON.parse(stored));
  }, []);

  const save = useCallback((list: Goal[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setGoals(list);
  }, []);

  const addGoal = useCallback((name: string, targetAmount: number, icon: string, color: string, deadline?: string) => {
    const goal: Goal = {
      id: `goal-${Date.now()}`,
      name,
      targetAmount,
      currentAmount: 0,
      icon,
      color,
      deadline,
    };
    save([...goals, goal]);
  }, [goals, save]);

  const addToGoal = useCallback((id: string, amount: number) => {
    save(goals.map((g) => (g.id === id ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) } : g)));
  }, [goals, save]);

  const deleteGoal = useCallback((id: string) => {
    save(goals.filter((g) => g.id !== id));
  }, [goals, save]);

  return { goals, addGoal, addToGoal, deleteGoal };
}
