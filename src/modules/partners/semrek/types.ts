export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export type SemrekScreen = "home" | "catalog" | "product" | "cart" | "checkout" | "success";

export interface PartnerModuleProps {
  onBack?: () => void;
  konBalance?: number;
  onAddKon?: (amount: number) => void;
  onSpendKon?: (amount: number) => void;
}

// Партнёрская карта с кешбэком в рублях
export interface PartnerCard {
  partnerId: string;           // "semrek"
  partnerName: string;         // "Семь рек"
  cashbackPercent: number;     // 3
  cashbackBalance: number;     // в рублях (₽)
  qrCode: string;              // userId-partnerId
  gradient: [string, string];  // ['#2a6fd6', '#3dbde0']
  icon: string;                // '🚤'
  history: CashbackTransaction[];
}

// Транзакция кешбэка (в рублях)
export interface CashbackTransaction {
  id: string;
  date: string;                // ISO 8601
  type: 'earn' | 'spend';
  amount: number;              // в рублях (₽)
  orderId?: string;
  description: string;
}
