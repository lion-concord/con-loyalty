import { useMemo } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../../auth/context/AuthProvider";
import { signOut } from "../../../services/auth";
import { CLUB_STATUSES, getClubStatusMeta } from "../clubStatus";
import { Mvp1Panel } from "../mvp1/Mvp1Panel";

interface Props {
  konBalance: number;
  level?: string;
  onAddKon?: (amount: number) => void;
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

interface SectionCardProps {
  className?: string;
  children: ReactNode;
}

function SectionCard({ className = "", children }: SectionCardProps) {
  return <div className={`lk-card lk-card--glass ${className}`}>{children}</div>;
}

interface WelcomeSectionProps {
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string;
    phone?: string | null;
    email?: string | null;
  } | null;
  initials: string;
  fullName: string;
  currentStatusTitle: string;
}

function WelcomeSection({
  user,
  initials,
  fullName,
  currentStatusTitle,
}: WelcomeSectionProps) {
  return (
    <SectionCard className="lk-profile-card">
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
          <p className="lk-profile-contact">{user?.phone || user?.email}</p>
          <p className="lk-profile-contact">Статус: {currentStatusTitle}</p>
        </div>
      </div>
    </SectionCard>
  );
}

interface KonBalanceSectionProps {
  konBalance: number;
}

function KonBalanceSection({ konBalance }: KonBalanceSectionProps) {
  return (
    <SectionCard className="lk-balance-card">
      <div className="lk-section-title">Баланс КОН</div>

      <div className="lk-status-current">
        <div className="lk-status-badge">
          <span className="lk-status-icon">⭐</span>
          <span className="lk-status-name">Ваш текущий баланс</span>
        </div>

        <div className="lk-kon-balance">
          <span className="lk-kon-amount">
            {konBalance.toLocaleString("ru-RU")}
          </span>
          <span className="lk-kon-label">КОН</span>
        </div>
      </div>
    </SectionCard>
  );
}

interface StatusProgressSectionProps {
  konBalance: number;
  currentStatus: {
    key: string;
    title: string;
    icon: string;
    perks: string[];
  };
  nextStatus?: {
    title: string;
  } | null;
  left: number;
}

function StatusProgressSection({
  konBalance,
  currentStatus,
  nextStatus,
  left,
}: StatusProgressSectionProps) {
  return (
    <SectionCard className="lk-club-card">
<div className="lk-section-title">Статус и прогресс</div>

      <div className="lk-status-current">
        <div className="lk-status-badge">
          <span className="lk-status-icon">{currentStatus.icon}</span>
          <span className="lk-status-name">{currentStatus.title}</span>
        </div>

        <div className="lk-kon-balance">
          <span className="lk-kon-amount">
            {konBalance.toLocaleString("ru-RU")}
          </span>
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
              className={`lk-status-item ${isActive ? "active" : ""} ${isCurrent ? "current" : ""}`}
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
            <strong>{left.toLocaleString("ru-RU")} КОН</strong>
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
    </SectionCard>
  );
}

interface QuickActionsSectionProps {
  onOpenProfile?: () => void;
  onOpenQr?: () => void;
  onOpenHistory?: () => void;
  onLogout: () => void;
}

function QuickActionsSection({
  onOpenProfile,
  onOpenQr,
  onOpenHistory,
  onLogout,
}: QuickActionsSectionProps) {
  return (
    <SectionCard className="lk-actions-card">
      <div className="lk-section-title">Быстрые действия</div>

      <div className="lk-profile-actions">
        <button
          type="button"
          className="lk-secondary-button"
          onClick={() => onOpenProfile?.()}
        >
          Редактировать профиль
        </button>

        {onOpenQr && (
          <button
            type="button"
            className="lk-secondary-button"
            onClick={onOpenQr}
          >
            Показать QR-карту
          </button>
        )}

        {onOpenHistory && (
          <button
            type="button"
            className="lk-secondary-button"
            onClick={onOpenHistory}
          >
            История операций
          </button>
        )}

        <button
          type="button"
          className="lk-secondary-button lk-secondary-button--danger"
          onClick={onLogout}
        >
          Выйти из аккаунта
        </button>
      </div>
    </SectionCard>
  );
}

interface PartnersSectionProps {
  onOpenSemrek?: () => void;
}

function PartnersSection({ onOpenSemrek }: PartnersSectionProps) {
  if (!onOpenSemrek) return null;

  return (
    <SectionCard className="lk-partner-card">
      <div className="lk-section-title">Партнёры</div>
      <div className="lk-partner-badge">ПАРТНЁР</div>
      <h3 className="lk-partner-title">Семь рек</h3>
      <p className="lk-partner-description">
        Лодки ПВХ: товары, услуги, тюнинг, готовые комплекты и оформление заказа.
      </p>
<div className="lk-partner-actions">
        <button
          type="button"
          className="lk-partner-button"
          onClick={onOpenSemrek}
        >
          Открыть «Семь рек»
        </button>
      </div>

      <div className="lk-partner-image">
        <img
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop"
          alt="Семь рек"
        />
      </div>
    </SectionCard>
  );
}

interface PlaceholderSectionProps {
  title: string;
  description: string;
  enabled?: boolean;
}

function PlaceholderSection({
  title,
  description,
  enabled = false,
}: PlaceholderSectionProps) {
  if (!enabled) return null;

  return (
    <SectionCard>
      <div className="lk-section-title">{title}</div>
      <p className="lk-profile-contact">{description}</p>
    </SectionCard>
  );
}

function FooterSection() {
  return <footer className="lk-footer">© 2026 КОН – Программа лояльности</footer>;
}

export default function LoyaltyHomeScreen({
  konBalance,
  onOpenQr,
  onOpenSemrek,
  onOpenHistory,
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
    <div className="lk-screen lk-screen--premium">
      <div className="lk-premium-glow lk-premium-glow--top" />
      <div className="lk-premium-glow lk-premium-glow--bottom" />

      <WelcomeSection
        user={user}
        initials={initials}
        fullName={fullName}
        currentStatusTitle={currentStatus.title}
      />

      <KonBalanceSection konBalance={konBalance} />

      <StatusProgressSection
        konBalance={konBalance}
        currentStatus={currentStatus}
        nextStatus={nextStatus}
        left={statusMeta.left}
      />

      {import.meta.env.VITE_ENABLE_CRYPTO === "false" && (
        <Mvp1Panel onOpenPartner={onOpenSemrek} />
      )}

      <QuickActionsSection
        onOpenProfile={onOpenProfile}
        onOpenQr={onOpenQr}
        onOpenHistory={onOpenHistory}
        onLogout={handleLogout}
      />

      <PartnersSection onOpenSemrek={onOpenSemrek} />

      <PlaceholderSection
        title="Акции"
        description="Здесь будут персональные предложения, спецусловия и акции от клуба и партнёров."
        enabled={false}
      />

      <PlaceholderSection
        title="Задания"
        description="Здесь появятся активности и задания для получения дополнительных баллов."
        enabled={false}
      />

      <PlaceholderSection
        title="Лидерборд"
        description="Здесь будет отображаться ваш рейтинг и позиции участников программы."
        enabled={false}
      />

      <FooterSection />
    </div>
  );
}
