import { useState } from "react";
import { useAuth } from "../modules/auth/context/AuthProvider";
import LoyaltyHomeScreen from "../modules/loyalty/screens/LoyaltyHomeScreen";
import ProfileScreen from "../modules/profile/screens/ProfileScreen";
import PartnerRouter from "../partners/PartnerRouter";

type Screen = "loyalty" | "profile" | "partner";

export default function LkRouter() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>("loyalty");
  const [konBalance, setKonBalance] = useState(0);
  const [partnerModule, setPartnerModule] = useState<string | null>(null);

  function handleOpenSemrek() {
    setPartnerModule("semrek");
    setScreen("partner");
  }

  function handleClosePartner() {
    setPartnerModule(null);
    setScreen("loyalty");
  }

  function handleAddKon(amount: number) {
    setKonBalance((prev) => prev + amount);
  }

  function handleSpendKon(amount: number) {
    setKonBalance((prev) => Math.max(0, prev - amount));
  }

  return (
    <div className="app">
      <div className="app-content">
        {screen === "loyalty" && (
          <LoyaltyHomeScreen
            konBalance={konBalance}
            onOpenSemrek={handleOpenSemrek}
            onOpenProfile={() => setScreen("profile")}
          />
        )}
        {screen === "profile" && <ProfileScreen />}
        {screen === "partner" && partnerModule && (
          <PartnerRouter
            module={partnerModule}
            konBalance={konBalance}
            onAddKon={handleAddKon}
            onSpendKon={handleSpendKon}
            onClose={handleClosePartner}
          />
        )}
      </div>

      {screen !== "partner" && (
        <nav className="bottom-nav">
          <button
            type="button"
            className={screen === "loyalty" ? "active" : ""}
            onClick={() => setScreen("loyalty")}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Главная</span>
          </button>
          <button
            type="button"
            className={screen === "profile" ? "active" : ""}
            onClick={() => setScreen("profile")}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Профиль</span>
          </button>
        </nav>
      )}
    </div>
  );
}
