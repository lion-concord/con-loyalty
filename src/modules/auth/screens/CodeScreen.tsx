import { useState, type ChangeEvent } from "react";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";

interface Props {
  phone?: string;
  onSubmit?: (code: string) => void;
  onBack?: () => void;
}

export default function CodeScreen({ phone, onSubmit, onBack }: Props) {
  const [code, setCode] = useState("");

  return (
    <div className="lk-screen">
      <div className="lk-card">
        <h2>Код подтверждения</h2>
        <p className="lk-muted">
          Введите код, отправленный на номер {phone || "телефона"}.
        </p>

        <Input
          type="text"
          inputMode="numeric"
          placeholder="1234"
          value={code}
onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
        />

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <Button variant="ghost" onClick={onBack}>
            Назад
          </Button>
          <Button
            variant="primary"
            onClick={() => onSubmit?.(code)}
            disabled={!code.trim()}
          >
            Войти
          </Button>
        </div>
      </div>
    </div>
  );
}
