import { useState, useEffect, useCallback } from "react";
import type { CustomCategory } from "../types";

const STORAGE_KEY = "kon-wallet-custom-categories";

const COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
  "#ec4899", "#f43f5e", "#14b8a6", "#0ea5e9",
];

const ICONS = [
  "🍔", "🚗", "🏠", "💊", "🎮", "👕", "📱", "🎓", "💼", "💸",
  "🎁", "📈", "🍕", "☕", "🐕", "🐈", "✈️", "🚲", "🛒", "🎬",
  "🎵", "📚", "🏋️", "🧘", "🎨", "🔧", "💻", "📺", "🌿", "⚡",
];

export function useCustomCategories() {
  const [custom, setCustom] = useState<CustomCategory[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setCustom(JSON.parse(stored));
  }, []);

  const save = useCallback((list: CustomCategory[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setCustom(list);
  }, []);

  const addCategory = useCallback((name: string, icon: string, type: "income" | "expense") => {
    const id = `custom-${Date.now()}`;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newCat: CustomCategory = { id, name, icon, color, type };
    save([...custom, newCat]);
    return id;
  }, [custom, save]);

  const removeCategory = useCallback((id: string) => {
    save(custom.filter((c) => c.id !== id));
  }, [custom, save]);

  return { customCategories: custom, addCategory, removeCategory, COLORS, ICONS };
}
