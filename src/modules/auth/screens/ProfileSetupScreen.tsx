import { useState } from "react";
import { useAuth } from "../context/AuthProvider";

interface Props {
  onComplete: () => void;
  onSkip: () => void;
}

export default function ProfileSetupScreen({ onComplete, onSkip }: Props) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  function handleSubmit() {
    // TODO: сохранить имя в Firestore или updateProfile
    console.log("Profile setup:", { firstName, lastName });
    onComplete();
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="auth-title">Настройка профиля</h1>
        <p className="auth-subtitle">
          {user?.phone || user?.email}
        </p>

        <input
          type="text"
          className="auth-input"
          placeholder="Имя"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoFocus
        />

        <input
          type="text"
          className="auth-input"
          placeholder="Фамилия"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <button
          type="button"
          className="auth-button"
          onClick={handleSubmit}
        >
          Сохранить
        </button>

        <button
          type="button"
          className="auth-link"
          onClick={onSkip}
        >
          Пропустить
        </button>
      </div>
    </div>
  );
}
