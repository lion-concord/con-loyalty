import type { ComponentType, LazyExoticComponent } from "react";

export interface PartnerModuleProps {
  onClose: () => void;
  konBalance?: number;
  onAddKon?: (amount: number) => void;
  partnerCardBalance?: number;
  onAddPartnerCashback?: (amount: number) => void;
  onSpendPartnerCashback?: (amount: number) => void;
}

export interface Partner {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  badge?: string;
  footnote?: string;
  accentColor?: string;
  bgColor?: string;
  enabled: boolean;
  component:
    | ComponentType<PartnerModuleProps>
    | LazyExoticComponent<ComponentType<PartnerModuleProps>>;
}
