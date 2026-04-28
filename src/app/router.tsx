import { useState, lazy, Suspense } from "react";
import TabBar, { type LkTab } from "../shared/ui/TabBar";
import TopBar from "../shared/ui/TopBar";
import LoyaltyHomeScreen from "../modules/loyalty/screens/LoyaltyHomeScreen";
import PartnersListScreen from "../modules/partners/screens/PartnersListScreen";
import QrScreen from "../modules/qr/screens/QrScreen";
import HistoryScreen from "../modules/history/screens/HistoryScreen";
import NotificationsScreen from "../modules/notifications/screens/NotificationsScreen";
import ProfileScreen from "../modules/profile/screens/ProfileScreen";
import PhoneScreen from "../modules/auth/screens/PhoneScreen";
import EmailScreen from "../modules/auth/screens/EmailScreen";
import CodeScreen from "../modules/auth/screens/CodeScreen";
import AuthMethodScreen from "../modules/auth/screens/AuthMethodScreen";
import ProfileSetupScreen from "../modules/auth/screens/ProfileSetupScreen";
import { useAuth } from "../modules/auth/context/AuthProvider";
import "./styles/lk.css";

const PartnerRouter = lazy(() => import("../components/partners/PartnerRouter"));

interface Props {
  konBalance?: number;
  level?: string;
}

export default function LkRouter({
  konBalance = 1240,
  level = "Silver",
}: Props) {
  const [tab, setTab] = useState<LkTab>("home");
  const [activePartner, setActivePartner] = useState<string | null>(null);
  const {
    isAuthorized,
    step,
    phone,
    email,
    openPhoneStep,
    openEmailStep,
    requestPhoneCode,
    requestEmailCode,
    verifyCode,
    goBack,
  } = useAuth();

  if (!isAuthorized) {
    return (
      <div className="lk-shell">
        <TopBar title="КОН" />

        {step === "method" && (
          <AuthMethodScreen
            onPhone={openPhoneStep}
            onEmail={openEmailStep}
          />
        )}

        {step === "phone" && <PhoneScreen onSubmit={requestPhoneCode} />}

        {step === "email" && (
          <EmailScreen onSubmit={requestEmailCode} onBack={goBack} />
        )}

        {step === "code" && (
          <CodeScreen
            phone={phone || email}
            onSubmit={verifyCode}
            onBack={goBack}
          />
        )}

        {step === "profile" && <ProfileSetupScreen />}
      </div>
    );
  }

  if (activePartner) {
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
        <PartnerRouter
          partnerId={activePartner}
          onClose={() => setActivePartner(null)}
          konBalance={konBalance}
        />
      </Suspense>
    );
  }

  return (
    <div className="lk-shell">
      <TopBar title="КОН" />
      {tab === "home" && (
        <LoyaltyHomeScreen
          konBalance={konBalance}
          level={level}
          onOpenQr={() => setTab("qr")}
onOpenSemrek={() => setActivePartner("semrek")}
          onOpenHistory={() => setTab("history")}
          onOpenProfile={() => setTab("profile")}
        />
      )}
      {tab === "partners" && <PartnersListScreen onOpenPartner={(id) => setActivePartner(id)} />}
      {tab === "qr" && <QrScreen />}
      {tab === "history" && <HistoryScreen />}
      {tab === "notifications" && <NotificationsScreen />}
      {tab === "profile" && <ProfileScreen />}
      <TabBar activeTab={tab} onChange={setTab} />
    </div>
  );
}
