import { useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { useBudgets } from "./hooks/useBudgets";
import { useCustomCategories } from "./hooks/useCustomCategories";
import { useGoals } from "./hooks/useGoals";
import HomeScreen from "./screens/HomeScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import AddTransactionScreen from "./screens/AddTransactionScreen";
import BudgetsScreen from "./screens/BudgetsScreen";
import GoalsScreen from "./screens/GoalsScreen";
import StatsScreen from "./screens/StatsScreen";
import ScanReceiptScreen from "./screens/ScanReceiptScreen";

type WalletScreen = "home" | "transactions" | "add" | "budgets" | "goals" | "stats" | "scan";

export default function WalletApp() {
  const [screen, setScreen] = useState<WalletScreen>("home");
  const { transactions, addTransaction, deleteTransaction, balance, savings, setSavings } = useWallet();
  const { budgets, setBudget, updateSpent, deleteBudget } = useBudgets();
  const { goals, addGoal, addToGoal, deleteGoal } = useGoals();
  const { customCategories, addCategory, removeCategory, COLORS, ICONS } = useCustomCategories();

  const handleSave = (type: "expense" | "income", amount: number, category: string, description: string, isSavingsIncome?: boolean, isSavingsExpense?: boolean) => {
    addTransaction(type, amount, category, description, isSavingsIncome, isSavingsExpense);
    updateSpent(category, amount);
    setScreen("home");
  };

  const handleDelete = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (tx) {
      updateSpent(tx.category, -tx.amount);
    }
    deleteTransaction(id);
  };

  switch (screen) {
    case "transactions":
      return <TransactionsScreen transactions={transactions} onDelete={handleDelete} onBack={() => setScreen("home")} customCategories={customCategories} />;
    case "add":
      return (
        <AddTransactionScreen
          onBack={() => setScreen("home")}
          onSave={handleSave}
          customCategories={customCategories}
          onAddCategory={addCategory}
          onRemoveCategory={removeCategory}
          availableColors={COLORS}
          availableIcons={ICONS}
          savings={savings}
          setSavings={setSavings}
        />
      );
    case "budgets":
      return <BudgetsScreen budgets={budgets} setBudget={setBudget} deleteBudget={deleteBudget} customCategories={customCategories} onBack={() => setScreen("home")} />;
    case "goals":
      return <GoalsScreen onBack={() => setScreen("home")} />;
    case "stats":
      return <StatsScreen onBack={() => setScreen("home")} />;
    case "scan":
      return <ScanReceiptScreen customCategories={customCategories} onAddTransaction={handleSave} onBack={() => setScreen("home")} />;
    default:
      return (
        <HomeScreen
          onAdd={() => setScreen("add")}
          customCategories={customCategories}
          onTransactions={() => setScreen("transactions")}
          onBudgets={() => setScreen("budgets")}
          onGoals={() => setScreen("goals")}
          balance={balance}
          savings={savings}
          goals={goals}
          budgets={budgets}
          onStats={() => setScreen("stats")}
          onScanReceipt={() => setScreen("scan")}
        />
      );
  }
}
