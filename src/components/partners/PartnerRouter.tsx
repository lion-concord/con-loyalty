import { Suspense } from "react";
import { getPartner } from "../../partners";

interface Props {
  partnerId: string;
  onClose: () => void;
  konBalance?: number;
  onAddKon?: (amount: number) => void;
  onSpendKon?: (amount: number) => void;
}

export default function PartnerRouter({
  partnerId,
  onClose,
  konBalance,
  onAddKon,
  onSpendKon,
}: Props) {
  const partner = getPartner(partnerId);

  if (!partner) {
    return (
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          cursor: "pointer",
        }}
      >
        Партнёр не найден — нажмите, чтобы закрыть
      </div>
    );
  }

  const Component = partner.component;

  return (
    <Suspense
      fallback={
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#0a2540",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9998,
          }}
        >
          Загрузка…
        </div>
      }
    >
      <Component
        onClose={onClose}
        konBalance={konBalance}
        onAddKon={onAddKon}
        onSpendKon={onSpendKon}
      />
    </Suspense>
  );
}
