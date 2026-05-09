import type { ReactNode } from "react";

type Props = {
  onOpenPartner?: () => void;
};

function Card({ children }: { children: ReactNode }) {
  return <section className="lk-card lk-card--glass">{children}</section>;
}

export function Mvp1Panel({ onOpenPartner }: Props) {
  return (
    <div className="lk-mvp1">
      <Card>
        <div className="lk-section-title">Ежедневный бонус</div>
        <div className="lk-section-subtitle">Заходите каждый день и забирайте баллы КОН.</div>
        <div className="lk-mvp1__reward">+5 баллов КОН</div>
        <button type="button" className="lk-button lk-button--primary">
          Забрать бонус
        </button>
      </Card>

      <Card>
        <div className="lk-section-title">Задания недели</div>
        <div className="lk-section-subtitle">Выполняйте простые действия и получайте награды.</div>

        <div className="lk-mvp1__list">
          <div className="lk-mvp1__task">
            <div>
              <div className="lk-mvp1__task-title">Откройте профиль</div>
              <div className="lk-mvp1__task-reward">+5 баллов</div>
            </div>
            <button type="button" className="lk-button lk-button--secondary">Выполнить</button>
          </div>

          <div className="lk-mvp1__task">
            <div>
              <div className="lk-mvp1__task-title">Покажите QR-карту</div>
              <div className="lk-mvp1__task-reward">+10 баллов</div>
            </div>
            <button type="button" className="lk-button lk-button--secondary">Выполнить</button>
          </div>

          <div className="lk-mvp1__task">
            <div>
              <div className="lk-mvp1__task-title">Перейдите в «Семь рек»</div>
              <div className="lk-mvp1__task-reward">+10 баллов</div>
            </div>
            <button type="button" className="lk-button lk-button--secondary" onClick={onOpenPartner}>
              Открыть
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="lk-section-title">Прогресс уровня</div>
        <div className="lk-section-subtitle">До следующего уровня осталось совсем немного.</div>
        <div className="lk-progress">
          <div className="lk-progress__bar">
            <div className="lk-progress__fill" style={{ width: "64%" }} />
          </div>
          <div className="lk-progress__label">Чем выше уровень, тем больше выгода и бонусы.</div>
        </div>
      </Card>

      <Card>
        <div className="lk-section-title">Партнёр недели — «Семь рек»</div>
        <div className="lk-section-subtitle">
          Каталог лодок, моторов и аксессуаров. За действия начисляются баллы КОН.
        </div>
        <button type="button" className="lk-button lk-button--primary" onClick={onOpenPartner}>
          Открыть «Семь рек»
        </button>
      </Card>
    </div>
  );
}
