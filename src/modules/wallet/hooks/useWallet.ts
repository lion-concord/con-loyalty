import { useState, useEffect, useCallback } from "react";
import type { Transaction, TransactionType } from "../types";

const STORAGE_KEY = "kon-wallet-transactions";
const SAVINGS_KEY = "kon-wallet-savings";

export function useWallet() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savings, setSavings] = useState<number>(() => {
    const s = localStorage.getItem(SAVINGS_KEY);
    return s ? parseFloat(s) : 0;
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setTransactions(JSON.parse(stored));
  }, []);

  const save = useCallback((list: Transaction[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setTransactions(list);
  }, []);

  const saveSavings = useCallback((val: number) => {
    localStorage.setItem(SAVINGS_KEY, String(val));
    setSavings(val);
  }, []);

  const addTransaction = useCallback((type: TransactionType, amount: number, category: string, description: string, isSavingsIncome = false, isSavingsExpense = false) => {
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type,
      amount,
      category,
      description: description.trim(),
      date: new Date().toISOString(),
      createdAt: Date.now(),
      isSavingsIncome,
      isSavingsExpense,
    };
    const next = [tx, ...transactions];
    save(next);
    if (isSavingsIncome) saveSavings(savings + amount);
    if (isSavingsExpense) saveSavings(Math.max(0, savings - amount));
  }, [transactions, save, savings, saveSavings]);

  const deleteTransaction = useCallback((id: string) => {
    save(transactions.filter((t) => t.id !== id));
  }, [transactions, save]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const recent = transactions.slice(0, 5);

  return {
    transactions,
    recent,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance,
    savings,
    setSavings: saveSavings,
  };
}
