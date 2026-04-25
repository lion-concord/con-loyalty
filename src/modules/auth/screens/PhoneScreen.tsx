import { useState, type ChangeEvent } from "react";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";

interface Props {
  onSubmit?: (phone: string) => void;
}

export default function PhoneScreen({ onSubmit }: Props) {
  const [phone, setPhone] = useState("");

  return (
    <div className="lk-screen">
      <div className="lk-card">
        <h2 style={{ marginTop: 0 }}>Вход</h2>
        <p className="lk-muted">
          Введите номер телефона для входа в личный кабинет.
        </p>

        <Input
          type="tel"
          placeholder="+7 900 000-00-00"
          value={phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
        />

        <div style={{ marginTop: 12 }}>
          <Button
            variant="primary"
            onClick={() => onSubmit?.(phone)}
            disabled={!phone.trim()}
          >
            Продолжить
          </Button>
        </div>
      </div>
    </div>
  );
}
