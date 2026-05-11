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
