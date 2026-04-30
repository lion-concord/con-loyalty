import { useAuth } from "./modules/auth/context/AuthProvider";
import AuthRouter from "./modules/auth/AuthRouter";
import LkApp from "./LkApp";

export default function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontSize: 18,
        color: "#666"
      }}>
        Загрузка...
      </div>
    );
  }

  if (!user) {
    return <AuthRouter onComplete={() => window.location.reload()} />;
  }

  return <LkApp />;
}
