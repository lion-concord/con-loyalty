import type { ReactNode } from "react";

type Props = {
  onAddKon?: (amount: number) => void;
  onOpenPartner?: () => void;
  onOpenQr?: () => void;
  onOpenProfile?: () => void;
};

function Card({ children }: { children: ReactNode }) {
  return <section className="lk-card lk-card--glass">{children}</section>;
}

function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function claimDailyReward(
  taskId: string,
  amount: number,
  onAddKon?: (amount: number) => void
) {
  const today = getTodayKey();
  const storageKey = `mvp1:${taskId}:${today}`;

  if (localStorage.getItem(storageKey) === "done") {
    alert("Сегодня награда за это действие уже получена.");
    return false;
  }

  localStorage.setItem(storageKey, "done");
  onAddKon?.(amount);
  return true;
}

export function Mvp1Panel({
  onAddKon,
  onOpenPartner,
  onOpenQr,
  onOpenProfile,
}: Props) {
  return (
    <div className="lk-mvp1">
      <Card>
        <div className="lk-section-title">Ежедневный бонус</div>
        <div className="lk-section-subtitle">
          Заходите каждый день и забирайте баллы КОН.
        </div>
        <div className="lk-mvp1__reward">+5 баллов КОН</div>
        <button
          type="button"
          className="lk-button lk-button--primary"
          onClick={() => {
            claimDailyReward("daily-bonus", 5, onAddKon);
          }}
        >
          Забрать бонус
        </button>
      </Card>

      <Card>
        <div className="lk-section-title">Задания недели</div>
        <div className="lk-section-subtitle">
          Выполняйте простые действия и получайте баллы.
        </div>

        <div className="lk-mvp1__list">
          <div className="lk-mvp1__task">
            <div>
              <div className="lk-mvp1__task-title">Откройте профиль</div>
              <div className="lk-mvp1__task-reward">+5 баллов</div>
            </div>
            <button
              type="button"
              className="lk-button lk-button--secondary"
              onClick={() => {
                const ok = claimDailyReward("open-profile", 5, onAddKon);
                if (ok) onOpenProfile?.();
              }}
            >
              Выполнить
            </button>
          </div>

          <div className="lk-mvp1__task">
            <div>
              <div className="lk-mvp1__task-title">Покажите QR-карту</div>
              <div className="lk-mvp1__task-reward">+10 баллов</div>
            </div>
            <button
              type="button"
              className="lk-button lk-button--secondary"
              onClick={() => {
                const ok = claimDailyReward("open-qr", 10, onAddKon);
                if (ok) onOpenQr?.();
              }}
            >
              Выполнить
            </button>
          </div>

          <div className="lk-mvp1__task">
            <div>
              <div className="lk-mvp1__task-title">Перейдите в «Семь рек»</div>
              <div className="lk-mvp1__task-reward">+10 баллов</div>
            </div>
            <button
              type="button"
              className="lk-button lk-button--secondary"
              onClick={() => {
                const ok = claimDailyReward("open-semrek", 10, onAddKon);
                if (ok) onOpenPartner?.();
              }}
>
              Открыть
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
