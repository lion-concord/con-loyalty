import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AuthContextValue {
  isAuthorized: boolean;
  phone: string;
  requestCode: (phone: string) => void;
  verifyCode: (code: string) => void;
  goBackToPhone: () => void;
  logout: () => void;
  step: "phone" | "code" | "authorized";
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface Props {
  children: ReactNode;
}

const STORAGE_KEY = "lk_auth_state";

export default function AuthProvider({ children }: Props) {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "code" | "authorized">("phone");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { phone?: string; step?: string };
      if (saved.phone) setPhone(saved.phone);
      if (saved.step === "code" || saved.step === "authorized") {
        setStep(saved.step);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ phone, step }));
    } catch {
      // ignore
    }
  }, [phone, step]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthorized: step === "authorized",
      phone,
      step,
      requestCode: (nextPhone: string) => {
        setPhone(nextPhone);
        setStep("code");
      },
      verifyCode: (_code: string) => {
        setStep("authorized");
      },
      goBackToPhone: () => {
        setStep("phone");
      },
      logout: () => {
        setPhone("");
        setStep("phone");
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
      },
    }),
    [phone, step]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}
