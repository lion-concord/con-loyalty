import { useMemo } from "react";
import { useAuth } from "../../auth/context/AuthProvider";
import { signOut } from "../../../services/auth";
import { CLUB_STATUSES, getClubStatusMeta } from "../clubStatus";

interface Props {
  konBalance: number;
  level?: string;
  onOpenQr?: () => void;
  onOpenPartners?: () => void;
  onOpenSemrek?: () => void;
  onOpenHistory?: () => void;
  onOpenProfile?: () => void;
}

function getInitials(firstName?: string, lastName?: string) {
  const a = firstName?.trim()?.[0] ?? "";
  const b = lastName?.trim()?.[0] ?? "";
  return (a + b).toUpperCase() || "К";
}

export default function LoyaltyHomeScreen({
  konBalance,
  onOpenSemrek,
  onOpenProfile,
}: Props) {
  const { user } = useAuth();

  const fullName = useMemo(() => {
    return [user?.firstName?.trim(), user?.lastName?.trim()]
      .filter(Boolean)
      .join(" ") || "Участник программы";
  }, [user]);

  const initials = useMemo(
    () => getInitials(user?.firstName, user?.lastName),
    [user]
  );

  const statusMeta = useMemo(() => getClubStatusMeta(konBalance), [konBalance]);
  const currentStatus = statusMeta.current;
  const nextStatus = statusMeta.next;

  async function handleLogout() {
    if (confirm("Вы уверены, что хотите выйти?")) {
      try {
        await signOut();
        window.location.reload();
      } catch (err) {
        console.error("Logout error:", err);
        alert("Ошибка выхода");
      }
    }
  }

  return (
    <div className="lk-screen">
      <div className="lk-card lk-profile-card">
        <div className="lk-profile-header">
          <div className="lk-avatar-wrapper">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="lk-avatar" />
            ) : (
              <div className="lk-avatar-placeholder">{initials}</div>
            )}
          </div>

          <div className="lk-profile-info">
            <h2 className="lk-profile-name">{fullName}</h2>
            <p className="lk-profile-contact">{user?.phone || user?.email}</p>
          </div>
        </div>

        <div className="lk-profile-actions">
          <div className="lk-profile-section-title">Личный кабинет</div>

          <button
            type="button"
            className="lk-secondary-button"
            onClick={() => onOpenProfile?.()}
          >
            Редактировать профиль
          </button>

          <button
            type="button"
            className="lk-secondary-button"
            onClick={handleLogout}
            style={{ marginTop: "8px", background: "#ef4444" }}
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>

      <div className="lk-card lk-club-card">
        <div className="lk-section-title">Клубный статус</div>

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

        <div className="lk-status-list">
          {CLUB_STATUSES.map((status) => {
            const isActive = konBalance >= status.minKon;
const isCurrent = status.key === currentStatus.key;

            return (
              <div
                key={status.key}
                className={`lk-status-item ${isActive ? "active" : ""} ${
                  isCurrent ? "current" : ""
                }`}
              >
                <span className="lk-status-icon">{status.icon}</span>
                <span className="lk-status-name">{status.title}</span>
                <span className="lk-status-kon">{status.minKon} КОН</span>
              </div>
            );
          })}
        </div>

        {nextStatus && (
          <div className="lk-status-progress">
            <p className="lk-progress-text">
              До статуса «{nextStatus.title}» осталось{" "}
              <strong>{statusMeta.left.toLocaleString("ru-RU")} КОН</strong>
            </p>
          </div>
        )}

        <div className="lk-status-privileges">
          <div className="lk-privileges-title">
            Привилегии статуса «{currentStatus.title}»:
          </div>
          <ul className="lk-privileges-list">
            {currentStatus.perks.map((perk, index) => (
              <li key={index}>{perk}</li>
            ))}
          </ul>
        </div>
      </div>

      {onOpenSemrek && (
        <div className="lk-card lk-partner-card">
          <div className="lk-partner-badge">ПАРТНЁР</div>
          <h3 className="lk-partner-title">Семь рек</h3>
          <p className="lk-partner-description">
            Лодки ПВХ: ремонт, тюнинг, комплекты под ключ.
          </p>

          <div className="lk-partner-actions">
            <button
              type="button"
              className="lk-partner-button"
              onClick={onOpenSemrek}
            >
              Ремонт лодок
            </button>
            <button
              type="button"
              className="lk-partner-button"
              onClick={onOpenSemrek}
            >
              Тюнинг ПВХ
            </button>
            <button
              type="button"
              className="lk-partner-button"
              onClick={onOpenSemrek}
            >
              Готовые комплекты
            </button>
          </div>

          <div className="lk-partner-image">
            <img
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop"
              alt="Семь рек"
            />
          </div>
        </div>
      )}
    </div>
  );
}
