import { useState, useEffect } from "react";
import { initRecaptcha, sendPhoneCode, verifyPhoneCode } from "../../../services/auth";
import type { ConfirmationResult } from "firebase/auth";

interface Props {
  onSuccess: () => void;
  onBack: () => void;
}

export default function PhoneScreen({ onSuccess, onBack }: Props) {
  const [phone, setPhone] = useState("");
const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Инициализируем reCAPTCHA
    initRecaptcha("recaptcha-container");
  }, []);

  async function handleSendCode() {
    if (!phone.trim()) {
      setError("Введите номер телефона");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Форматируем номер: если начинается с 8, заменяем на +7
      let formattedPhone = phone.replace(/\D/g, "");
      if (formattedPhone.startsWith("8")) {
        formattedPhone = "7" + formattedPhone.slice(1);
      }
      if (!formattedPhone.startsWith("7")) {
        formattedPhone = "7" + formattedPhone;
      }
      formattedPhone = "+" + formattedPhone;

      const result = await sendPhoneCode(formattedPhone);
      setConfirmationResult(result);
      setStep("code");
    } catch (err: any) {
      console.error("Send code error:", err);
      setError(err.message || "Ошибка отправки кода");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyCode() {
    if (!code.trim()) {
      setError("Введите код из SMS");
      return;
    }

    if (!confirmationResult) {
      setError("Ошибка: нет результата подтверждения");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await verifyPhoneCode(confirmationResult, code);
      onSuccess();
    } catch (err: any) {
      console.error("Verify code error:", err);
      setError("Неверный код");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <button
          type="button"
          className="auth-back"
          onClick={onBack}
          disabled={isLoading}
        >
          ← Назад
        </button>

        <h1 className="auth-title">
          {step === "phone" ? "Вход по телефону" : "Введите код"}
        </h1>

        {step === "phone" ? (
          <>
            <p className="auth-subtitle">
              Мы отправим SMS с кодом подтверждения
            </p>

            <input
              type="tel"
              className="auth-input"
              placeholder="+7 (___) ___-__-__"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              autoFocus
            />

            {error && <div className="auth-error">{error}</div>}

            <button
              type="button"
              className="auth-button"
              onClick={handleSendCode}
              disabled={isLoading}
            >
              {isLoading ? "Отправка..." : "Получить код"}
            </button>
          </>
        ) : (
          <>
            <p className="auth-subtitle">
              Код отправлен на номер {phone}
            </p>

            <input
              type="text"
              className="auth-input"
              placeholder="Код из SMS"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              disabled={isLoading}
              maxLength={6}
              autoFocus
            />

            {error && <div className="auth-error">{error}</div>}

            <button
              type="button"
              className="auth-button"
              onClick={handleVerifyCode}
              disabled={isLoading}
            >
              {isLoading ? "Проверка..." : "Войти"}
            </button>
<button
              type="button"
              className="auth-link"
              onClick={() => setStep("phone")}
              disabled={isLoading}
            >
              Изменить номер
            </button>
          </>
        )}

        {}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
