import type { ReactNode } from "react";
import { AuthProvider } from "../modules/auth/context/AuthProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
