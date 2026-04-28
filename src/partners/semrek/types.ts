export type SemrekScreen = "home" | "catalog" | "builder" | "delivery" | "checkout";

export interface Boat {
  id: string;
  name: string;
  length: number;       // метры
  capacity: number;     // человек
  maxMotor: number;     // л.с.
  weight: number;       // кг
  price: number;        // ₽
  emoji: string;        // визуальный плейсхолдер
  tag?: string;         // "Хит", "Новинка" и т.д.
  image?: string;       // путь к изображению
}

export type BuilderStep = 0 | 1 | 2 | 3 | 4 | 5;

export interface BuilderState {
  step: BuilderStep;
  length: number | null;     // 3.0 / 3.3 / 3.6 / 4.0
  color: string | null;      // "grey" | "khaki" | "black" | "blue"
  motor: number | null;      // 0 / 5 / 9.9 / 15
  floor: string | null;      // "none" | "aluminium" | "plywood"
  extras: string[];          // ["oars", "pump", "anchor", "tent"]
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
  pointsUsed: number;        // сколько баллов применили (не больше 50% от суммы)
  subtotal: number;          // стоимость заказа без баллов
  total: number;             // к оплате после применения баллов
  cashback: number;          // начисляется после заказа
}

export type PaymentMethod = "card" | "sbp" | "installment" | "invoice";

export interface OrderResult {
  id: string;
  boatName: string;
  delivery: DeliveryInfo;
  paymentMethod: PaymentMethod;
  paymentLabel: string;
  totalPrice: number;
  konUsed: number;
  finalPrice: number;
  cashback: number;
}
