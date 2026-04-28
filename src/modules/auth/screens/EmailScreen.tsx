import { useState, type ChangeEvent } from "react";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";

interface Props {
  onSubmit?: (email: string) => void;
  onBack?: () => void;
}

export default function EmailScreen({ onSubmit, onBack }: Props) {
  const [email, setEmail] = useState("");

  return (
    <div className="lk-screen">
      <div className="lk-card">
        <h2 style={{ marginTop: 0 }}>Вход</h2>
        <p className="lk-muted">
          Введите адрес электронной почты для входа в личный кабинет.
        </p>

        <Input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />

        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          <Button variant="primary" onClick={() => onSubmit?.(email)} disabled={!email.trim()}>
            Продолжить
          </Button>
          <Button variant="secondary" onClick={onBack}>
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
}
