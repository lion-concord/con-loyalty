import { useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { useBudgets } from "./hooks/useBudgets";
import { useCustomCategories } from "./hooks/useCustomCategories";
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
  const { transactions, addTransaction, deleteTransaction } = useWallet();
  const { budgets, setBudget, updateSpent } = useBudgets();
  const { customCategories, addCategory, removeCategory, COLORS, ICONS } = useCustomCategories();

  const handleSave = (type: "expense" | "income", amount: number, category: string, description: string) => {
    addTransaction(type, amount, category, description);
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
        />
      );
    case "budgets":
      return <BudgetsScreen budgets={budgets} setBudget={setBudget} customCategories={customCategories} onBack={() => setScreen("home")} />;
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
          onStats={() => setScreen("stats")}
          onScanReceipt={() => setScreen("scan")}
        />
      );
  }
}
