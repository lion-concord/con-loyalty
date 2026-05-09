import { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import CatalogScreen from "./screens/CatalogScreen";
import BuilderScreen from "./screens/BuilderScreen";
import DeliveryScreen from "./screens/DeliveryScreen";
import PaymentScreen from "./screens/PaymentScreen";
import SuccessScreen from "./screens/SuccessScreen";
import type {
  Boat,
  BuilderState,
  DeliveryInfo,
  PaymentMethod,
  OrderResult,
  SemrekScreen,
} from "./types";
import "./styles/semrek.css";

interface Props {
  konBalance?: number;
  onAddKon?: (amount: number) => void;
  partnerCardBalance?: number;
  onAddPartnerCashback?: (amount: number) => void;
  onSpendPartnerCashback?: (amount: number) => void;
  onClose?: () => void;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  card: "💳 Банковская карта",
  sbp: "⚡ СБП",
  installment: "📅 Рассрочка 0-0-12",
  invoice: "🧾 Счёт для юр. лиц",
};
type Screen = SemrekScreen | "payment" | "success";

export default function SemrekApp({
  onAddKon,
  partnerCardBalance = 0,
  onAddPartnerCashback,
  onSpendPartnerCashback,
  onClose,
}: Props) {
  const [screen, setScreen] = useState<Screen>("home");
  const [boatName, setBoatName] = useState<string>("");
  const [boatPrice, setBoatPrice] = useState<number>(0);
  const [builderConfig, setBuilderConfig] = useState<BuilderState | null>(null);
  const [delivery, setDelivery] = useState<DeliveryInfo | null>(null);
  const [order, setOrder] = useState<OrderResult | null>(null);

  const totalPrice = boatPrice + (delivery?.cost || 0);

  const handleSelectBoat = (boat: Boat) => {
    setBoatName(boat.name);
    setBoatPrice(boat.price);
    setBuilderConfig(null);
    setScreen("delivery");
  };

  const handleBuilderComplete = (
    config: BuilderState,
    price: number,
    name: string
  ) => {
    setBuilderConfig(config);
    setBoatName(name);
    setBoatPrice(price);
    setScreen("delivery");
  };

  const handleDeliveryContinue = (info: DeliveryInfo) => {
    setDelivery(info);
    setScreen("payment");
  };

  const handlePay = (method: PaymentMethod, partnerCashbackUsed: number) => {
    if (!delivery) return;

    const safeUsed = Math.max(0, Math.min(partnerCashbackUsed, partnerCardBalance, totalPrice));
    const finalPrice = Math.max(0, totalPrice - safeUsed);
    const konEarned = 5;
    const partnerCashbackEarned = Math.round(finalPrice * 0.01);

    if (safeUsed > 0 && onSpendPartnerCashback) {
      onSpendPartnerCashback(safeUsed);
    }

    if (konEarned > 0 && onAddKon) {
      onAddKon(konEarned);
    }

    if (partnerCashbackEarned > 0 && onAddPartnerCashback) {
      onAddPartnerCashback(partnerCashbackEarned);
    }

    setOrder({
      id: "SMR-" + Date.now().toString().slice(-6),
      boatName,
      delivery,
      paymentMethod: method,
      paymentLabel: PAYMENT_LABELS[method],
      totalPrice,
      partnerCashbackUsed: safeUsed,
      finalPrice,
      konEarned,
      partnerCashbackEarned,
    });

    setScreen("success");
  };

  const resetAll = () => {
    setBoatName("");
    setBoatPrice(0);
    setBuilderConfig(null);
    setDelivery(null);
    setOrder(null);
    setScreen("home");
  };

  const goBack = () => {
    if (screen === "catalog" || screen === "builder") setScreen("home");
    else if (screen === "delivery") setScreen(builderConfig ? "builder" : "catalog");
    else if (screen === "payment") setScreen("delivery");
    else setScreen("home");
  };

  return (
    <div className="sem">
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "rgba(10,37,64,0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        {screen !== "home" && screen !== "success" ? (
          <button className="sem-btn sem-btn--ghost" onClick={goBack}>
            ← Назад
          </button>
        ) : (
          <span />
        )}

        {onClose && (
          <button className="sem-btn sem-btn--ghost" onClick={onClose}>
            ✕ Закрыть
          </button>
        )}
      </div>

      <div className="sem__content">
        {screen === "home" && <HomeScreen onNavigate={(s) => setScreen(s)} />}

        {screen === "catalog" && <CatalogScreen onSelectBoat={handleSelectBoat} />}

        {screen === "builder" && <BuilderScreen onComplete={handleBuilderComplete} />}

        {screen === "delivery" && <DeliveryScreen onContinue={handleDeliveryContinue} />}
{screen === "payment" && delivery && (
          <PaymentScreen
            totalPrice={totalPrice}
            partnerCardBalance={partnerCardBalance}
            onPay={handlePay}
            onBack={() => setScreen("delivery")}
          />
        )}

        {screen === "success" && order && (
          <SuccessScreen order={order} onClose={resetAll} />
        )}
      </div>
    </div>
  );
}
