import SemrekApp from "../../modules/partners/semrek/SemrekApp";

export interface PartnerModuleProps {
  onClose: () => void;
  konBalance?: number;
  onAddKon?: (amount: number) => void;
  partnerCardBalance?: number;
  onAddPartnerCashback?: (amount: number) => void;
  onSpendPartnerCashback?: (amount: number) => void;
}

export default function PartnerModule(props: PartnerModuleProps) {
  return <SemrekApp {...props} />;
}
