interface Props {
  percent: number;
}

export default function CashbackLabel({ percent }: Props) {
  return <div className="lk-muted">Кешбэк: {percent}%</div>;
}
