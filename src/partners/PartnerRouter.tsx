import type { PartnerModuleProps } from "./_shared/types";
import SemrekModule from "./semrek";

interface PartnerRouterProps extends PartnerModuleProps {
  module: string;
}

export default function PartnerRouter({
  module,
  onClose,
  konBalance,
  onAddKon,
  onSpendKon,
}: PartnerRouterProps) {
  if (module === "semrek") {
    return (
      <SemrekModule
        onClose={onClose}
        konBalance={konBalance}
        onAddKon={onAddKon}
        onSpendKon={onSpendKon}
      />
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <p>Модуль "{module}" не найден</p>
      <button onClick={onClose}>Назад</button>
    </div>
  );
}
