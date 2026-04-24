import { formatKon } from "../../../shared/lib/formatKon";

interface Props {
  balance: number;
}

export default function BalanceWidget({ balance }: Props) {
  return (
    <div className="lk-card">
      <div className="lk-muted">Ваш баланс</div>
      <h2 style={{ margin: "8px 0 0" }}>{formatKon(balance)}</h2>
    </div>
  );
}
