interface Props {
  onSelectPhone: () => void;
  onSelectEmail: () => void;
}

export default function AuthMethodScreen({ onSelectPhone, onSelectEmail }: Props) {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="auth-title">Вход в КОН</h1>
        <p className="auth-subtitle">Выберите способ авторизации</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
          <button
            type="button"
            className="auth-button"
            onClick={onSelectPhone}
          >
            📱 По номеру телефона
          </button>

          <button
            type="button"
            className="auth-button auth-button-secondary"
            onClick={onSelectEmail}
          >
            ✉️ По email
          </button>
        </div>

        <div className="auth-note" style={{ marginTop: 24 }}>
          Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности
        </div>
      </div>
    </div>
  );
}
