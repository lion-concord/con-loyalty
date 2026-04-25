import Button from "../../../shared/ui/Button";
import { formatKon } from "../../../shared/lib/formatKon";
import BalanceWidget from "../components/BalanceWidget";
import LevelBadge from "../components/LevelBadge";
import CashbackLabel from "../components/CashbackLabel";

interface Props {
  konBalance?: number;
  level?: string;
  cashbackPercent?: number;
  onOpenQr?: () => void;
  onOpenShop?: () => void;
  onOpenPartners?: () => void;
  onOpenHistory?: () => void;
}

const dailyTasks = [
  {
    id: "login",
    title: "Ежедневный вход",
    reward: 10,
    done: true,
    description: "Открывайте приложение каждый день и получайте бонусы.",
  },
  {
    id: "profile",
    title: "Заполнить профиль",
    reward: 25,
    done: false,
    description: "Добавьте имя и контактные данные для персональных предложений.",
  },
  {
    id: "partner",
    title: "Посмотреть предложения партнёров",
    reward: 15,
    done: false,
    description: "Изучите доступные акции и предложения программы.",
  },
];

export default function ЛояльностьHomeScreen({
  konBalance = 0,
  level = "Silver",
  cashbackPercent = 5,
  onOpenQr,
  onOpenShop,
  onOpenPartners,
  onOpenHistory,
}: Props) {
  const completedCount = dailyTasks.filter((item) => item.done).length;

  return (
    <div className="app-container kl-stack">
      <div className="kl-hero">
        <div className="kl-badge">КОН</div>
        <h2 className="kl-hero__title" style={{ marginTop: 12 }}>Личный кабинет</h2>
        <p className="kl-hero__text">
          Управляйте баллами КОН, отслеживайте активность и используйте предложения партнёров.
        </p>

        <div className="kl-row" style={{ marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
          <LevelBadge level={level} />
          <CashbackLabel percent={cashbackPercent} />
        </div>
      </div>

      <div className="kl-card kl-card--lift">
        <BalanceWidget balance={konBalance} />
      </div>

      <div className="kl-grid kl-grid--2">
        <div className="kl-card kl-card--soft">
          <div className="kl-card__title">Быстрые действия</div>
          <div className="kl-stack" style={{ marginTop: 12 }}>
            <Button variant="primary" onClick={onOpenQr}>
              Показать QR-карту
            </Button>
            <Button variant="secondary" onClick={onOpenPartners}>
              Партнёры
            </Button>
            <Button variant="ghost" onClick={onOpenHistory}>
              История операций
            </Button>
            <Button variant="secondary" onClick={onOpenShop}>
              Предложения
            </Button>
          </div>
        </div>

        <div className="kl-stat">
          <div className="kl-stat__label">Баланс КОН</div>
          <div className="kl-stat__value">{formatKon(konBalance)}</div>
          <div className="kl-card__text" style={{ marginTop: 8 }}>
            Ваш текущий баланс и активность в программе.
          </div>
        </div>
      </div>

      <div className="kl-card kl-card--lift">
        <h3 className="kl-card__title">Ежедневная активность</h3>
        <p className="kl-card__text">
          Выполнено задач: {completedCount} из {dailyTasks.length}
        </p>

        <div className="kl-list" style={{ marginTop: 12 }}>
{dailyTasks.map((task) => (
            <div key={task.id} className="kl-list-item">
              <div>
                <div style={{ fontWeight: 800 }}>{task.title}</div>
                <div className="kl-card__text" style={{ marginTop: 6 }}>
                  {task.description}
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: task.done ? "#86efac" : "#f5c89a" }}>
                  {task.done ? "Выполнено сегодня" : "Доступно к выполнению"}
                </div>
              </div>

              <div style={{ whiteSpace: "nowrap", fontWeight: 800 }}>
                +{task.reward} КОН
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="kl-card kl-card--accent">
        <h3 className="kl-card__title">О баллах КОН</h3>
        <p className="kl-card__text">
          Баллы начисляются за активность в приложении, участие в акциях и покупки у партнёров.
        </p>
      </div>
    </div>
  );
}
