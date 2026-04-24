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

export default function LoyaltyHomeScreen({
  konBalance = 0,
  level = "Silver",
  cashbackPercent = 5,
  onOpenQr,
  onOpenShop,
  onOpenPartners,
  onOpenHistory,
}: Props) {
  return (
    <div className="lk-screen">
      <div className="lk-card">
        <h2 style={{ marginTop: 0 }}>Добро пожаловать</h2>
        <LevelBadge level={level} />
        <div style={{ marginTop: 12 }}>
          <CashbackLabel percent={cashbackPercent} />
        </div>
      </div>

      <BalanceWidget balance={konBalance} />

      <div className="lk-grid">
        <Button variant="primary" onClick={onOpenQr}>
          Показать QR-карту
        </Button>
        <Button variant="secondary" onClick={onOpenShop}>
          Открыть магазин
        </Button>
        <Button variant="secondary" onClick={onOpenPartners}>
          Партнёры
        </Button>
        <Button variant="ghost" onClick={onOpenHistory}>
          История операций
        </Button>
      </div>

      <div className="lk-card">
        <h3 style={{ marginTop: 0 }}>Баланс</h3>
        <p className="lk-muted">{formatKon(konBalance)}</p>
      </div>
    </div>
  );
}
