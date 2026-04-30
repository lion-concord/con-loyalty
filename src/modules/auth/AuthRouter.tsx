import { useState } from "react";
import AuthMethodScreen from "./screens/AuthMethodScreen";
import PhoneScreen from "./screens/PhoneScreen";
import EmailScreen from "./screens/EmailScreen";
import ProfileSetupScreen from "./screens/ProfileSetupScreen";

type AuthStep = "method" | "phone" | "email" | "profile";

interface Props {
  onComplete: () => void;
}

export default function AuthRouter({ onComplete }: Props) {
  const [step, setStep] = useState<AuthStep>("method");

  function handleAuthSuccess() {
    // После успешной авторизации переходим к настройке профиля
    setStep("profile");
  }

  function handleProfileComplete() {
    onComplete();
  }

  switch (step) {
    case "method":
      return (
        <AuthMethodScreen
          onSelectPhone={() => setStep("phone")}
          onSelectEmail={() => setStep("email")}
        />
      );

    case "phone":
      return (
        <PhoneScreen
          onSuccess={handleAuthSuccess}
          onBack={() => setStep("method")}
        />
      );

    case "email":
      return (
        <EmailScreen
          onSuccess={handleAuthSuccess}
          onBack={() => setStep("method")}
        />
      );

    case "profile":
      return (
        <ProfileSetupScreen
          onComplete={handleProfileComplete}
          onSkip={handleProfileComplete}
        />
      );

    default:
      return null;
  }
}
