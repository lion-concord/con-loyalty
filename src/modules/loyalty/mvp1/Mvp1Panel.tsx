import type { ReactNode } from "react";

type Props = {
  onAddKon?: (amount: number) => void;
  onOpenPartner?: () => void;
  onOpenQr?: () => void;
  onOpenHistory?: () => void;
  onOpenProfile?: () => void;
};

function Card({ children }: { children: ReactNode }) {
  return <section className="lk-card lk-card--glass">{children}</section>;
}

export function Mvp1Panel({
  onAddKon,
  onOpenPartner,
  onOpenQr,
  onOpenHistory,
  onOpenProfile,
}: Props) {
  return (
    <div className="lk-mvp1">
      <Card>
        <div className="lk-section-title">Ежедневный бонус</div>
        <div className="lk-section-subtitle">Заходите каждый день и забирайте баллы КОН.</div>
        <div className="lk-mvp1__reward">+5 баллов КОН</div>
        <button
          type="button"
          className="lk-button lk-button--primary"
          onClick={() => onAddKon?.(5)}
        >
          Забрать бонус
        </button>
      </Card>

      <Card>
        <div className="lk-section-title">Задания недели</div>
        <div className="lk-section-subtitle">Выполняйте простые действия и получайте баллы.</div>

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
                onAddKon?.(5);
                onOpenProfile?.();
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
                onAddKon?.(10);
                onOpenQr?.();
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
                onAddKon?.(10);
                onOpenPartner?.();
              }}
            >
              Открыть
            </button>
          </div>

          <div className="lk-mvp1__task">
            <div>
              <div className="lk-mvp1__task-title">Откройте историю</div>
              <div className="lk-mvp1__task-reward">+3 балла</div>
            </div>
            <button
              type="button"
              className="lk-button lk-button--secondary"
              onClick={() => {
                onAddKon?.(3);
                onOpenHistory?.();
              }}
            >
              Выполнить
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
