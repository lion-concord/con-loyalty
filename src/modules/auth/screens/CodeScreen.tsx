import { useState } from "react";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";

interface Props {
  phone: string;
  onSubmit?: (code: string) => void;
  onBack?: () => void;
}

export default function CodeScreen({ phone, onSubmit, onBack }: Props) {
  const [code, setCode] = useState("");

  return (
    <div className="lk-screen">
      <div className="lk-card">
        <h2 style={{ marginTop: 0 }}>Введите код</h2>
        <p className="lk-muted">
          Мы отправили код на {phone || "ваш контакт"}.
        </p>

        <Input
          type="text"
          inputMode="numeric"
          placeholder="1234"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        />

        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          <Button variant="primary" onClick={() => onSubmit?.(code)} disabled={code.length < 4}>
            Подтвердить
          </Button>
          <Button variant="secondary" onClick={onBack}>
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
}
