import { useState } from "react";
import { signInWithEmail, signUpWithEmail } from "../../../services/auth";

interface Props {
  onSuccess: () => void;
  onBack: () => void;
}

export default function EmailScreen({ onSuccess, onBack }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      onSuccess();
    } catch (err: any) {
      console.error("Auth error:", err);

      if (err.code === "auth/user-not-found") {
        setError("Пользователь не найден");
      } else if (err.code === "auth/wrong-password") {
        setError("Неверный пароль");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email уже используется");
      } else if (err.code === "auth/weak-password") {
        setError("Слишком простой пароль (минимум 6 символов)");
      } else if (err.code === "auth/invalid-email") {
        setError("Неверный формат email");
      } else {
        setError(err.message || "Ошибка авторизации");
      }
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
          {mode === "signin" ? "Вход по email" : "Регистрация"}
        </h1>

        <p className="auth-subtitle">
          {mode === "signin"
            ? "Введите email и пароль"
            : "Создайте новый аккаунт"}
        </p>

        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          autoFocus
        />

        <input
          type="password"
          className="auth-input"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        {error && <div className="auth-error">{error}</div>}

        <button
          type="button"
          className="auth-button"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading
            ? "Загрузка..."
            : mode === "signin"
            ? "Войти"
            : "Зарегистрироваться"}
        </button>

        <button
          type="button"
          className="auth-link"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
          }}
          disabled={isLoading}
        >
          {mode === "signin"
            ? "Нет аккаунта? Зарегистрируйтесь"
            : "Уже есть аккаунт? Войдите"}
        </button>
      </div>
    </div>
  );
}
