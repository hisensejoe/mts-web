"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { AppUser, Session, UserRole } from "@/types";
import { setAuthTokens } from "@/lib/axios";

interface SessionContextValue {
  session: Session | null;
  login: (accessToken: string, user: AppUser) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  login: () => {},
  logout: () => {},
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const login = (accessToken: string, user: AppUser) => {
    setAuthTokens(accessToken, accessToken); // Using accessToken for both since no refresh token in demo
    const role = user.role as UserRole;
    setSession({ role, user: user });
  };

  const logout = () => setSession(null);

  return (
    <SessionContext.Provider value={{ session, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}
