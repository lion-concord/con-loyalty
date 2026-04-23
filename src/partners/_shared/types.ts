import type { LazyExoticComponent, ComponentType } from "react";

export interface PartnerModuleProps {
  onClose: () => void;
  onBack?: (canGoBack: boolean, goBack: () => void) => void;
  konBalance?: number;
  onAddKon?: (amount: number) => void;
  onSpendKon?: (amount: number) => void;
}

export interface Partner {
  id: string;
  title: string;
  subtitle: string;
  accentColor: string;
  bgColor: string;
  badge?: string;
  footnote?: string;
  enabled: boolean;
  component: LazyExoticComponent<ComponentType<PartnerModuleProps>>;
}
