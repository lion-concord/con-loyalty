import { useState } from "react";
import { useWallet } from "./hooks/useWallet";
import HomeScreen from "./screens/HomeScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import AddTransactionScreen from "./screens/AddTransactionScreen";
import BudgetsScreen from "./screens/BudgetsScreen";
import GoalsScreen from "./screens/GoalsScreen";
import StatsScreen from "./screens/StatsScreen";

type WalletScreen = "home" | "transactions" | "add" | "budgets" | "goals" | "stats";

export default function WalletApp() {
  const [screen, setScreen] = useState<WalletScreen>("home");
  const { addTransaction } = useWallet();

  switch (screen) {
    case "transactions":
      return <TransactionsScreen onBack={() => setScreen("home")} />;
    case "add":
      return <AddTransactionScreen onBack={() => setScreen("home")} onSave={addTransaction} />;
    case "budgets":
      return <BudgetsScreen onBack={() => setScreen("home")} />;
    case "goals":
      return <GoalsScreen onBack={() => setScreen("home")} />;
    case "stats":
      return <StatsScreen onBack={() => setScreen("home")} />;
    default:
      return (
        <HomeScreen
          onAdd={() => setScreen("add")}
          onTransactions={() => setScreen("transactions")}
          onBudgets={() => setScreen("budgets")}
          onGoals={() => setScreen("goals")}
          onStats={() => setScreen("stats")}
        />
      );
  }
}