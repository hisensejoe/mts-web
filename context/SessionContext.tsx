"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { Session, UserAccount, UserRole } from "@/types";
import axiosInstance, { clearAuthTokens, getAuthTokens, setAuthTokens } from "@/lib/axios";
import { AxiosError } from "axios";

interface SessionContextValue {
  session: Session | null;
  isLoading: boolean;
  login: (accessToken: string, role: UserRole, user: UserAccount) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  isLoading: false,
  login: () => {},
  logout: () => {},
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // get user from api call /api/v1/auth/me
  const fetchUserDetails = async () => {
    try {
      // make api call
      setLoading(true);
      const res = await axiosInstance.get<UserAccount>("/api/v1/auth/me");
      const user0 = res.data;
      console.log("Fetched user details:", user0);
      setSession({ role: user0.role.name, user: user0 });
    } catch (err) {
      let errorMessage = "An error occurred. Please try again.";
      if (err instanceof AxiosError) {
        errorMessage =
          err.response?.data?.message || err.message || errorMessage;
        setSession(null); // Clear session on error (e.g., token expired)
      } else if (err instanceof Error) {
        errorMessage = err.message;
        setSession(null); // Clear session on error (e.g., token expired)
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On mount, check if there's an existing session (e.g., from localStorage)
    fetchUserDetails();
  }, []);

  const login = (accessToken: string, role: UserRole, user: UserAccount) => {
    setAuthTokens(accessToken, accessToken); // Using accessToken for both since no refresh token in demo
    setSession({ role, user: user });
  };

  const logout = () => {
    clearAuthTokens();
    return setSession(null);
  };

  return (
    <SessionContext.Provider value={{ session, isLoading: loading, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}
