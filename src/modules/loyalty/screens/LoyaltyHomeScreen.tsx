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

export default function LoyaltyHomeScreen({
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
    <div className="lk-screen">
      <div className="lk-card">
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Личный кабинет</h2>
        <p className="lk-muted" style={{ marginTop: 0 }}>
          Управляйте баллами КОН, отслеживайте активность и используйте предложения партнёров.
        </p>

        <div style={{ marginTop: 12 }}>
          <LevelBadge level={level} />
        </div>

        <div style={{ marginTop: 12 }}>
          <CashbackLabel percent={cashbackPercent} />
        </div>
      </div>

      <BalanceWidget balance={konBalance} />

      <div className="lk-grid">
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

      <div className="lk-card">
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Ежедневная активность</h3>
        <p className="lk-muted" style={{ marginTop: 0 }}>
          Выполнено задач: {completedCount} из {dailyTasks.length}
        </p>

        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: 12,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{task.title}</div>
                  <div className="lk-muted" style={{ marginTop: 6 }}>
                    {task.description}
                  </div>
                </div>
                <div style={{ whiteSpace: "nowrap", fontWeight: 700 }}>
                  +{task.reward} КОН
                </div>
              </div>

              <div style={{ marginTop: 10, fontSize: 13 }}>
                {task.done ? "Выполнено сегодня" : "Доступно к выполнению"}
              </div>
            </div>
))}
        </div>
      </div>

      <div className="lk-card">
        <h3 style={{ marginTop: 0 }}>Баланс</h3>
        <p className="lk-muted" style={{ marginTop: 8 }}>
          {formatKon(konBalance)}
        </p>
        <p className="lk-muted">
          Баллы начисляются за активность в приложении, участие в акциях и покупки у партнёров.
        </p>
      </div>
    </div>
  );
}
