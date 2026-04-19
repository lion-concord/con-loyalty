export type Category = "coffee" | "tea" | "desserts" | "bakery" | "food";

export type Product = {
  id: string;
  name: string;
  description: string;
  priceRub: number;
  priceKon: number;
  category: Category;
  emoji: string;
  gradient: string;
};

export type LoyaltyLevel = "bronze" | "silver" | "gold" | "platinum";

export type LevelInfo = {
  id: LoyaltyLevel;
  name: string;
  cashbackPct: number;
  threshold: number;
  color: string;
  emoji: string;
};

export type Transaction = {
  id: string;
  type: "purchase" | "cashback" | "bonus";
  productName?: string;
  amountRub?: number;
  amountKon: number;
  paidWith: "rub" | "kon";
  timestamp: number;
};

export type LoyaltyState = {
  balanceKon: number;
  totalSpentKon: number;
  transactions: Transaction[];
  level: LoyaltyLevel;
};
