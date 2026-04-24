import type { ReactNode } from "react";
import AuthProvider from "../modules/auth/context/AuthProvider";

interface Props {
  children: ReactNode;
}

export default function AppProviders({ children }: Props) {
  return <AuthProvider>{children}</AuthProvider>;
}
