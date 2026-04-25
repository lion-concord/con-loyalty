import { useState } from "react";
import TabBar, { type LkTab } from "../shared/ui/TabBar";
import TopBar from "../shared/ui/TopBar";
import LoyaltyHomeScreen from "../modules/loyalty/screens/LoyaltyHomeScreen";
import PartnersListScreen from "../modules/partners/screens/PartnersListScreen";
import QrScreen from "../modules/qr/screens/QrScreen";
import HistoryScreen from "../modules/history/screens/HistoryScreen";
import NotificationsScreen from "../modules/notifications/screens/NotificationsScreen";
import ProfileScreen from "../modules/profile/screens/ProfileScreen";
import PhoneScreen from "../modules/auth/screens/PhoneScreen";
import CodeScreen from "../modules/auth/screens/CodeScreen";
import { useAuth } from "../modules/auth/context/AuthProvider";
import "./styles/lk.css";

interface Props {
  konBalance?: number;
  level?: string;
}

export default function LkRouter({
  konBalance = 1240,
  level = "Silver",
}: Props) {
  const [tab, setTab] = useState<LkTab>("home");
  const {
    isAuthorized,
    step,
    phone,
    requestCode,
    verifyCode,
    goBackToPhone,
  } = useAuth();

  if (!isAuthorized) {
    return (
      <div className="lk-shell">
        <TopBar title="КОН Loyalty" />
        {step === "phone" && <PhoneScreen onSubmit={requestCode} />}
        {step === "code" && (
          <CodeScreen
            phone={phone}
            onSubmit={verifyCode}
            onBack={goBackToPhone}
          />
        )}
      </div>
    );
  }

  return (
    <div className="lk-shell">
      <TopBar title="КОН Loyalty" />
      {tab === "home" && (
        <LoyaltyHomeScreen
          konBalance={konBalance}
          level={level}
          onOpenQr={() => setTab("qr")}
          onOpenPartners={() => setTab("partners")}
          onOpenHistory={() => setTab("history")}
        />
      )}
      {tab === "partners" && <PartnersListScreen />}
      {tab === "qr" && <QrScreen />}
      {tab === "history" && <HistoryScreen />}
      {tab === "notifications" && <NotificationsScreen />}
      {tab === "profile" && <ProfileScreen />}
      <TabBar activeTab={tab} onChange={setTab} />
    </div>
  );
}
