import Button from "../../../shared/ui/Button";

interface Props {
  onPhone: () => void;
  onEmail: () => void;
}

export default function AuthMethodScreen({ onPhone, onEmail }: Props) {
  return (
    <div className="lk-screen">
      <div className="lk-card">
        <h2 style={{ marginTop: 0 }}>Вход в КОН</h2>
        <p className="lk-muted">Выберите удобный способ входа.</p>

        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <Button variant="primary" onClick={onPhone}>
            По номеру телефона
          </Button>
          <Button variant="secondary" onClick={onEmail}>
            По электронной почте
          </Button>
        </div>
      </div>
    </div>
  );
}
