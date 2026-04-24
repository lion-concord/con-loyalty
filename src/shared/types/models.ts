export interface User {
  id: string;
  name: string;
  phone: string;
  level: string;
  konBalance: number;
  qrValue: string;
}

export interface Partner {
  id: string;
  title: string;
  subtitle: string;
  category?: string;
  accentColor?: string;
  bgColor?: string;
  badge?: string;
  enabled?: boolean;
  hasModule?: boolean;
}

export interface Tx {
  id: string;
  title: string;
  type: "accrual" | "redemption" | "cashback" | "purchase";
  amount: number;
  createdAt: string;
}

export interface Level {
  id: string;
  title: string;
  minPoints: number;
  cashbackPercent: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  priceKon: number;
  image?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
}
