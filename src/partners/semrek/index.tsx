import type { PartnerModuleProps } from "../_shared/types";
import SemrekApp from "./SemrekApp";

export default function SemrekModule({
  onClose,
  konBalance,
  onAddKon,
  onSpendKon,
}: PartnerModuleProps) {
  return (
    <SemrekApp
      onClose={onClose}
      konBalance={konBalance}
      onAddKon={onAddKon}
      onSpendKon={onSpendKon}
    />
  );
}
