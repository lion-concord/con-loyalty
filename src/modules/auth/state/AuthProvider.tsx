import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type UserProfile = {
  name: string;
  phone: string;
};

type AuthContextValue = {
  isAuthorized: boolean;
  userProfile: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthorized: Boolean(userProfile),
      userProfile,
      login: (profile) => setUserProfile(profile),
      logout: () => setUserProfile(null),
    }),
    [userProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthState() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthState must be used inside AuthProvider");
  return ctx;
}
