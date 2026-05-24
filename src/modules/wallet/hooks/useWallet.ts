import { useState, useEffect, useCallback } from "react";
import type { Transaction, TransactionType } from "../types";

const STORAGE_KEY = "kon-wallet-transactions";

export function useWallet() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setTransactions(JSON.parse(stored));
  }, []);

  const save = useCallback((list: Transaction[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setTransactions(list);
  }, []);

  const addTransaction = useCallback((type: TransactionType, amount: number, category: string, description: string) => {
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type,
      amount,
      category,
      description: description.trim(),
      date: new Date().toISOString(),
      createdAt: Date.now(),
    };
    save([tx, ...transactions]);
  }, [transactions, save]);

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
  };
}
