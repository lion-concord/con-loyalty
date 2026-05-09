import { useMemo } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../../auth/context/AuthProvider";
import { signOut } from "../../../services/auth";
import { getClubStatusMeta } from "../clubStatus";
import { Mvp1Panel } from "../mvp1/Mvp1Panel";

interface Props {
  konBalance: number;
  onAddKon?: (amount: number) => void;
  onOpenQr?: () => void;
  onOpenSemrek?: () => void;
  onOpenHistory?: () => void;
  onOpenProfile?: () => void;
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`lk-card lk-card--glass ${className}`.trim()}>
      {children}
    </section>
  );
}

export default function LoyaltyHomeScreen({
  konBalance,
  onAddKon,
  onOpenQr,
  onOpenSemrek,
  onOpenProfile,
}: Props) {
  const { user } = useAuth();

  const fullName = useMemo(
    () =>
      [user?.firstName?.trim(), user?.lastName?.trim()]
        .filter(Boolean)
        .join(" ") || "Участник программы",
    [user]
  );

  const initials = useMemo(() => {
    const a = user?.firstName?.trim()?.[0] ?? "";
    const b = user?.lastName?.trim()?.[0] ?? "";
    return (a + b).toUpperCase() || "К";
  }, [user]);

  const statusMeta = useMemo(() => getClubStatusMeta(konBalance), [konBalance]);
  const currentStatus = statusMeta.current;
  const nextStatus = statusMeta.next;
  const progress = Math.max(0, Math.min(100, Number(statusMeta.progress ?? 0)));

  async function handleLogout() {
    if (!confirm("Вы уверены, что хотите выйти?")) return;
    try {
      await signOut();
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
      alert("Ошибка выхода");
    }
  }

  return (
    <div className="lk-screen lk-screen--premium">
      <div className="lk-premium-glow lk-premium-glow--top" />
      <div className="lk-premium-glow lk-premium-glow--bottom" />

      <Card className="lk-profile-card">
        <div className="lk-profile-header">
          <div className="lk-avatar-wrapper">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="lk-avatar" />
            ) : (
              <div className="lk-avatar-placeholder">{initials}</div>
            )}
          </div>

          <div className="lk-profile-info">
            <div className="lk-profile-section-title">Добро пожаловать</div>
            <h2 className="lk-profile-name">{fullName}</h2>
            <p className="lk-profile-contact">{user?.phone || user?.email || ""}</p>
            <p className="lk-profile-contact">Статус: {currentStatus.title}</p>
          </div>
        </div>
      </Card>

      <Card className="lk-balance-card">
        <div className="lk-section-title">Баланс КОН</div>

        <div className="lk-status-current">
          <div className="lk-status-badge">
            <span className="lk-status-icon">⭐</span>
            <span className="lk-status-name">Ваш текущий баланс</span>
          </div>

          <div className="lk-kon-balance">
            <span className="lk-kon-amount">{konBalance.toLocaleString("ru-RU")}</span>
            <span className="lk-kon-label">КОН</span>
          </div>
</div>
      </Card>

      <Card className="lk-club-card">
        <div className="lk-section-title">Статус</div>

        <div className="lk-status-current">
          <div className="lk-status-badge">
            <span className="lk-status-icon">{currentStatus.icon}</span>
            <span className="lk-status-name">{currentStatus.title}</span>
          </div>

          <div className="lk-kon-balance">
            <span className="lk-kon-amount">{konBalance.toLocaleString("ru-RU")}</span>
            <span className="lk-kon-label">КОН</span>
          </div>
        </div>

        <div className="lk-club-progress">
          <div className="lk-club-progress__track">
            <div
              className="lk-club-progress__fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="lk-club-progress__text">
            {nextStatus
              ? `До «${nextStatus.title}» осталось ${statusMeta.left.toLocaleString("ru-RU")} КОН`
              : "Максимальный статус достигнут"}
          </div>
        </div>
      </Card>

      {import.meta.env.VITE_ENABLE_CRYPTO === "false" && (
        <Mvp1Panel
          onAddKon={onAddKon}
          onOpenPartner={onOpenSemrek}
          onOpenQr={onOpenQr}
          onOpenProfile={onOpenProfile}
        />
      )}

      <Card className="lk-partner-card">
        <div className="lk-section-title">Партнёр недели — «Семь рек»</div>
        <div className="lk-section-subtitle">
          Каталог лодок, моторов и аксессуаров. За действия начисляются баллы КОН.
        </div>

        <button
          type="button"
          className="lk-button lk-button--primary"
          onClick={onOpenSemrek}
        >
          Открыть «Семь рек»
        </button>
      </Card>

      <Card className="lk-footer-card">
        <div className="lk-footer">
          © 2026 КОН — Программа лояльности
        </div>
        <div className="lk-footer-links">
          <button type="button" className="lk-footer-link">Политика</button>
          <button type="button" className="lk-footer-link">Условия</button>
          <button type="button" className="lk-footer-link" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </Card>
    </div>
  );
}
