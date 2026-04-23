interface Props {
  title: string;
  onBack: () => void;
}

export default function Header({ title, onBack }: Props) {
  return (
    <div className="sem-header">
      <button className="sem-header__back" onClick={onBack}>
        ← Назад
      </button>
      <div className="sem-header__title">{title}</div>
    </div>
  );
}
