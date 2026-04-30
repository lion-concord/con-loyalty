import { useState } from "react";
import { useAuth } from "../modules/auth/context/AuthProvider";
import LoyaltyHomeScreen from "../modules/loyalty/screens/LoyaltyHomeScreen";
import ProfileScreen from "../modules/profile/screens/ProfileScreen";

type Screen = "loyalty" | "profile";

export default function LkRouter() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>("loyalty");
  const [konBalance, setKonBalance] = useState(0);

  return (
    <div className="app">
      <div className="app-content">
        {screen === "loyalty" && <LoyaltyHomeScreen konBalance={konBalance} />}
        {screen === "profile" && <ProfileScreen />}
      </div>

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
    </div>
  );
}
