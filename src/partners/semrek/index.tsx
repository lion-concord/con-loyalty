import SemrekApp from "./SemrekApp";

export interface PartnerModuleProps {
  onClose: () => void;
  konBalance?: number;
  onAddKon?: (amount: number) => void;
  partnerCardBalance?: number;
  onAddPartnerCashback?: (amount: number) => void;
  onSpendPartnerCashback?: (amount: number) => void;
}

export default function PartnerModule({
  onClose,
  konBalance,
  onAddKon,
  partnerCardBalance,
  onAddPartnerCashback,
  onSpendPartnerCashback,
}: PartnerModuleProps) {
  return (
    <SemrekApp
      onClose={onClose}
      konBalance={konBalance}
      onAddKon={onAddKon}
      partnerCardBalance={partnerCardBalance}
      onAddPartnerCashback={onAddPartnerCashback}
      onSpendPartnerCashback={onSpendPartnerCashback}
    />
  );
}
