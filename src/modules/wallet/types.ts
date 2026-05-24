export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO
  createdAt: number;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
  month: string; // YYYY-MM
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
  deadline?: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface CustomCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export const INCOME_CATEGORIES: CategoryConfig[] = [
  { id: "salary", name: "Зарплата", icon: "💼", color: "#10b981", type: "income" },
  { id: "freelance", name: "Подработка", icon: "💸", color: "#34d399", type: "income" },
  { id: "gifts", name: "Подарки", icon: "🎁", color: "#f472b6", type: "income" },
  { id: "investments", name: "Инвестиции", icon: "📈", color: "#8b5cf6", type: "income" },
];

export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { id: "food", name: "Продукты", icon: "🍔", color: "#ef4444", type: "expense" },
  { id: "transport", name: "Транспорт", icon: "🚗", color: "#f97316", type: "expense" },
  { id: "housing", name: "Жильё", icon: "🏠", color: "#3b82f6", type: "expense" },
  { id: "health", name: "Здоровье", icon: "💊", color: "#ec4899", type: "expense" },
  { id: "entertainment", name: "Развлечения", icon: "🎮", color: "#a855f7", type: "expense" },
  { id: "clothes", name: "Одежда", icon: "👕", color: "#06b6d4", type: "expense" },
  { id: "mobile", name: "Связь", icon: "📱", color: "#6366f1", type: "expense" },
  { id: "education", name: "Образование", icon: "🎓", color: "#14b8a6", type: "expense" },
];

export const DEFAULT_INCOME = INCOME_CATEGORIES;
export const DEFAULT_EXPENSE = EXPENSE_CATEGORIES;

export function getAllCategories(custom: CustomCategory[] = []): CategoryConfig[] {
  return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES, ...custom];
}

export function getCategoryById(id: string, custom: CustomCategory[] = []): CategoryConfig | undefined {
  return getAllCategories(custom).find((c) => c.id === id);
}

export function getCategoriesByType(type: TransactionType, custom: CustomCategory[] = []): CategoryConfig[] {
  return getAllCategories(custom).filter((c) => c.type === type);
}
