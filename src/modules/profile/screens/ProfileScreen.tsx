import Button from "../../../shared/ui/Button";
import { useAuth } from "../../auth/context/AuthProvider";

export default function ProfileScreen() {
  const { phone, logout } = useAuth();

  return (
    <div className="lk-screen">
      <div className="lk-card">
        <h2>Профиль</h2>
        <p className="lk-muted">Телефон: {phone || "не указан"}</p>
        <p className="lk-muted">Здесь будут данные пользователя, настройки и выход.</p>

        <div style={{ marginTop: 12 }}>
          <Button variant="secondary" onClick={logout}>
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
}
