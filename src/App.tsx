import { useAuth } from "./modules/auth/context/AuthProvider";
import AuthRouter from "./modules/auth/AuthRouter";
import LkApp from "./LkApp";

export default function App() {
  const { user, isLoading } = useAuth();

  // Временный лог для отладки
  console.log("App render:", { user, isLoading });

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
    console.log("Showing AuthRouter");
    return <AuthRouter onComplete={() => window.location.reload()} />;
  }

  console.log("Showing LkApp for user:", user.uid);
  return <LkApp />;
}
