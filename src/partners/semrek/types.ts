export type SemrekScreen = "home" | "catalog" | "builder" | "delivery" | "checkout";

export interface Boat {
  id: string;
  name: string;
  length: number;
  capacity: number;
  maxMotor: number;
  weight: number;
  price: number;
  emoji: string;
  tag?: string;
  image?: string;
}

export type BuilderStep = 0 | 1 | 2 | 3 | 4 | 5;

export interface BuilderState {
  step: BuilderStep;
  length: number | null;
  color: string | null;
  motor: number | null;
  floor: string | null;
  extras: string[];
}

export interface DeliveryInfo {
  region: string;
  method: "pickup" | "courier" | "transport";
  address?: string;
  cost: number;
}

export type OrderSource =
  | { kind: "catalog"; boat: Boat }
  | { kind: "builder"; config: BuilderState; price: number; name: string };

export interface OrderDraft {
  source: OrderSource;
  delivery: DeliveryInfo;
  subtotal: number;
  total: number;
  konEarned: number;
  partnerCashbackUsed: number;
  partnerCashbackEarned: number;
}

export type PaymentMethod = "card" | "sbp" | "installment" | "invoice";

export interface OrderResult {
  id: string;
  boatName: string;
  delivery: DeliveryInfo;
  paymentMethod: PaymentMethod;
  paymentLabel: string;
  totalPrice: number;
  partnerCashbackUsed: number;
  finalPrice: number;
  konEarned: number;
  partnerCashbackEarned: number;
}
