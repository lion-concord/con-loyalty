export interface Product {
  id: string;
  category: "boat" | "motor" | "accessory";
  name: string;
  description: string;
  price: number;
  image: string;
  specs: Record<string, string>;
  inStock: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  image: string;
  duration: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface OrderInfo {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  deliveryType: "pickup" | "transport" | "courier";
  paymentType: "card" | "cash" | "sbp";
  comment?: string;
}

export type SemrekScreen =
  | "home"
  | "catalog"
  | "product"
  | "services"
  | "cart"
  | "checkout"
  | "delivery"
  | "about";
