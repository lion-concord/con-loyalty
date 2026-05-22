import { useMemo, useState } from "react";
import WalletApp from "../modules/wallet/WalletApp";
import LoyaltyHomeScreen from "../modules/loyalty/screens/LoyaltyHomeScreen";
import ProfileScreen from "../modules/profile/screens/ProfileScreen";
import PartnerRouter from "../components/partners/PartnerRouter";

type Screen = "loyalty" | "partner" | "profile" | "more" | "wallet";

interface Props {
  konBalance?: number;
  onOpenQr?: () => void;
  onOpenHistory?: () => void;
  onAddKon?: (amount: number) => void;
}

function MoreScreen() {
  return (
    <div className="lk-screen lk-screen--premium">
      <div className="lk-premium-glow lk-premium-glow--top" />
      <div className="lk-premium-glow lk-premium-glow--bottom" />

      <div className="lk-card lk-card--glass">
        <div className="lk-section-title">Ещё</div>

        <div className="lk-more-list">
          <a className="lk-more-link" href="#privacy" onClick={(e) => e.preventDefault()}>
            Политика конфиденциальности
          </a>
          <a className="lk-more-link" href="#terms" onClick={(e) => e.preventDefault()}>
            Пользовательское соглашение
          </a>
          <a className="lk-more-link" href="#personal-data" onClick={(e) => e.preventDefault()}>
            Согласие на обработку персональных данных
          </a>
          <a className="lk-more-link" href="#rules" onClick={(e) => e.preventDefault()}>
            Правила программы лояльности
          </a>
          <a className="lk-more-link" href="#support" onClick={(e) => e.preventDefault()}>
            Поддержка
          </a>
          <a className="lk-more-link" href="#about" onClick={(e) => e.preventDefault()}>
            О приложении
          </a>
        </div>
      </div>
    </div>
  );
}

function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer__copy">© 2026 КОН — Программа лояльности</div>
      <div className="app-footer__links">
        <a href="#privacy" onClick={(e) => e.preventDefault()}>
          Политика
        </a>
        <a href="#terms" onClick={(e) => e.preventDefault()}>
          Условия
        </a>
        <a href="#support" onClick={(e) => e.preventDefault()}>
          Поддержка
        </a>
      </div>
    </footer>
  );
}

function BottomNav({
  screen,
  onGoHome,
  onGoPartner,
  onGoProfile,
  onGoMore,
  onGoWallet,
}: {
  screen: Screen;
  onGoHome: () => void;
  onGoPartner: () => void;
  onGoProfile: () => void;
  onGoMore: () => void;
  onGoWallet: () => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="Нижняя навигация">
      <button
        type="button"
        className={"bottom-nav__item " + (screen === "loyalty" ? "active" : "")}
        onClick={onGoHome}
      >
        <span className="bottom-nav__icon">🏠</span>
        <span className="bottom-nav__label">Главная</span>
      </button>

      <button
        type="button"
        className={"bottom-nav__item " + (screen === "partner" ? "active" : "")}
        onClick={onGoPartner}
      >
        <span className="bottom-nav__icon">🤝</span>
        <span className="bottom-nav__label">Партнёры</span>
      </button>

      <button
        type="button"
        className={"bottom-nav__item " + (screen === "profile" ? "active" : "")}
        onClick={onGoProfile}
      >
        <span className="bottom-nav__icon">👤</span>
        <span className="bottom-nav__label">Профиль</span>
      </button>

      <button
        type="button"
        className={"bottom-nav__item " + (screen === "wallet" ? "active" : "")}
        onClick={onGoWallet}
      >
        <span className="bottom-nav__icon">💰</span>
        <span className="bottom-nav__label">Кошелёк</span>
      </button>

      <button
        type="button"
        className={"bottom-nav__item " + (screen === "more" ? "active" : "")}
        onClick={onGoMore}
      >
        <span className="bottom-nav__icon">☰</span>
        <span className="bottom-nav__label">Ещё</span>
      </button>
    </nav>
  );
}

export default function LkRouter({ konBalance = 0, onOpenQr, onOpenHistory, onAddKon }: Props) {
  const [screen, setScreen] = useState<Screen>("loyalty");
  const [kon, setKon] = useState<number>(konBalance);
  const [semrekCardBalance, setSemrekCardBalance] = useState<number>(0);

  const content = useMemo(() => {
    if (screen === "profile") {
      return <ProfileScreen />;
    }

    if (screen === "partner") {
      return (
        <PartnerRouter
          partnerId="semrek"
          onClose={() => setScreen("loyalty")}
          konBalance={kon}
          onAddKon={(amount) => setKon((v) => v + amount)}
          partnerCardBalance={semrekCardBalance}
          onAddPartnerCashback={(amount) => setSemrekCardBalance((v) => v + amount)}
          onSpendPartnerCashback={(amount) =>
            setSemrekCardBalance((v) => Math.max(0, v - amount))
          }
        />
      );
    }

    if (screen === "wallet") {
      return <WalletApp />;
    }

    if (screen === "more") {
      return <MoreScreen />;
    }

    return (
      <LoyaltyHomeScreen
        konBalance={kon}
        onAddKon={onAddKon ?? ((amount) => setKon((v) => v + amount))}
        onOpenQr={onOpenQr}
        onOpenHistory={onOpenHistory}
        onOpenProfile={() => setScreen("profile")}
        onOpenSemrek={() => setScreen("partner")}
      />
    );
  }, [screen, kon, semrekCardBalance, onOpenQr, onOpenHistory]);

  return (
    <div className="app-shell">
      <div className="app-shell__content">{content}</div>
      <AppFooter />
      <BottomNav
        screen={screen}
        onGoHome={() => setScreen("loyalty")}
        onGoPartner={() => setScreen("partner")}
        onGoProfile={() => setScreen("profile")}
        onGoMore={() => setScreen("more")}
        onGoWallet={() => setScreen("wallet")}
      />
    </div>
  );
}
